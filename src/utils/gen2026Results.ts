export interface WinnerEntry {
  school: string;
  student: string;
  award: string;
}

export interface GradeGroup {
  key: string;
  title: string;
  headerClass: string;
  badgeClass: string;
  entries: WinnerEntry[];
}

interface CategoryData {
  id: string;
  label: string;
  grouped: {
    primary: WinnerEntry[];
    junior: WinnerEntry[];
    senior: WinnerEntry[];
    special: WinnerEntry[];
  };
}

const AWARD_ORDER: Record<string, number> = {
  '\u4e00\u7b49\u734e': 1,
  '\u4e8c\u7b49\u734e': 2,
  '\u4e09\u7b49\u734e': 3,
  '\u512a\u7570\u734e': 4,
};

function awardRank(award: string): number {
  return AWARD_ORDER[award] ?? 99;
}

function sortEntries(entries: WinnerEntry[]): WinnerEntry[] {
  return [...entries].sort((a, b) => {
    const schoolCmp = a.school.localeCompare(b.school, 'zh-Hant');
    if (schoolCmp !== 0) return schoolCmp;
    const awardCmp = awardRank(a.award) - awardRank(b.award);
    if (awardCmp !== 0) return awardCmp;
    return a.student.localeCompare(b.student, 'zh-Hant');
  });
}

const gradeStyles = [
  {
    key: 'primary',
    title: '\u9ad8\u5c0f\u7d44',
    headerClass: 'bg-brand-blue-600 text-white',
    badgeClass: 'bg-brand-blue-100 text-brand-blue-800',
  },
  {
    key: 'junior',
    title: '\u521d\u4e2d\u7d44',
    headerClass: 'bg-category-green-600 text-white',
    badgeClass: 'bg-category-green-100 text-category-green-800',
  },
  {
    key: 'senior',
    title: '\u9ad8\u4e2d\u7d44',
    headerClass: 'bg-category-purple-600 text-white',
    badgeClass: 'bg-category-purple-100 text-category-purple-800',
  },
  {
    key: 'special',
    title: '\u7279\u6b8a\u5b78\u6821\u7d44',
    headerClass: 'bg-category-orange-600 text-white',
    badgeClass: 'bg-category-orange-100 text-category-orange-800',
  },
] as const;

export function buildGradeGroups(data: CategoryData): GradeGroup[] {
  return gradeStyles
    .map((style) => ({
      ...style,
      entries: sortEntries(data.grouped[style.key]),
    }))
    .filter((g) => g.entries.length > 0);
}
