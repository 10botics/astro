import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '../src/data/gen2026-results/graphic.json');
const data = JSON.parse(readFileSync(path, 'utf8'));

const norm = (s) => String(s ?? '').trim().replace(/\s+/g, ' ');

function shouldDelete(entry, grade) {
  const school = norm(entry.school);
  const student = norm(entry.student);

  if (grade === 'primary') {
    if (school === '蔡卓嵐' && student === '蔡卓嵐') return true;
    if (school === 'fwqfeq' && student === 'fqfwf') return true;
    // duplicate 陳藴晞 at wrong school (correct entry exists under 基慧)
    if (school === '中華基督教會小學' && student === '陳藴晞') return true;
    // duplicate / withdrawn (user request)
    if (school === '路德會呂祥光中學' && student === '趙蔚榣 凌梓桐' && entry.award === '三等獎') return true;
    return false;
  }

  if (grade === 'junior') {
    if (school === '天主教伍华中学' && student === '张袁浩') return true;
    if (/世界.*龙.*刘皇发中学/i.test(school) && student === '杨宗凯') return true;
    if (school === '世界龍岡学校劉皇发中学' && student === '劉晞宜') return true;
    if (school === '世界龍岡劉皇發中學' && student === '區芊語') return true;
    if (school === '可艺中学' && student === '刘海浪') return true;
    if (school === '可藝中學' && student === '李盈睻') return true;
    if (school === '東華三院邱金元中學' && (student === '赖嘉佩' || student === '谭咏芯')) return true;
    if (school === '啬色園主辦可藝中学' && student === '张子骞') return true;
    if (school === '嗇色園可藝中學' && student === '鍾芮姿') return true;
    if (school === '萬鈞匯知' && student === '劉偉業') return true;
    if (school === 'lwfss' && student === '李駿然') return true;
    if (school === 'LWFSS' && student === '李駿然') return true;
    if (school === 'mkqc' && student === 'Lo Wing Sze') return true;
    if (school === 'MKQC' && student === 'Chang Ka Wong') return true;
    if (school === '路德會呂祥光中學' && student === '趙蔚榣 凌梓桐' && entry.award === '三等獎') return true;
    return false;
  }

  return false;
}

function patchEntry(entry, grade) {
  const school = norm(entry.school);
  const student = norm(entry.student);

  if (grade === 'primary') {
    if (school === '沙田圍胡素旗博士紀念學校' && student === '潘梓樂') {
      entry.school = '沙田圍胡素貞博士紀念學校';
    }
    if (school === '李陞大坑學校' && student === 'Mabuyog, Jorgeanna Danielle Casten') {
      return [
        { school: '李陞大坑學校', student: 'Mabuyog', award: '二等獎' },
        { school: '李陞大坑學校', student: 'Jorgeanna Danielle Casten', award: '二等獎' },
      ];
    }
    if (school === '真道書院小學部' && student === '紀鈞灝') {
      entry.school = '香港華人基督教聯會真道書院(小學部)';
    }
    if (school === 'SacredHeartCanossianSchool' && student === '王卓懿') {
      entry.school = '嘉諾撒聖心學校';
    }
  }

  if (grade === 'junior') {
    if (school === '天主教伍華中學' && student.replace(/\s/g, '') === 'Ｌｕｎｇ　Ｃｈｕｎ　Ｌｏｎｇ'.replace(/\s/g, '')) {
      entry.student = 'Lung Chun Long';
    }
    if (school.startsWith('順德聯誼總會胡兆熾中學')) {
      if (student === '司徒文諾' || student === '陳展帆') entry.award = '一等獎';
      if (['王俊希', '邢天怡', '裴曉漫', '蔡蕎蔚', '鄭智堯', '黎珈汶', '譚安婷'].includes(student)) {
        entry.award = '二等獎';
      }
    }
    if (school === '萬鈞匯知中學' && /CHAN.*Hei.*Tung/i.test(student.replace(/\u3000/g, ' '))) {
      entry.student = 'Chan Hei Tung';
    }
    if (school === '萬鈞匯知中學' && student === 'HiHi') {
      entry.student = 'lam chi kwan';
    }
    if (school.includes('ManKwanQualiEdCollege')) {
      entry.school = '萬鈞匯知中學';
    }
  }

  return entry;
}

for (const grade of ['primary', 'junior']) {
  const next = [];
  for (const entry of data.grouped[grade]) {
    if (shouldDelete(entry, grade)) continue;
    const result = patchEntry(entry, grade);
    if (Array.isArray(result)) {
      next.push(...result);
    } else {
      next.push(result);
    }
  }
  data.grouped[grade] = next;
}

writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Patched graphic.json');
console.log('primary:', data.grouped.primary.length, 'junior:', data.grouped.junior.length);
