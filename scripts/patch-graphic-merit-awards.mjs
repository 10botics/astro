import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '../src/data/gen2026-results/graphic.json');
const data = JSON.parse(readFileSync(path, 'utf8'));

const AWARD_RANK = { 一等獎: 1, 二等獎: 2, 三等獎: 3, 優異獎: 4 };

const norm = (s) => String(s ?? '').trim().replace(/\s+/g, ' ');
const normStudent = (s) => norm(s).toLowerCase();

/** @type {Record<string, Array<[string, string]>>} */
const PROMOTIONS = {
  primary: [
    ['九龍灣聖若翰天主教小學', '馮頌然'],
    ['中華基督教會協和小學', '林玥兒'],
    ['中華基督教會協和小學', '謝昊呈'],
    ['中華基督教會基慧小學', '黃芷晴'],
    ['仁濟醫院蔡衍濤小學', '黃潁妤'],
    ['仁濟醫院蔡衍濤小學', '楊芊悠'],
    ['仁濟醫院蔡衍濤小學', '楊樂謙'],
    ['元朗商會小學', '蔡昊宏'],
    ['元朗商會小學', '鄧司朗'],
    ['元朗商會小學', '鄭心穎'],
    ['元朗商會小學', '霍曉柔'],
    ['元朗商會小學', '羅天睿'],
    ['元朗商會小學', '鍾萱澧'],
    ['元朗商會小學', '蘇諾怡'],
    ['東華三院高可寧紀念小學', 'MANJ MINAHIL'],
    ['東華三院高可寧紀念小學', 'MUSKAAN FATIMA KHAN'],
    ['青衣商會小學', '蔡嘉淇'],
    ['香港中國婦女會丘佐榮學校', '陳卓瑤'],
    ['香港中國婦女會丘佐榮學校', '黃灝康'],
    ['浸信會孔憲紹天虹小學', '黃珞瑤'],
    ['浸信會孔憲紹天虹小學', '劉枳溢'],
    ['塘尾道官立小學', '楊婷婷'],
    ['塘尾道官立小學', '蘇子鑰'],
    ['聖公會李兆強小學', 'Poon Tin Yan'],
    ['聖公會李兆強小學', 'Li Yik Fai'],
    ['聖公會李兆強小學', 'Wong Pak Hin'],
    ['聖公會李兆強小學', 'Ng Wing Lam'],
    ['聖公會青衣主恩小學', '羅心悅'],
    ['聖方濟愛德小學', '陳樂兒'],
    ['聖方濟愛德小學', '鄒瑩瑩'],
    ['聖安當小學', '謝文曦'],
  ],
  junior: [
    ['上水官立中學', '余馨'],
    ['上水官立中學', '張楚怡'],
    ['上水官立中學', '愛赫麥德'],
    ['天主教伍華中學', '梁倬綸'],
    ['天主教伍華中學', '陳偉樂'],
    ['天主教伍華中學', '麥貝兒'],
    ['天主教伍華中學', '黃雨軒'],
    ['天主教伍華中學', '駱嘉頤'],
    ['天主教伍華中學', '戴曉楠'],
    ['天主教伍華中學', 'liu jiajun'],
    ['天主教伍華中學', 'Yan Tsz Hin'],
    ['世界龍岡學校劉皇發中學', '黃俊夫'],
    ['東華三院邱金元中學', '盧錫𤋮'],
    ['東華三院邱金元中學', '韓悦衍'],
    ['東華三院邱金元中學', '陳釨淇'],
    ['青松侯寶垣中學', '葉俊謙'],
    ['青松侯寶垣中學', '鄭樂天'],
    ['保良局朱敬文中學', '黃梓喬'],
    ['保良局朱敬文中學', '曾凱玥'],
    ['保良局朱敬文中學', '鍾欣欣'],
    ['棉紡會中學', '羅浩麟'],
    ['嗇色園主辦可藝中學', '蔡榮軒'],
    ['嗇色園主辦可藝中學', '羅曉星'],
    ['萬鈞匯知中學', 'Wan Chun Nga'],
    ['萬鈞匯知中學', 'Thomas'],
    ['萬鈞匯知中學', 'Wong Choi Man'],
    ['萬鈞匯知中學', 'WONG HEI LAM'],
    ['聖保祿學校', '劉卓霏'],
    ['聖保祿學校', '韓昕廷'],
    ['嘉諾撒聖瑪利書院', '蔡曦兒'],
    ['嘉諾撒聖瑪利書院', '譚天'],
    ['嘉諾撒聖瑪利書院', '胡琳'],
    ['獻主會聖母院書院', '王俊明'],
    ['獻主會聖母院書院', '高樂樂'],
  ],
  senior: [
    ['上水官立中學', '陳軒樂'],
    ['中華基督教青年會中學', 'YU WING SUM'],
    ['中華基督教青年會中學', '梁倬僖'],
    ['世界龍岡學校劉皇發中學', '彭海圓'],
    ['明愛聖若瑟中學', '林依純'],
    ['東華三院邱金元中學', '謝善文'],
    ['東華三院邱金元中學', '鮑嘉穎'],
    ['東華三院邱金元中學', '黎忻諾'],
    ['東華三院邱金元中學', '魏心然'],
    ['東華三院邱金元中學', '羅慧心'],
    ['東華三院邱金元中學', '關宇恆'],
    ['東華三院邱金元中學', '鄭梓樂'],
    ['東華三院邱金元中學', '鄧芷茵'],
    ['漢華中學', '林鏸琪'],
    ['漢華中學', '黃映晴'],
    ['漢華中學', '劉家琳'],
    ['漢華中學', '文心弦'],
  ],
};

const schoolAliases = {
  青松侯寶垣中學: '青松侯寳垣中學',
};

function schoolMatches(entrySchool, targetSchool) {
  const s = norm(entrySchool);
  const t = norm(targetSchool);
  if (s === t) return true;
  const alias = schoolAliases[targetSchool];
  if (alias && s === norm(alias)) return true;
  return false;
}

function promoteGrade(gradeKey, pairs) {
  let changed = 0;
  const missing = [];

  for (const [targetSchool, targetStudent] of pairs) {
    const wantStudent = normStudent(targetStudent);
    let found = false;

    for (const e of data.grouped[gradeKey]) {
      if (!schoolMatches(e.school, targetSchool)) continue;
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
