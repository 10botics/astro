import { db } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert('competitions').values([
		{
			date: '2025年1月6日',
			name: 'WRO香港機械人「冬季」挑戰賽 2025',
			keywords: '機械人、AI人工智能、資訊科技、可持續發展',
			popularity: '★★★★☆',
			link: '點擊進入'
		},
		{
			date: '2025年1月10日',
			name: '人工智能及創新科技比賽 2024-2025',
			keywords: 'AI人工智能、資訊科技、可持續發展',
			popularity: '★★★☆☆',
			link: '點擊進入'
		},
		{
			date: '2025年1月19日',
			name: '香港青少年科技創新大賽',
			keywords: 'STEAM',
			popularity: '★★★★☆',
			link: '點擊進入'
		},
		{
			date: '2025年1月27日',
			name: '傑出華人虛擬薈設計比賽',
			keywords: '虛擬實境（VR）、擴增實境（AR）、國民教育',
			popularity: '★★☆☆☆',
			link: '點擊進入'
		},
		{
			date: '2025年1月27日',
			name: '氫能車競賽大挑戰 2025',
			keywords: '碳中和、低碳排放',
			popularity: '★★★☆☆',
			link: '點擊進入'
		},
		{
			date: '2025年1月31日',
			name: '新世紀機械達人挑戰賽2025（太空篇）',
			keywords: '大數據、人工智能、太空科技',
			popularity: '★★★☆☆',
			link: '點擊進入'
		},
		{
			date: '2025年2月7日',
			name: '少年警訊創新科技大賽2024-25',
			keywords: '社區安全、防騙滅罪、青年抗毒、人工智能、樂齡科技',
			popularity: '★★★☆☆',
			link: '點擊進入'
		},
		{
			date: '2025年2月8日',
			name: '香港校際AI方程式 2025',
			keywords: '編程、人工智能、Rasbperry Pi、Donkey Car',
			popularity: '★★★★★',
			link: '點擊進入'
		},
		{
			date: '2025年2月10日',
			name: '國際編程精英挑戰賽2024-25',
			keywords: '編程',
			popularity: '★★★★★',
			link: '點擊進入'
		},
		{
			date: '2025年3月1日',
			name: 'STEM+E比賽2025',
			keywords: '能源效益',
			popularity: '★★★☆☆',
			link: '點擊進入'
		},
		{
			date: '2025年3月15日',
			name: '學界無人機救援挑戰賽',
			keywords: '編程、無人機',
			popularity: '★★★★★',
			link: '點擊進入'
		},
		{
			date: '2025年3月19日',
			name: '創意編程設計大賽',
			keywords: '機械人、編程',
			popularity: '★★★★☆',
			link: '點擊進入'
		},
		{
			date: '2025年5月',
			name: '大灣區學界低空經濟個案挑戰賽',
			keywords: '低空經濟應用、智慧城市',
			popularity: '★★☆☆☆',
			link: '點擊進入'
		},
		{
			date: '2025年5月12日',
			name: '第三屆校際AI藝術創作大賽《智畫神話》',
			keywords: 'Leonardo AI、AI人工智能、故事創作',
			popularity: '★★★★★',
			link: '點擊進入'
		},
		{
			date: '2025年7月12日',
			name: '亞太區STEM/AI科技創新挑戰賽 城市小英雄',
			keywords: '機械人',
			popularity: '★★★★☆',
			link: '點擊進入'
		}
	]);
}
