import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '../src/data/gen2026-results/game.json');
const data = JSON.parse(readFileSync(path, 'utf8'));

const AWARD_RANK = { 一等獎: 1, 二等獎: 2, 三等獎: 3 };

// 高小組：所有一等獎改為二等獎（賽後修訂）
for (const e of data.grouped.primary) {
  if (e.award === '一等獎') e.award = '二等獎';
}

data.grouped.primary.sort((a, b) => {
  const schoolCmp = a.school.localeCompare(b.school, 'zh-Hant');
  if (schoolCmp !== 0) return schoolCmp;
  const awardCmp = AWARD_RANK[a.award] - AWARD_RANK[b.award];
  if (awardCmp !== 0) return awardCmp;
  return a.student.localeCompare(b.student, 'zh-Hant');
});

writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Patched game.json (primary: all 一等獎 → 二等獎)');
