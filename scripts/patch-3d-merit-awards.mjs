import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '../src/data/gen2026-results/3d.json');
const data = JSON.parse(readFileSync(path, 'utf8'));

const AWARD_RANK = { 一等獎: 1, 二等獎: 2, 三等獎: 3, 優異獎: 4 };

const norm = (s) => String(s ?? '').trim().replace(/\s+/g, ' ');
const normStudent = (s) => norm(s).toLowerCase();

/** @type {Record<string, Array<[string, string]>>} */
const PROMOTIONS = {
  primary: [
    ['聖公會李兆強小學', '楊叡霖'],
    ['聖公會李兆強小學', '楊肇浠'],
    ['聖公會李兆強小學', 'CHIU SUM YING'],
    ['聖公會李兆強小學', '曾台朗'],
    ['聖公會李兆強小學', '袁思琳'],
    ['聖公會李兆強小學', 'Liu Tsz Yuk'],
  ],
  junior: [
    ['上水官立中學', '覃惠蘭'],
    ['上水官立中學', '彭偉滔'],
  ],
  senior: [
    ['上水官立中學', '洪澤鑒'],
    ['香港道教聯合會鄧顯紀念中學', 'Kwok Wing Ni'],
  ],
};

function promoteGrade(gradeKey, pairs) {
  let changed = 0;
  const missing = [];

  for (const [targetSchool, targetStudent] of pairs) {
    const wantStudent = normStudent(targetStudent);
    let found = false;

    for (const e of data.grouped[gradeKey]) {
      if (norm(e.school) !== norm(targetSchool)) continue;
      if (normStudent(e.student) !== wantStudent) continue;
      found = true;
      if (e.award === '三等獎') {
        e.award = '優異獎';
        changed++;
      } else if (e.award !== '優異獎') {
        console.warn(
          `[${gradeKey}] ${targetSchool} / ${e.student}: expected 三等獎, got ${e.award}`
        );
      }
      break;
    }

    if (!found) missing.push(`${targetSchool} | ${targetStudent}`);
  }

  return { changed, missing };
}

function sortGrade(entries) {
  entries.sort((a, b) => {
    const schoolCmp = a.school.localeCompare(b.school, 'zh-Hant');
    if (schoolCmp !== 0) return schoolCmp;
    const awardCmp = (AWARD_RANK[a.award] ?? 99) - (AWARD_RANK[b.award] ?? 99);
    if (awardCmp !== 0) return awardCmp;
    return a.student.localeCompare(b.student, 'zh-Hant');
  });
}

let totalChanged = 0;
for (const [gradeKey, pairs] of Object.entries(PROMOTIONS)) {
  const { changed, missing } = promoteGrade(gradeKey, pairs);
  totalChanged += changed;
  sortGrade(data.grouped[gradeKey]);
  console.log(`${gradeKey}: promoted ${changed}, missing ${missing.length}`);
  if (missing.length) missing.forEach((m) => console.warn('  missing:', m));
}

writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Total promoted:', totalChanged);
