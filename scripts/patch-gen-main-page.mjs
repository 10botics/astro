import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagePath = join(
  __dirname,
  '../src/pages/《GEN出你想》香港校際AI生成創作大賽2026.astro'
);

let content = readFileSync(pagePath, 'utf8');

if (!content.includes("import CTAButton from '../components/CTAButton.astro';")) {
  content = content.replace(
    "import ContactSection from '../components/ContactSection.astro';\r\n",
    "import ContactSection from '../components/ContactSection.astro';\r\nimport CTAButton from '../components/CTAButton.astro';\r\n"
  );
  content = content.replace(
    "import ContactSection from '../components/ContactSection.astro';\n",
    "import ContactSection from '../components/ContactSection.astro';\nimport CTAButton from '../components/CTAButton.astro';\n"
  );
}

const tag = 'd' + 'iv';
const newSection = `    <!-- Latest News Section -->
    <section id="latest-news" class="py-16 bg-white">
      <${tag} class="container mx-auto px-4">
        <${tag} class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">最新消息</h2>
        </${tag}>
        <${tag} class="max-w-4xl mx-auto text-center">
          <p class="text-lg text-gray-700 mb-8 leading-relaxed">
            衷心感謝各位對香港校際AI生成創作大賽2026《GEN出你想》的熱烈參與及支持，比賽結果現已公佈!
          </p>
          <CTAButton
            href="/《GEN出你想》香港校際AI生成創作大賽2026得獎名單"
            text="比賽結果"
            variant="primary"
            size="lg"
          />
        </${tag}>
      </${tag}>
    </section>`;

const replaced = content.replace(
  /    <!-- Stay Updated Section -->[\s\S]*?    <\/section>\r?\n\r?\n    <!-- Contact Section -->/,
  `${newSection}\n\n    <!-- Contact Section -->`
);

if (replaced === content) {
  throw new Error('Could not find Stay Updated section to replace');
}

writeFileSync(pagePath, replaced, 'utf8');
console.log('Patched GEN main page');
