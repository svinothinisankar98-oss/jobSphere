import {
  INDUSTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
} from "../constants/EmployerRegister";

//grouping function//

type Option = { item: string };           //item:"IT"//

function groupEmployers(
  employers: any[],      //api data//
  field: string,         //property grouping idustry or company size//
  options: Option[],      //categories like options//
  _labelName: string,
) {

  //empty counter//
  const map: Record<string, number> = {};

  // initialize all categories count:0//
  options.forEach((opt) => {
    map[opt.item] = 0;
  });

  console.log(employers, "employers");
  // count employers
  employers?.forEach((emp) => {
    const value = emp?.[field];
    if (value && map.hasOwnProperty(value)) {
      map[value]++;
    }
  });

  // convert to chart format remove 0 state finace:0//
  return Object.entries(map)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      count,
    }));
}

function buildIndustryPie(employers: any[]) {
  const map: Record<string, number> = {};

  employers?.forEach((emp) => {
    const industry = emp?.industry?.trim() || "Unknown";
    map[industry] = (map[industry] || 0) + 1;             //count industry//
  });

  const colors = [               //assign colors//
    "#1976d2",
    "#2e7d32",
    "#ed6c02",
    "#9c27b0",
    "#0288d1",
    "#d32f2f",
    "#6d4c41",
    "#00897b",
    "#4d9e96",
  ];

  return Object.entries(map).map(([label, value], index) => ({               //convert to pie chart format//
    label,
    value,
    color: colors[index % colors.length],
  }));
}

//main function//

export function buildEmployerCharts(employers: any[]) {
  return {
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

    industryPie: buildIndustryPie(employers),
  };
}
