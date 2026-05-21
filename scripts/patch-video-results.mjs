import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '../src/data/gen2026-results/video.json');
const data = JSON.parse(readFileSync(path, 'utf8'));

const AWARD_RANK = { 一等獎: 1, 二等獎: 2, 三等獎: 3, 優異獎: 4 };

const norm = (s) => String(s ?? '').trim().replace(/\s+/g, ' ');

function match(entry, school, student, award) {
  return (
    norm(entry.school) === school &&
    norm(entry.student) === student &&
    entry.award === award
  );
}

function sortGrade(entries) {
  entries.sort((a, b) => {
    const schoolCmp = a.school.localeCompare(b.school, 'zh-Hant');
    if (schoolCmp !== 0) return schoolCmp;
    const awardCmp = AWARD_RANK[a.award] - AWARD_RANK[b.award];
    if (awardCmp !== 0) return awardCmp;
    return a.student.localeCompare(b.student, 'zh-Hant');
  });
}

// 高小組: Delete 拔萃女小學, not applicable, 二等獎
data.grouped.primary = data.grouped.primary.filter(
  (e) => !match(e, '拔萃女小學', 'not applicable', '二等獎')
);

// 高小組: Delete 拔萃女小學, 余安之, 二等獎
data.grouped.primary = data.grouped.primary.filter(
  (e) => !match(e, '拔萃女小學', '余安之', '二等獎')
);

// 初中組
data.grouped.junior = data.grouped.junior.filter((e) => {
  if (match(e, '石籬天主教中學', '25-26年度1A班同學', '一等獎')) return false;
  if (norm(e.school) === '路德會救主學校') return false;
  return true;
});

const newJuniorWinners = [
  { school: '石籬天主教中學', student: '鄧梓愉', award: '一等獎' },
  { school: '石籬天主教中學', student: '梁凱嵐', award: '一等獎' },
  { school: '石籬天主教中學', student: '謝焯嵐', award: '一等獎' },
  { school: '石籬天主教中學', student: '徐栢希', award: '一等獎' },
  { school: '石籬天主教中學', student: '張浩恩', award: '一等獎' },
];

for (const entry of newJuniorWinners) {
  const exists = data.grouped.junior.some(
    (e) =>
      norm(e.school) === entry.school &&
      norm(e.student) === entry.student &&
      e.award === entry.award
  );
  if (!exists) data.grouped.junior.push(entry);
}

// 初中組: CSV typo 鄧賢 → 鄧顯（與該校其他得獎者一致）
const tangYinWrong = '香港道教聯合會鄧賢紀念中學';
const tangYinRight = '香港道教聯合會鄧顯紀念中學';
for (const e of data.grouped.junior) {
  if (
    norm(e.school) === tangYinWrong &&
    e.award === '二等獎' &&
    (norm(e.student) === '趙汝桐' || norm(e.student) === '劉梓浩')
  ) {
    e.school = tangYinRight;
  }
}

const additionalJuniorWinners = [
  { school: '上水官立中學', student: '許恩嘉', award: '優異獎' },
  { school: '上水官立中學', student: '羅騏', award: '優異獎' },
  { school: '上水官立中學', student: '彭偉滔', award: '優異獎' },
  { school: '上水官立中學', student: '葉焯堃', award: '二等獎' },
  { school: '上水官立中學', student: '王銘辰', award: '二等獎' },
  { school: '上水官立中學', student: '林建浚', award: '二等獎' },
  { school: '明愛聖若瑟中學', student: '謝錚江', award: '一等獎' },
];

for (const entry of additionalJuniorWinners) {
  const exists = data.grouped.junior.some(
    (e) =>
      norm(e.school) === entry.school &&
      norm(e.student) === entry.student &&
      e.award === entry.award
  );
  if (!exists) data.grouped.junior.push(entry);
}

// 高中組: remove erroneous duplicate spelling (Cheuk lok yin retained)
data.grouped.senior = data.grouped.senior.filter(
  (e) => !match(e, '萬鈞匯知中學', 'Chenk lok yin', '二等獎')
);

// 特殊學校組
data.grouped.special = data.grouped.special.filter((e) => {
  if (match(e, '路德會救主學校', 'NIL', '一等獎')) return false;
  if (match(e, '路德會救主學校', '/', '二等獎')) return false;
  return true;
});

for (const key of Object.keys(data.grouped)) {
  sortGrade(data.grouped[key]);
}

writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Patched video.json');
