import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const categories = [
  {
    id: 'graphic',
    label: '平面創作組',
    file: 'C:/Users/Karen/Downloads/_香港校際AI生成創作大賽2026《GEN出你想》作品 - Copy of 平面創作組.csv',
  },
  {
    id: '3d',
    label: '3D設計組',
    file: 'C:/Users/Karen/Downloads/_香港校際AI生成創作大賽2026《GEN出你想》作品 - 3D設計組.csv',
  },
  {
    id: 'video',
    label: '影片製作組',
    file: 'C:/Users/Karen/Downloads/_香港校際AI生成創作大賽2026《GEN出你想》作品 - 影片製作組.csv',
  },
  {
    id: 'game',
    label: '遊戲及應用程式組',
    file: 'C:/Users/Karen/Downloads/_香港校際AI生成創作大賽2026《GEN出你想》作品 - 遊戲及應用程式組.csv',
  },
];

const AWARD_RANK = { 一等獎: 1, 二等獎: 2, 三等獎: 3 };
const GRADE_KEYS = {
  primary: '高小組',
  junior: '初中組',
  senior: '高中組',
  special: '特殊教育組',
};

function normGrade(s) {
  if (!s) return null;
  if (s.includes('高小')) return 'primary';
  if (s.includes('初中')) return 'junior';
  if (s.includes('高中')) return 'senior';
  if (s.includes('特殊')) return 'special';
  return null;
}

function normAward(g) {
  if (!g) return null;
  const t = String(g).trim();
  if (!t || t === '參與') return null;
  if (t === '一等' || t === '二等' || t === '三等') return `${t}獎`;
  if (['一等獎', '二等獎', '三等獎'].includes(t)) return t;
  return null;
}

function isValidName(n) {
  if (!n || !String(n).trim()) return false;
  const t = String(n).trim();
  if (/^(N\/A|不適用|n\/a|NA)$/i.test(t)) return false;
  if (t.includes('@')) return false;
  return true;
}

function normSchool(s) {
  if (!s) return '';
  return String(s).trim().replace(/\s+/g, '');
}

function findCol(headers, patterns) {
  for (let i = 0; i < headers.length; i++) {
    const h = (headers[i] || '').trim();
    for (const p of patterns) {
      if (h.includes(p)) return i;
    }
  }
  return -1;
}

function findNameCols(headers) {
  const cols = [];
  headers.forEach((h, i) => {
    if ((h || '').includes('參賽者姓名')) cols.push(i);
  });
  return cols;
}

function parseCategory({ id, label, file }) {
  const raw = readFileSync(file, 'utf-8');
  const rows = parse(raw, { relax_column_count: true, skip_empty_lines: true });
  const headers = rows[0];
  const gradeCol = findCol(headers, ['參賽級別']);
  const schoolCol = findCol(headers, ['學校名稱']);
  const awardCol = headers.findIndex((h) => (h || '').trim() === 'Grade');
  const nameCols = findNameCols(headers);

  /** @type {Map<string, { school: string, student: string, award: string }>} */
  const byKey = new Map();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const award = normAward(row[awardCol]);
    if (!award) continue;

    const gradeKey = normGrade(row[gradeCol]);
    if (!gradeKey) continue;

    let school = normSchool(row[schoolCol]);
    const names = new Set();
    for (const col of nameCols) {
      const name = row[col];
      if (isValidName(name)) names.add(String(name).trim());
    }

    // Some rows swap school/name in 平面創作組
    if (!school && names.size === 1) {
      const onlyName = [...names][0];
      if (onlyName.length > 4 && (onlyName.includes('小學') || onlyName.includes('中學'))) {
        school = onlyName;
        names.clear();
      }
    }

    if (!school) continue;

    for (const student of names) {
      const dedupeKey = `${gradeKey}|${school}|${student}`;
      const existing = byKey.get(dedupeKey);
      if (!existing || AWARD_RANK[award] < AWARD_RANK[existing.award]) {
        byKey.set(dedupeKey, { school, student, award });
      }
    }
  }

  const grouped = { primary: [], junior: [], senior: [], special: [] };
  byKey.clear();
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const award = normAward(row[awardCol]);
    if (!award) continue;
    const gradeKey = normGrade(row[gradeCol]);
    if (!gradeKey) continue;
    let school = normSchool(row[schoolCol]);
    const names = new Set();
    for (const col of nameCols) {
      const name = row[col];
      if (isValidName(name)) names.add(String(name).trim());
    }
    if (!school && names.size === 1) {
      const onlyName = [...names][0];
      if (onlyName.length > 4 && (onlyName.includes('小學') || onlyName.includes('中學'))) {
        school = onlyName;
        names.clear();
      }
    }
    if (!school) continue;
    for (const student of names) {
      const dedupeKey = `${gradeKey}|${school}|${student}`;
      const existing = byKey.get(dedupeKey);
      if (!existing || AWARD_RANK[award] < AWARD_RANK[existing.award]) {
        byKey.set(dedupeKey, { gradeKey, school, student, award });
      }
    }
  }

  for (const { gradeKey, school, student, award } of byKey.values()) {
    grouped[gradeKey].push({ school, student, award });
  }

  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => {
      const schoolCmp = a.school.localeCompare(b.school, 'zh-Hant');
      if (schoolCmp !== 0) return schoolCmp;
      const awardCmp = AWARD_RANK[a.award] - AWARD_RANK[b.award];
      if (awardCmp !== 0) return awardCmp;
      return a.student.localeCompare(b.student, 'zh-Hant');
    });
  }

  return { id, label, grouped };
}

const all = categories.map(parseCategory);
const outDir = join(root, 'src/data/gen2026-results');
mkdirSync(outDir, { recursive: true });

for (const cat of all) {
  writeFileSync(join(outDir, `${cat.id}.json`), JSON.stringify(cat, null, 2), 'utf-8');
  for (const gk of Object.keys(cat.grouped)) {
    console.log(`${cat.label} ${GRADE_KEYS[gk]}: ${cat.grouped[gk].length} winners`);
  }
}

writeFileSync(
  join(outDir, 'index.json'),
  JSON.stringify(
    {
      title: '香港校際AI生成創作大賽2026《GEN出你想》得獎名單',
      categories: all.map((c) => ({ id: c.id, label: c.label })),
    },
    null,
    2
  ),
  'utf-8'
);

console.log('Done. Wrote to', outDir);
