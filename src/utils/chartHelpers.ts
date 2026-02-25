import {
  INDUSTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
} from "../constants/EmployerRegister";
import type { User } from "../service/userService";

//types//

type Option = { item: string };

//grouped bar helpers//

function groupEmployers(
  employers: any[],
  field: string,
  options: Option[],
  _labelName: string,
) {
  const map: Record<string, number> = {};

  // initialize categories
  options.forEach((opt) => {
    map[opt.item] = 0;
  });

  // count employers values like each field like companysize //
  employers?.forEach((emp) => {
    const value = emp?.[field];
    //  console.log("value rendering",value)
    if (value && map.hasOwnProperty(value)) {
      map[value]++;
    }
  });

  // chart format  { label: "IT", count: 2 },
  return Object.entries(map)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      count,
    }));
}

//pie chart helpers generate unique colors//

function generateUniqueColors(count: number) {
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = Math.round((360 / count) * i);
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }

  return colors;
}
//pie chart helpers like data format label value and colors//

function buildIndustryPie(employers: any[]) {
  const map: Record<string, number> = {};
  console.log("map", map);

  employers?.forEach((emp) => {
    const industry = emp?.industry?.trim() || "Unknown";
    map[industry] = (map[industry] || 0) + 1;
  });

  const entries = Object.entries(map);

  return {
    data: entries.map(([label, value]) => ({ label, value })),
    colors: generateUniqueColors(entries.length),
  };
}

//monthly analytics years filtered//

function buildMonthlyRegistrations(employers: any[], selectedYear?: number) {
  //Creates 12 months array//
  const months = Array(12).fill(0);
  // console.log("months rendering",months)

  employers?.forEach((emp) => {
    if (!emp?.createdAt) return;

    const date = new Date(emp.createdAt); //counts for each month//
    if (isNaN(date.getTime())) return;

    // filter by selected year
    if (selectedYear && date.getFullYear() !== selectedYear) return;

    const monthIndex = date.getMonth();
    months[monthIndex]++;
  });

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return labels.map((label, index) => ({
    month: label,
    count: months[index],
  }));
}

//year comparison line chart//

export function buildYearComparisonLine(employers: any[]) {
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const yearMap: Record<number, number[]> = {};

  employers?.forEach((emp) => {
    if (!emp?.createdAt) return;

    const date = new Date(emp.createdAt);
    if (isNaN(date.getTime())) return;

    const year = date.getFullYear();
    const month = date.getMonth();

    if (!yearMap[year]) {
      yearMap[year] = Array(12).fill(0);
    }

    yearMap[year][month]++;
  });

  // convert to chart structure
  const chartData = monthLabels.map((month, index) => {
    const obj: any = { month };

    Object.keys(yearMap).forEach((year) => {
      obj[year] = yearMap[Number(year)][index];
    });

    return obj;
  });

  // create dynamic series
  const series = Object.keys(yearMap)
    .sort()
    .map((year) => ({
      label: year,
      dataKey: year,
    }));

  return { data: chartData, series };
}
//User Monthly Grouped Bar//

export function buildUsersMonthlyStats(users: User[], year?: number) {

  const months = Array.from({ length: 12 }, () => ({
    jobseeker: 0,
    employer: 0
  }));

  users.forEach((u) => {
    if (!u.createdAt) return;

    const date = new Date(u.createdAt);
    if (isNaN(date.getTime())) return;

    if (year && date.getFullYear() !== year) return;

    const m = date.getMonth();

    if (u.userType === 1) months[m].jobseeker++;
    if (u.userType === 2) months[m].employer++;
  });

  const labels = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return labels.map((month, i) => ({
    month,
    total: months[i].jobseeker + months[i].employer,
    jobseeker: months[i].jobseeker,
    employer: months[i].employer
  }));
}

//available year dropdown//

export function extractAvailableYears(employers: any[]): number[] {
  return Array.from(
    new Set(
      employers
        ?.map((e) => {
          if (!e?.createdAt) return null;

          const year = new Date(e.createdAt).getFullYear();
          return isNaN(year) ? null : year;
        })
       
        .filter((year): year is number => year !== null),
    ),
  ).sort((a, b) => b - a);
}

//employer and year active and inactive used stacked//

export function buildEmployerYearlyStatus(employers: any[]) {

  const yearMap: Record<number, { active: number; inactive: number }> = {};

  employers.forEach(emp => {
    if (!emp?.createdAt) return;

    const date = new Date(emp.createdAt);
    if (isNaN(date.getTime())) return;

    const year = date.getFullYear();

    if (!yearMap[year]) {
      yearMap[year] = { active: 0, inactive: 0 };
    }

    if (emp.isActive === true) yearMap[year].active++;
    else yearMap[year].inactive++;
  });

  // convert to chart format
  return Object.keys(yearMap)
    .sort()
    .map(year => ({
      year,
      active: yearMap[Number(year)].active,
      inactive: yearMap[Number(year)].inactive
    }));
}





//main function//

export function buildEmployerCharts(employers: any[], year?: number) {
  const monthly = buildMonthlyRegistrations(employers, year);
  const yearlyComparison = buildYearComparisonLine(employers);
  

  return {
    // grouped bars
    industry: groupEmployers(
      employers,
      "industry",
      INDUSTRY_OPTIONS,
      "industry",
    ),

    companySize: groupEmployers(
      employers,
      "companySize",
      COMPANY_SIZE_OPTIONS,
      "companySize",
    ),

    // pie
    industryPie: buildIndustryPie(employers),

    //  filtered monthly analytics
    monthly,
    yearlyComparison,
  };
}
