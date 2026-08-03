export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const financeDeals = [
  {
    dealId: 'FR-1042',
    customer: 'Midwest Soil Cooperative',
    contract: 'MSC-2026-011',
    source: 'Referral Partner',
    referralPartner: 'Prairie Growth Advisors',
    partnerProgramManager: 'Sarah Keller',
    acres: 18500,
    contractValue: 555000,
    stage1Date: '2026-01-12',
    stage2Date: '2026-02-18',
    stage3Date: '2026-03-29',
    finalSales: 555000,
    finalAcres: 18500,
    glRevenue: 555000,
    reconciliationStatus: 'Reconciled',
    daysToFinal: 76,
  },
  {
    dealId: 'FR-1088',
    customer: 'North Fork Farms',
    contract: 'NFF-2026-004',
    source: 'Direct Sales',
    referralPartner: 'None',
    partnerProgramManager: 'Direct',
    acres: 11200,
    contractValue: 336000,
    stage1Date: '2026-02-07',
    stage2Date: '2026-03-14',
    stage3Date: '2026-04-20',
    finalSales: 336000,
    finalAcres: 11200,
    glRevenue: 336000,
    reconciliationStatus: 'Reconciled',
    daysToFinal: 72,
  },
  {
    dealId: 'FR-1120',
    customer: 'Summit Ag Holdings',
    contract: 'SAH-2026-021',
    source: 'Referral Partner',
    referralPartner: 'Harvest Ridge Partners',
    partnerProgramManager: 'Marcus Lee',
    acres: 26700,
    contractValue: 801000,
    stage1Date: '2026-03-03',
    stage2Date: '2026-04-16',
    stage3Date: '2026-05-30',
    finalSales: 0,
    finalAcres: 0,
    glRevenue: 801000,
    reconciliationStatus: 'Reconciled',
    daysToFinal: 88,
  },
  {
    dealId: 'FR-1164',
    customer: 'Riverbend Land Group',
    contract: 'RLG-2026-008',
    source: 'Direct Sales',
    referralPartner: 'None',
    partnerProgramManager: 'Direct',
    acres: 9800,
    contractValue: 294000,
    stage1Date: '2026-03-22',
    stage2Date: '2026-04-28',
    stage3Date: '',
    finalSales: 0,
    finalAcres: 0,
    glRevenue: 196000,
    reconciliationStatus: 'Missing Data',
    daysToFinal: 0,
  },
  {
    dealId: 'FR-1215',
    customer: 'Cedar Valley Farms',
    contract: 'CVF-2026-017',
    source: 'Referral Partner',
    referralPartner: 'Prairie Growth Advisors',
    partnerProgramManager: 'Sarah Keller',
    acres: 15300,
    contractValue: 459000,
    stage1Date: '2026-04-09',
    stage2Date: '2026-05-19',
    stage3Date: '',
    finalSales: 0,
    finalAcres: 0,
    glRevenue: 301000,
    reconciliationStatus: 'Material Variance',
    daysToFinal: 0,
  },
  {
    dealId: 'FR-1266',
    customer: 'Greenfield Ag Trust',
    contract: 'GAT-2026-030',
    source: 'Referral Partner',
    referralPartner: 'Dakota Land Network',
    partnerProgramManager: 'Nina Patel',
    acres: 21000,
    contractValue: 630000,
    stage1Date: '2026-05-06',
    stage2Date: '',
    stage3Date: '',
    finalSales: 0,
    finalAcres: 0,
    glRevenue: 210000,
    reconciliationStatus: 'Review Required',
    daysToFinal: 0,
  },
  {
    dealId: 'FR-1304',
    customer: 'Blue Stem Farms',
    contract: 'BSF-2026-002',
    source: 'Direct Sales',
    referralPartner: 'None',
    partnerProgramManager: 'Direct',
    acres: 6900,
    contractValue: 207000,
    stage1Date: '2026-05-27',
    stage2Date: '2026-06-25',
    stage3Date: '',
    finalSales: 0,
    finalAcres: 0,
    glRevenue: 138000,
    reconciliationStatus: 'Reconciled',
    daysToFinal: 0,
  },
  {
    dealId: 'FR-1340',
    customer: 'Lakeside Crop Systems',
    contract: 'LCS-2026-013',
    source: 'Referral Partner',
    referralPartner: 'Harvest Ridge Partners',
    partnerProgramManager: 'Marcus Lee',
    acres: 12900,
    contractValue: 387000,
    stage1Date: '2026-06-11',
    stage2Date: '',
    stage3Date: '',
    finalSales: 0,
    finalAcres: 0,
    glRevenue: 129000,
    reconciliationStatus: 'Reconciled',
    daysToFinal: 0,
  },
];

const stageAmount = (value: number) => Math.round(value / 3);
const hasStage = (date: string) => Boolean(date);

const earnedForDeal = (deal: (typeof financeDeals)[number]) =>
  [deal.stage1Date, deal.stage2Date, deal.stage3Date].filter(hasStage).length * stageAmount(deal.contractValue);

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const financeSummary = {
  bookedSales: sum(financeDeals.map((deal) => deal.contractValue)),
  earnedRevenue: sum(financeDeals.map(earnedForDeal)),
  finalSales: sum(financeDeals.map((deal) => deal.finalSales)),
  bookedAcres: sum(financeDeals.map((deal) => deal.acres)),
  earnedAcres: 85300,
  finalAcres: sum(financeDeals.map((deal) => deal.finalAcres)),
  cashBalance: 1840000,
  accountsReceivable: 940000,
  accountsPayable: 520000,
  freeCashFlow: 310000,
};

export const monthlyFinance = months.map((month, index) => ({
  month,
  bookedSales: [555000, 336000, 1095000, 459000, 837000, 387000][index],
  earnedRevenue: [185000, 297000, 409000, 477000, 725000, 467000][index],
  finalSales: [0, 0, 555000, 336000, 0, 0][index],
  direct: [0, 112000, 112000, 210000, 167000, 98000][index],
  referralPartner: [185000, 185000, 297000, 267000, 558000, 369000][index],
  expenses: [310000, 342000, 358000, 377000, 391000, 405000][index],
  cashBalance: [1410000, 1515000, 1690000, 1725000, 1790000, 1840000][index],
  inflows: [420000, 515000, 640000, 610000, 705000, 735000][index],
  outflows: [390000, 410000, 465000, 575000, 640000, 685000][index],
}));

export const expenseByDepartment = [
  { department: 'Sales', value: 420000 },
  { department: 'Referral Partner Network', value: 365000 },
  { department: 'Soil Operations', value: 760000 },
  { department: 'Reporting', value: 310000 },
  { department: 'General and Administrative', value: 328000 },
];

export const incomeStatementRows = [
  ['Direct Sales Earned Revenue', 406000, 389000, 2390000, 1985000],
  ['Referral Partner Earned Revenue', 469000, 521000, 2977000, 2386000],
  ['Total Earned Revenue', 875000, 910000, 5367000, 4371000],
  ['Cost of Revenue', -246000, -238000, -1440000, -1190000],
  ['Gross Profit', 629000, 672000, 3927000, 3181000],
  ['Payroll Expenses', -178000, -171000, -1068000, -942000],
  ['Referral Partner Expenses', -112000, -125000, -681000, -552000],
  ['Marketing Expenses', -52000, -47000, -294000, -240000],
  ['Technology Expenses', -61000, -58000, -358000, -315000],
  ['General and Administrative Expenses', -84000, -79000, -486000, -438000],
  ['Total Operating Expenses', -487000, -480000, -2887000, -2487000],
  ['Operating Income', 142000, 192000, 1040000, 694000],
  ['Other Income and Expenses', -9000, -6000, -38000, -42000],
  ['Net Income', 133000, 186000, 1002000, 652000],
];

export const balanceSheetRows = [
  ['Cash and Cash Equivalents', 1840000],
  ['Accounts Receivable', 940000],
  ['Prepaid Expenses', 180000],
  ['Other Current Assets', 90000],
  ['Property and Equipment', 620000],
  ['Other Assets', 130000],
  ['Total Assets', 3800000],
  ['Accounts Payable', 520000],
  ['Accrued Payroll', 240000],
  ['Accrued Referral Partner Incentives', 310000],
  ['Other Current Liabilities', 160000],
  ['Long-Term Liabilities', 720000],
  ['Total Liabilities', 1950000],
  ['Contributed Capital', 600000],
  ['Retained Earnings', 248000],
  ['Current-Year Earnings', 1002000],
  ['Total Equity', 1850000],
];

export const arApAging = [
  { bucket: 'Current', ar: 390000, ap: 210000 },
  { bucket: '1-30', ar: 260000, ap: 150000 },
  { bucket: '31-60', ar: 180000, ap: 92000 },
  { bucket: '61-90', ar: 74000, ap: 48000 },
  { bucket: '90+', ar: 36000, ap: 20000 },
];

export const vendors = [
  ['LabWorks Midwest', 188000],
  ['Field Ops Staffing', 164000],
  ['Cloud Ledger Systems', 118000],
  ['Prairie Growth Advisors', 104000],
  ['Harvest Ridge Partners', 96000],
  ['Dakota Land Network', 84000],
  ['NorthStar Analytics', 68000],
  ['Regional Print Services', 52000],
  ['Ag Data Exchange', 45000],
  ['Office Services Group', 31000],
];

export const exceptions = [
  ['Critical', 'FR-1215', 'Cedar Valley Farms', 'CRM Earned Revenue does not equal General Ledger revenue', 'Stage 2', 'Stage 2', '2026-05-19', 5000, '2026-06-30', 'Finance Ops', 'Open'],
  ['High', 'FR-1164', 'Riverbend Land Group', 'Recognition-stage date missing', 'Stage 2', 'Stage 3', '', 98000, '2026-06-28', 'Reporting', 'In Review'],
  ['High', 'FR-1266', 'Greenfield Ag Trust', 'Deal moved backward in the CRM process', 'Stage 2', 'Stage 1', '2026-05-06', 210000, '2026-06-25', 'Sales Ops', 'Open'],
  ['Medium', 'FR-1304', 'Blue Stem Farms', 'Previously reported period changed', 'Stage 1', 'Stage 2', '2026-06-25', 69000, '2026-06-26', 'Controller', 'Resolved'],
  ['Low', 'FR-1340', 'Lakeside Crop Systems', 'Missing acreage', 'Booked', 'Stage 1', '2026-06-11', 0, '2026-06-20', 'Revenue Ops', 'Dismissed'],
];

export const formatMoney = (value: number) => {
  const absolute = Math.abs(value);
  const formatted = absolute >= 1000000 ? `$${(absolute / 1000000).toFixed(1)}M` : `$${(absolute / 1000).toFixed(0)}K`;
  return value < 0 ? `(${formatted})` : formatted;
};

export const formatNumber = (value: number) => `${Number(value).toLocaleString()}`;
export const earnedForFinanceDeal = earnedForDeal;
export const stageAmountForFinanceDeal = stageAmount;
