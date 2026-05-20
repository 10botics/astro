import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const file =
  'C:/Users/Karen/Downloads/_香港校際AI生成創作大賽2026《GEN出你想》作品 - 3D設計組 (1).csv';

const AWARD_RANK = { 一等獎: 1, 二等獎: 2, 三等獎: 3, 優異獎: 4 };

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
  if (['一等獎', '二等獎', '三等獎', '優異獎'].includes(t)) return t;
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

const raw = readFileSync(file, 'utf-8');
const rows = parse(raw, { relax_column_count: true, skip_empty_lines: true });
const headers = rows[0];
const gradeCol = headers.findIndex((h) => (h || '').includes('參賽級別'));
const schoolCol = headers.findIndex((h) => (h || '').includes('學校名稱'));
const awardCol = headers.findIndex((h) => (h || '').trim() === 'Grade');
const nameCol = headers.findIndex((h) => (h || '').includes('參賽者姓名'));

/** @type {Map<string, { gradeKey: string, school: string, student: string, award: string }>} */
const byKey = new Map();

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const award = normAward(row[awardCol]);
  if (!award) continue;

  const gradeKey = normGrade(row[gradeCol]);
  if (!gradeKey) continue;

  const school = normSchool(row[schoolCol]);
  const student = row[nameCol] ? String(row[nameCol]).trim() : '';
  if (!school || !isValidName(student)) continue;

  const dedupeKey = `${gradeKey}|${school}|${student}`;
  const existing = byKey.get(dedupeKey);
  if (!existing || AWARD_RANK[award] < AWARD_RANK[existing.award]) {
    byKey.set(dedupeKey, { gradeKey, school, student, award });
  }
}

const grouped = { primary: [], junior: [], senior: [], special: [] };
for (const { gradeKey, school, student, award } of byKey.values()) {
  grouped[gradeKey].push({ school, student, award });
}

// Manual corrections (CSV had wrong school name for this entry)
for (const e of grouped.junior) {
  if (e.school === '關愛隊3D角色' && e.student === '林建浚' && e.award === '二等獎') {
    e.school = '上水官立中學';
  }
  // List only 鄧靖希 (梁安琪 already has own row)
  if (
    e.school === '嗇色園主辦可道中學' &&
    e.award === '二等獎' &&
    (e.student === '梁安琪，鄧靖希' || e.student === '梁安琪,鄧靖希')
  ) {
    e.student = '鄧靖希';
  }
}

// Primary-school winner wrongly in junior → move to primary
for (let i = grouped.junior.length - 1; i >= 0; i--) {
  const e = grouped.junior[i];
  if (e.school === '聖公會李兆強小學' && e.student === '黃子倫' && e.award === '三等獎') {
    grouped.junior.splice(i, 1);
    const dup = grouped.primary.some(
      (x) => x.school === e.school && x.student === e.student && x.award === e.award
    );
    if (!dup) grouped.primary.push({ school: e.school, student: e.student, award: e.award });
  }
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

const data = { id: '3d', label: '3D設計組', grouped };
const outPath = join(root, 'src/data/gen2026-results/3d.json');
writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

const labels = {
  primary: '高小組',
  junior: '初中組',
  senior: '高中組',
  special: '特殊學校組',
};
for (const [k, label] of Object.entries(labels)) {
  console.log(`${label}: ${grouped[k].length} winners`);
}
console.log('Wrote', outPath);
