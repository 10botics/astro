import fs from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_CATEGORIES = [
  '過往活動',
  '文章',
  '最新消息',
  '資助申請',
  '比賽',
  '課程',
  'AI人工智能課程',
  '其他',
];

function normalizeNewlines(s) {
  return (s ?? '').replace(/\r\n/g, '\n');
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSection(issueBody, heading) {
  const body = normalizeNewlines(issueBody);
  const re = new RegExp(
    `^###\\s+${escapeRegex(heading)}\\s*\\n+([\\s\\S]*?)(?=\\n###\\s+|\\n\\s*$)`,
    'm',
  );
  const match = body.match(re);
  if (!match) return '';
  const value = match[1].trim();
  if (value === '_No response_') return '';
  return value;
}

function toIsoDate(input) {
  const raw = (input ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function yamlQuote(value) {
  // Double-quoted YAML string, escaped like JSON.
  return JSON.stringify(String(value ?? ''));
}

function yamlInlineArray(values) {
  const arr = Array.isArray(values) ? values : [];
  return `[${arr.map((v) => yamlQuote(v)).join(', ')}]`;
}

function sanitizeFilenameSegment(segment) {
  let s = String(segment ?? '').trim();
  // Windows reserved characters: < > : " / \ | ? *
  s = s.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-');
  s = s.replace(/\s+/g, '-');
  s = s.replace(/-+/g, '-');
  s = s.replace(/^\.+/, '');
  s = s.replace(/\.+$/, '');
  s = s.replace(/^-+|-+$/g, '');
  if (!s) return 'news';
  return s.slice(0, 120);
}

function uniqStrings(values, max = 12) {
  const out = [];
  const seen = new Set();
  for (const v of values ?? []) {
    const s = String(v ?? '').trim();
    if (!s) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}

async function callOpenRouter({ apiKey, model, prompt }) {
  const referer =
    process.env.OPENROUTER_REFERRER ||
    (process.env.GITHUB_REPOSITORY
      ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
      : undefined);
  const title = process.env.OPENROUTER_APP_NAME || 'astro-news-generator';

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (referer) headers['HTTP-Referer'] = referer;
  if (title) headers['X-Title'] = title;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You generate a single Astro news Markdown post draft. Return ONLY valid JSON (no markdown fences).',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenRouter error ${res.status}: ${text.slice(0, 500)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenRouter response missing content');

  const first = content.indexOf('{');
  const last = content.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) {
    throw new Error(`Model did not return JSON. Got: ${content.slice(0, 200)}`);
  }

  return JSON.parse(content.slice(first, last + 1));
}

function buildPrompt(input) {
  return [
    'Given the following inputs, produce JSON with keys:',
    '- category: one of ' + ALLOWED_CATEGORIES.map((c) => `"${c}"`).join(', '),
    '- tags: array of 2–10 concise tags (strings), matching the style in the repo (Traditional Chinese / mixed EN).',
    '- content: markdown body ONLY (no frontmatter).',
    '',
    'Hard rules:',
    '- Do NOT invent image paths. Only use the provided image paths.',
    '- Do NOT invent external links. Only use the provided links.',
    '- Write in the same language as the title/notes (default to Traditional Chinese).',
    '',
    'Inputs (verbatim):',
    JSON.stringify(input, null, 2),
  ].join('\n');
}

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error('GITHUB_EVENT_PATH is not set');

  const eventRaw = await fs.readFile(eventPath, 'utf8');
  const event = JSON.parse(eventRaw);
  const issue = event.issue;
  if (!issue) throw new Error('This workflow must run on an issue event');

  const issueNumber = issue.number;
  const openerLogin = issue?.user?.login ?? 'admin';

  const issueBody = issue.body ?? '';
  const publishDate = toIsoDate(extractSection(issueBody, 'Publish date (YYYY-MM-DD)'));
  const title = extractSection(issueBody, 'Title') || `News ${publishDate}`;
  const description = extractSection(issueBody, 'Description (SEO)') || '';
  const featuredImage = extractSection(issueBody, 'featuredImage (path)') || '';
  const SEOImage = extractSection(issueBody, 'SEOImage (path)') || '';
  const whatHappened = extractSection(issueBody, 'What happened? (notes for AI)') || '';

  const extraImages = uniqStrings(
    extractSection(issueBody, 'Extra images to embed (optional)')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean),
    20,
  );

  const externalLinks = uniqStrings(
    extractSection(issueBody, 'External links (optional)')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => /^https?:\/\/\S+$/i.test(l)),
    20,
  );

  const input = {
    title,
    publishDate,
    description,
    featuredImage,
    SEOImage,
    notes: whatHappened,
    extraImages,
    externalLinks,
    author: openerLogin,
  };

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = 'openrouter/free';

  let category = '其他';
  let tags = [];
  let content = '';

  if (apiKey) {
    const prompt = buildPrompt(input);
    const json = await callOpenRouter({ apiKey, model, prompt });

    if (typeof json?.category === 'string' && ALLOWED_CATEGORIES.includes(json.category)) {
      category = json.category;
    }

    tags = uniqStrings(Array.isArray(json?.tags) ? json.tags : [], 12);
    content = typeof json?.content === 'string' ? json.content.trim() : '';
  } else {
    // Safe fallback if secret isn't configured yet.
    category = '其他';
    tags = [];
    content = whatHappened.trim();
  }

  const bodyParts = [];
  if (extraImages.length) {
    for (const img of extraImages) bodyParts.push(`![](${img})`);
    bodyParts.push('');
  }
  if (content) bodyParts.push(content);
  if (externalLinks.length) {
    bodyParts.push('', '## 相關連結', ...externalLinks.map((u) => `- ${u}`));
  }

  const markdown = [
    '---',
    `title: ${yamlQuote(title)}`,
    `publishDate: ${publishDate}`,
    `description: ${yamlQuote(description)}`,
    `featuredImage: ${yamlQuote(featuredImage)}`,
    `SEOImage: ${yamlQuote(SEOImage)}`,
    `category: ${yamlQuote(category)}`,
    `tags: ${yamlInlineArray(tags)}`,
    `author: ${yamlQuote(openerLogin)}`,
    '---',
    '',
    bodyParts.join('\n').trimEnd(),
    '',
  ].join('\n');

  const newsDir = path.join(process.cwd(), 'src', 'content', 'news');
  const slug = sanitizeFilenameSegment(title);
  let fileName = `${publishDate}-${slug}.md`;
  let targetPath = path.join(newsDir, fileName);

  try {
    await fs.access(targetPath);
    fileName = `${publishDate}-${slug}-issue-${issueNumber}.md`;
    targetPath = path.join(newsDir, fileName);
  } catch {
    // does not exist
  }

  await fs.mkdir(newsDir, { recursive: true });
  await fs.writeFile(targetPath, markdown, 'utf8');

  // GitHub Action log annotation
  // eslint-disable-next-line no-console
  console.log(`Generated: ${path.relative(process.cwd(), targetPath)}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
