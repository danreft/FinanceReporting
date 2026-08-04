import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PowerBICard from '../components/PowerBICard';
import PowerBISlicer from '../components/PowerBISlicer';
import {
  balanceSheetStatement,
  balanceSheetTrend,
  cashFlowOutlook,
  controlExceptions,
  earnedForFinanceDeal,
  executiveTrend,
  expenseByDepartment,
  financeDeals,
  financeSummary,
  formatMoney,
  incomeStatementRows,
  months,
  monthlyCashFlowTrend,
  monthlyFinance,
  stageAmountForFinanceDeal,
  vendors,
} from '../data/financeMockData';
import type { FinanceFilterValue, ReportingDateRange } from '../components/FinanceSlicers';

type FinancePageProps = {
  filters: FinanceFilterValue;
};

const dateRangeLabels: Record<ReportingDateRange, string> = {
  currentMonth: 'Current Month',
  previousMonth: 'Previous Month',
  currentQuarter: 'Current Quarter',
  previousQuarter: 'Previous Quarter',
  yearToDate: 'Year to Date (YTD)',
  previousYearToDate: 'Previous Year to Date',
  currentFiscalYear: 'Current Fiscal Year',
  previousFiscalYear: 'Previous Fiscal Year',
  rolling12Months: 'Rolling 12 Months',
  custom: 'Custom',
};

const dateRangeMonths: Record<ReportingDateRange, string[]> = {
  currentMonth: ['Jun'],
  previousMonth: ['May'],
  currentQuarter: ['Apr', 'May', 'Jun'],
  previousQuarter: ['Jan', 'Feb', 'Mar'],
  yearToDate: months,
  previousYearToDate: months,
  currentFiscalYear: months,
  previousFiscalYear: months,
  rolling12Months: months,
  custom: ['Jun'],
};

const monthIsoFor = (month: string) => `2026-${String(months.indexOf(month) + 1).padStart(2, '0')}`;
const formatCustomPeriod = (start: string, end: string) => {
  if (!start || !end) return 'Custom';
  return `${start} to ${end}`;
};
const customMonthsFor = (filters: FinanceFilterValue) => {
  if (!filters.customStart || !filters.customEnd) return dateRangeMonths.custom;
  const start = filters.customStart.slice(0, 7);
  const end = filters.customEnd.slice(0, 7);
  return months.filter((month) => {
    const period = monthIsoFor(month);
    return period >= start && period <= end;
  });
};
const selectedMonthsFor = (filters: FinanceFilterValue) =>
  filters.reportingPeriod === 'custom' ? customMonthsFor(filters) : dateRangeMonths[filters.reportingPeriod];
const selectedPeriodLabel = (filters: FinanceFilterValue) =>
  filters.reportingPeriod === 'custom' ? formatCustomPeriod(filters.customStart, filters.customEnd) : dateRangeLabels[filters.reportingPeriod];
const monthFromIsoDate = (date: string) => {
  if (!date) return '';
  return months[Number(date.slice(5, 7)) - 1] || '';
};
const isDateInRange = (date: string, filters: FinanceFilterValue) => selectedMonthsFor(filters).includes(monthFromIsoDate(date));
const isMonthInRange = (month: string, filters: FinanceFilterValue) => selectedMonthsFor(filters).includes(month);
const filteredMonthlyFinance = (filters: FinanceFilterValue) => monthlyFinance.filter((item) => isMonthInRange(item.month, filters));
const filteredExecutiveTrend = (filters: FinanceFilterValue) => executiveTrend.filter((item) => isMonthInRange(item.month, filters));
const lastMonthlyFinancePoint = (filters: FinanceFilterValue) => {
  const rows = filteredMonthlyFinance(filters);
  return rows[rows.length - 1] ?? monthlyFinance[monthlyFinance.length - 1];
};
const currentMonthCount = (filters: FinanceFilterValue) => selectedMonthsFor(filters).length;

function PageShell({
  title,
  children,
  subtitle,
  selectedPeriod = 'YTD 2026',
  exportContext,
  canvasClassName = '',
}: {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  selectedPeriod?: string;
  exportContext?: string;
  canvasClassName?: string;
}) {
  return (
    <div className="print-report powerbi-page-shell p-4">
      <div className={`powerbi-canvas ${canvasClassName || 'space-y-2'}`}>
      <div className="flex items-start justify-between gap-4 print-section">
        <div>
          <div className="text-lg font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>{title}</div>
          <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Selected Period: {selectedPeriod}</div>
        </div>
      </div>
      {children}
      </div>
    </div>
  );
}

// Power BI implementation metadata:
// Recommended visual: native line, clustered/stacked column, bar, combo, or waterfall chart depending on children.
// Approach: fixed visual container on a 16:9 report canvas with report-page tooltip support.
// Interaction: native cross-filtering, field parameters, bookmarks, or drillthrough only.
function ChartCard({ title, subtitle, height = 220, className = '', children }: { title: string; subtitle: string; height?: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={`print-section bg-white border border-[#CFD5D0] p-3 ${className}`}>
      <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>{title}</div>
      <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{subtitle}</div>
      <ResponsiveContainer width="100%" height={height}>{children as any}</ResponsiveContainer>
    </div>
  );
}

// Power BI implementation metadata:
// Recommended visual: native table or matrix visual.
// Approach: use matrix for financial statements and table for detail; wide audit/detail outputs are paginated report candidates.
// Interaction: native sort/filter, conditional formatting, and drillthrough; no editable grid behavior.
function FinanceTable({ title, subtitle, columns, rows }: { title: string; subtitle?: string; columns: string[]; rows: (string | number)[][] }) {
  return (
    <div className="print-section bg-white border border-[#CFD5D0] p-3">
      <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>{title}</div>
      {subtitle && <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{subtitle}</div>}
      <table className="w-full border-collapse text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        <thead>
          <tr className="border-b border-[#CFD5D0]">
            {columns.map((column) => (
              <th key={column} className="text-left text-[#006637] font-semibold py-1 pr-2 whitespace-nowrap">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-[#E6EEE7] last:border-0">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="py-1 pr-2 text-[#1A1A1A] whitespace-nowrap">
                  {cellIndex === 0 && typeof cell === 'string' && (cell.includes('Total') || ['Operating Activities', 'Investing Activities', 'Financing Activities'].includes(cell)) ? <span className="font-semibold text-[#006637]">{cell}</span> : renderCell(cell, columns[cellIndex])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(cell: string | number, column = '') {
  if (typeof cell === 'number') {
    if (/acres/i.test(column)) return formatAcres(cell);
    if (/contract count|contracts|records|unmatched/i.test(column)) return formatCount(cell);
    return cell > 999 || cell < 0 ? formatMoney(cell) : cell.toLocaleString();
  }
  if (['Reconciled', 'Clear'].includes(cell)) return <StatusBadge tone="green">{cell}</StatusBadge>;
  if (['Missing Stage Date', 'General-Ledger Mismatch'].includes(cell)) return <StatusBadge tone="orange">{cell}</StatusBadge>;
  return cell;
}

function StatusBadge({ children, tone }: { children: React.ReactNode; tone: 'green' | 'blue' | 'orange' | 'gray' }) {
  const classes = {
    green: 'bg-[#2F7641] text-white',
    blue: 'bg-[#56708F] text-white',
    orange: 'bg-[#A33C1B] text-white',
    gray: 'bg-[#E6EEE7] text-[#3D654D]',
  };

  return <span className={`px-2 py-1 text-xs rounded font-semibold ${classes[tone]}`}>{children}</span>;
}

const moneyAxis = (value: number) => `$${(value / 1000).toFixed(0)}K`;
const moneyTip = (value: number) => formatMoney(value);
const formatAcres = (value: number) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
const formatCount = (value: number) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
type MetricMode = 'dollars' | 'acres' | 'contracts';
const metricLabel = (metric: MetricMode) => metric === 'dollars' ? 'Dollars' : metric === 'acres' ? 'Acres' : 'Contracts';
const metricValue = (metric: MetricMode, dollars: number, acres: number, contracts: number) => metric === 'dollars' ? dollars : metric === 'acres' ? acres : contracts;
const chartText = { fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' };

type ProfitAndLossRow = {
  id: string;
  label: string;
  current: number;
  prior: number;
  ytd: number;
  priorYtd: number;
  children?: ProfitAndLossRow[];
};

type StatementRow = {
  id: string;
  label: string;
  current: number;
  prior: number;
  children?: StatementRow[];
};

const percentFormat = (value: number) => `${value.toFixed(1)}%`;
function varianceTone(value: number) {
  if (value > 0) return 'text-[#2F7641]';
  if (value < 0) return 'text-[#A33C1B]';
  return 'text-[#3D654D]';
}

function ProfitAndLossTable({
  title,
  subtitle,
  rows,
  expandedRows,
  onToggle,
}: {
  title: string;
  subtitle?: string;
  rows: ProfitAndLossRow[];
  expandedRows: Set<string>;
  onToggle: (rowId: string) => void;
}) {
  const renderRows = (items: ProfitAndLossRow[], depth = 0): React.ReactNode[] =>
    items.flatMap((row) => {
      const dollarVariance = row.current - row.prior;
      const percentVariance = (dollarVariance / Math.max(Math.abs(row.prior), 1)) * 100;
      const expandable = Boolean(row.children?.length);
      const expanded = expandedRows.has(row.id);
      const subtotal = depth === 0;
      const rowClass = subtotal ? 'font-semibold text-[#006637]' : 'text-[#1A1A1A]';
      const current = (
        <tr key={row.id} className="border-b border-[#E6EEE7] last:border-0">
          <td className={`py-1 pr-2 whitespace-nowrap ${rowClass}`} style={{ paddingLeft: `${depth * 18}px` }}>
            {expandable && (
              <button
                type="button"
                onClick={() => onToggle(row.id)}
                className="w-4 mr-1 text-[#3D654D]"
                aria-label={`${expanded ? 'Collapse' : 'Expand'} ${row.label}`}
              >
                {expanded ? '▾' : '▸'}
              </button>
            )}
            {!expandable && <span className="inline-block w-5" />}
            {row.label}
          </td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.current)}</td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.prior)}</td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap font-semibold ${varianceTone(dollarVariance)}`}>{formatMoney(dollarVariance)}</td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap font-semibold ${varianceTone(dollarVariance)}`}>{percentFormat(percentVariance)}</td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.ytd)}</td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.priorYtd)}</td>
        </tr>
      );

      if (!expanded || !row.children?.length) return [current];
      return [current, ...renderRows(row.children, depth + 1)];
    });

  return (
    <div className="bg-white border border-[#CFD5D0] p-3">
      <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>{title}</div>
      {subtitle && <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{subtitle}</div>}
      <table className="w-full border-collapse text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        <thead>
          <tr className="border-b border-[#CFD5D0]">
            {['Account', 'Current Period', 'Prior Period', 'Dollar Variance', 'Percent Variance', 'Year-to-Date', 'Prior-Year-to-Date'].map((column, index) => (
              <th key={column} className={`${index === 0 ? 'text-left' : 'text-right'} text-[#006637] font-semibold py-1 pr-2 whitespace-nowrap`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRows(rows)}</tbody>
      </table>
    </div>
  );
}

function BalanceSheetStatementTable({
  title,
  subtitle,
  rows,
  expandedRows,
  onToggle,
}: {
  title: string;
  subtitle?: string;
  rows: StatementRow[];
  expandedRows: Set<string>;
  onToggle: (rowId: string) => void;
}) {
  const renderRows = (items: StatementRow[], depth = 0): React.ReactNode[] =>
    items.flatMap((row) => {
      const dollarVariance = row.current - row.prior;
      const percentVariance = (dollarVariance / Math.max(Math.abs(row.prior), 1)) * 100;
      const expandable = Boolean(row.children?.length);
      const expanded = expandedRows.has(row.id);
      const subtotal = depth <= 1;
      const rowClass = subtotal ? 'font-semibold text-[#006637]' : 'text-[#1A1A1A]';
      const current = (
        <tr key={row.id} className="border-b border-[#E6EEE7] last:border-0">
          <td className={`py-1 pr-2 whitespace-nowrap ${rowClass}`} style={{ paddingLeft: `${depth * 18}px` }}>
            {expandable && (
              <button
                type="button"
                onClick={() => onToggle(row.id)}
                className="w-4 mr-1 text-[#3D654D]"
                aria-label={`${expanded ? 'Collapse' : 'Expand'} ${row.label}`}
              >
                {expanded ? '▾' : '▸'}
              </button>
            )}
            {!expandable && <span className="inline-block w-5" />}
            {row.label}
          </td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.current)}</td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.prior)}</td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap font-semibold ${varianceTone(dollarVariance)}`}>{formatMoney(dollarVariance)}</td>
          <td className={`py-1 pr-2 text-right whitespace-nowrap font-semibold ${varianceTone(dollarVariance)}`}>{percentFormat(percentVariance)}</td>
        </tr>
      );

      if (!expanded || !row.children?.length) return [current];
      return [current, ...renderRows(row.children, depth + 1)];
    });

  return (
    <div className="bg-white border border-[#CFD5D0] p-3">
      <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>{title}</div>
      {subtitle && <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{subtitle}</div>}
      <table className="w-full border-collapse text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        <thead>
          <tr className="border-b border-[#CFD5D0]">
            {['Account', 'Current Period', 'Prior Period', 'Dollar Variance', 'Percent Variance'].map((column, index) => (
              <th key={column} className={`${index === 0 ? 'text-left' : 'text-right'} text-[#006637] font-semibold py-1 pr-2 whitespace-nowrap`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRows(rows)}</tbody>
      </table>
    </div>
  );
}

export function ExecutiveSnapshot({ filters }: FinancePageProps)
{
  const dateRange = filters;
  const [topListView, setTopListView] = useState<'customers' | 'vendors'>('customers');
  const currentPeriodLabel = selectedPeriodLabel(dateRange);
  const selectedMonthlyFinance = filteredMonthlyFinance(dateRange);
  const selectedTrend = filteredExecutiveTrend(dateRange);
  const trendSubtitle = selectedTrend.length > 1
    ? 'Monthly trend with prior-period comparison for the selected reporting period'
    : 'Current and prior-period comparison for the selected reporting period';
  const selectedCashFlowTrend = monthlyCashFlowTrend.filter((item) => isMonthInRange(item.month, dateRange));
  const selectedDeals = financeDeals.filter((deal) => isDateInRange(deal.stage1Date, dateRange));
  const dealsWithEarnedStage = financeDeals.filter((deal) =>
    [deal.stage1Date, deal.stage2Date, deal.stage3Date].some((date) => isDateInRange(date, dateRange))
  );
  const finalDeals = financeDeals.filter((deal) => deal.finalSales > 0 && isDateInRange(deal.stage3Date, dateRange));
  const selectedSummary = {
    bookedSales: selectedMonthlyFinance.reduce((total, item) => total + item.bookedSales, 0),
    earnedRevenue: selectedMonthlyFinance.reduce((total, item) => total + item.earnedRevenue, 0),
    finalSales: selectedMonthlyFinance.reduce((total, item) => total + item.finalSales, 0),
    bookedAcres: selectedDeals.reduce((total, deal) => total + deal.acres, 0),
    earnedAcres: dealsWithEarnedStage.reduce((total, deal) => total + deal.acres, 0),
    finalAcres: finalDeals.reduce((total, deal) => total + deal.finalAcres, 0),
    freeCashFlow: selectedCashFlowTrend.reduce((total, item) => total + item.freeCashFlow, 0),
    cashBalance: lastMonthlyFinancePoint(dateRange).cashBalance,
    accountsReceivable: financeSummary.accountsReceivable,
    accountsPayable: financeSummary.accountsPayable,
  };
  const periodShare = currentMonthCount(dateRange) / months.length;
  const totalVendorSpend = vendors.reduce((total, [, spend]) => total + Number(spend) * periodShare, 0);
  const topCustomers = selectedDeals
    .map((deal) => [deal.customer, deal.contractValue] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([customer, value], index) => [index + 1, customer, value, `${((value / Math.max(selectedSummary.bookedSales, 1)) * 100).toFixed(1)}%`]);
  const topVendors = vendors
    .map(([vendor, spend]) => [vendor, Math.round(Number(spend) * periodShare)] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([vendor, spend], index) => [index + 1, vendor, spend, `${((spend / Math.max(totalVendorSpend, 1)) * 100).toFixed(1)}%`]);
  const topTable = topListView === 'customers'
    ? { title: 'Top 10 Customers', columns: ['Rank', 'Customer', 'Amount', '% of Total'], rows: topCustomers }
    : { title: 'Top 10 Vendors', columns: ['Rank', 'Vendor', 'Amount', '% of Total'], rows: topVendors };
  const processComparison = [
    ['Booked Sales', selectedSummary.bookedSales, selectedSummary.bookedAcres, selectedDeals.length],
    ['Earned Revenue', selectedSummary.earnedRevenue, selectedSummary.earnedAcres, dealsWithEarnedStage.length],
    ['Final Sales', selectedSummary.finalSales, selectedSummary.finalAcres, finalDeals.length],
  ];
  const cashOutlookRows = [
    ['Current Cash', selectedSummary.cashBalance],
    ['Expected Customer Collections', 735000],
    ['Expected Near-Term Payments', -685000],
    ['Projected Cash', selectedSummary.cashBalance + 50000],
  ];
  const arApRows = [
    ['Total AR', selectedSummary.accountsReceivable],
    ['Total AP', selectedSummary.accountsPayable],
    ['Overdue AR', 290000],
    ['Near-Term AP', 360000],
  ];

  return (
    <PageShell
      title="Executive Snapshot"
      subtitle="Executive financial overview for the selected reporting period."
      selectedPeriod={currentPeriodLabel}
      exportContext="Presentation-friendly export: six KPI cards, trend, illustrative basic cash outlook, AR/AP relationship, top 10 list, and Booked Sales / Earned Revenue / Final Sales comparison."
      canvasClassName="fixed-report-canvas space-y-2"
    >
      <div className="grid grid-cols-6 gap-2">
        <PowerBICard title="Booked Sales" value={formatMoney(selectedSummary.bookedSales)} variance="+8.4% vs prior period" status="positive" subtitle="Signed DocuSign agreements" tooltip="Total signed contract value, associated acres, and contract count for agreements fully signed through DocuSign during the selected reporting period." />
        <PowerBICard title="Earned Revenue" value={formatMoney(selectedSummary.earnedRevenue)} variance="+6.1% vs prior period" status="positive" subtitle="GAAP recognized revenue" tooltip="GAAP-compliant revenue recognized through Signed Agreement, Soil Data Collection Complete, and Report Complete." />
        <PowerBICard title="Final Sales" value={formatMoney(selectedSummary.finalSales)} variance="+$891K vs prior period" status="neutral" subtitle="Paid Account deals" tooltip="Value of accounts for which the full customer balance has been collected and the deal has reached Paid Account." />
        <PowerBICard title="Free Cash Flow" value={formatMoney(selectedSummary.freeCashFlow)} variance="+$42K vs prior period" status="positive" subtitle="Operating less investing cash flow" tooltip="Operating cash flow less capital spend for the selected period." />
        <PowerBICard title="Accounts Receivable" value={formatMoney(selectedSummary.accountsReceivable)} variance="+$74K vs prior period" status="negative" subtitle="Open customer balances" tooltip="Open customer invoice balances outstanding at period end." />
        <PowerBICard title="Accounts Payable" value={formatMoney(selectedSummary.accountsPayable)} variance="-$38K vs prior period" status="positive" subtitle="Open vendor obligations" tooltip="Open vendor obligations expected to be paid from available cash." />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
        <ChartCard title="Earned Revenue and Expense Trend" subtitle={trendSubtitle} height={300} className="h-full">
          <BarChart data={selectedTrend} margin={{ top: 5, right: 20, left: 10, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="earnedRevenue" fill="#358540" name="Earned Revenue" />
            <Bar dataKey="priorEarnedRevenue" fill="#90B75D" name="Prior Period Earned Revenue" />
            <Bar dataKey="expenses" fill="#D5741C" name="Expenses" />
            <Bar dataKey="priorExpenses" fill="#56708F" name="Prior Period Expenses" />
          </BarChart>
        </ChartCard>
        </div>
        <div className="space-y-2">
          <FinanceTable title="Basic Cash Outlook" subtitle="Illustrative pending Finance approval" columns={['Cash Outlook', 'Amount']} rows={cashOutlookRows} />
          <FinanceTable title="AR and AP Relationship" columns={['AR/AP', 'Amount']} rows={arApRows} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white border border-[#CFD5D0] p-3">
          <div className="text-sm font-semibold text-[#006637] mb-2" style={{ fontFamily: 'Merriweather, serif' }}>Booked Sales, Earned Revenue, and Final Sales Comparison</div>
          <table className="w-full border-collapse text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <thead>
              <tr className="border-b border-[#CFD5D0]">
                {['Metric', 'Dollars', 'Acres', 'Contract Count'].map((column) => <th key={column} className="text-left text-[#006637] font-semibold py-1 pr-2 whitespace-nowrap">{column}</th>)}
              </tr>
            </thead>
            <tbody>
              {processComparison.map((row) => (
                <tr key={String(row[0])} className="border-b border-[#E6EEE7] last:border-0">
                  <td className="py-1 pr-2 text-[#1A1A1A] whitespace-nowrap">{row[0]}</td>
                  <td className="py-1 pr-2 text-[#1A1A1A] whitespace-nowrap">{formatMoney(Number(row[1]))}</td>
                  <td className="py-1 pr-2 text-[#1A1A1A] whitespace-nowrap">{formatAcres(Number(row[2]))}</td>
                  <td className="py-1 pr-2 text-[#1A1A1A] whitespace-nowrap">{formatCount(Number(row[3]))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white border border-[#CFD5D0] p-3 overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>{topTable.title}</div>
            <div className="flex border border-[#CFD5D0]">
              <button type="button" onClick={() => setTopListView('customers')} className={`px-3 py-1 text-xs font-semibold ${topListView === 'customers' ? 'bg-[#006637] text-white' : 'bg-white text-[#3D654D]'}`}>Customers</button>
              <button type="button" onClick={() => setTopListView('vendors')} className={`px-3 py-1 text-xs font-semibold ${topListView === 'vendors' ? 'bg-[#006637] text-white' : 'bg-white text-[#3D654D]'}`}>Vendors</button>
            </div>
          </div>
          <table className="w-full border-collapse text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <thead>
              <tr className="border-b border-[#CFD5D0]">
                {topTable.columns.map((column) => <th key={column} className="text-left text-[#006637] font-semibold py-1 pr-2 whitespace-nowrap">{column}</th>)}
              </tr>
            </thead>
            <tbody>
              {topTable.rows.map((row) => (
                <tr key={`${topTable.title}-${row[0]}`} className="border-b border-[#E6EEE7] last:border-0">
                  <td className="py-1 pr-2 text-[#1A1A1A] whitespace-nowrap">{row[0]}</td>
                  <td className="py-1 pr-2 text-[#1A1A1A] whitespace-nowrap">{row[1]}</td>
                  <td className="py-1 pr-2 text-[#1A1A1A] whitespace-nowrap">{formatMoney(Number(row[2]))}</td>
                  <td className="py-1 pr-2 text-[#1A1A1A] whitespace-nowrap">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-[11px] text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Illustrative mock data for requirements validation.</div>
    </PageShell>
  );
}

export function IncomeStatement({ filters }: FinancePageProps)
{
  const dateRange = filters;
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const selectedMonthlyFinance = filteredMonthlyFinance(dateRange);
  const selectedTrend = filteredExecutiveTrend(dateRange);
  const periodShare = currentMonthCount(dateRange) / months.length;

  const rowByName = Object.fromEntries(incomeStatementRows.map(([name, current, prior, ytd, priorYtd]) => [
    String(name),
    { current: Number(current), prior: Number(prior), ytd: Number(ytd), priorYtd: Number(priorYtd) },
  ]));
  const directRevenue = {
    current: selectedMonthlyFinance.reduce((total, item) => total + item.direct, 0),
    prior: Math.round(rowByName['Direct-Sourced Earned Revenue'].prior * periodShare),
    ytd: rowByName['Direct-Sourced Earned Revenue'].ytd,
    priorYtd: rowByName['Direct-Sourced Earned Revenue'].priorYtd,
  };
  const rpRevenue = {
    current: selectedMonthlyFinance.reduce((total, item) => total + item.referralPartner, 0),
    prior: Math.round(rowByName['RP-Sourced Earned Revenue'].prior * periodShare),
    ytd: rowByName['RP-Sourced Earned Revenue'].ytd,
    priorYtd: rowByName['RP-Sourced Earned Revenue'].priorYtd,
  };
  const totalRevenue = {
    current: selectedMonthlyFinance.reduce((total, item) => total + item.earnedRevenue, 0),
    prior: selectedTrend.reduce((total, item) => total + item.priorEarnedRevenue, 0),
    ytd: rowByName['Total Earned Revenue'].ytd,
    priorYtd: rowByName['Total Earned Revenue'].priorYtd,
  };
  const totalExpenses = {
    current: -selectedMonthlyFinance.reduce((total, item) => total + item.expenses, 0),
    prior: -selectedTrend.reduce((total, item) => total + item.priorExpenses, 0),
    ytd: rowByName['Cost of Revenue'].ytd + rowByName['Total Operating Expenses'].ytd,
    priorYtd: rowByName['Cost of Revenue'].priorYtd + rowByName['Total Operating Expenses'].priorYtd,
  };
  const costOfRevenue = {
    ...rowByName['Cost of Revenue'],
    current: Math.round(totalExpenses.current * 0.34),
    prior: Math.round(totalExpenses.prior * 0.34),
  };
  const totalOperatingExpenses = {
    ...rowByName['Total Operating Expenses'],
    current: totalExpenses.current - costOfRevenue.current,
    prior: totalExpenses.prior - costOfRevenue.prior,
  };
  const operatingIncome = {
    current: totalRevenue.current + totalExpenses.current,
    prior: totalRevenue.prior + totalExpenses.prior,
    ytd: rowByName['Operating Income'].ytd,
    priorYtd: rowByName['Operating Income'].priorYtd,
  };
  const otherIncomeExpense = {
    current: Math.round(rowByName['Other Income and Expenses'].current * periodShare),
    prior: Math.round(rowByName['Other Income and Expenses'].prior * periodShare),
    ytd: rowByName['Other Income and Expenses'].ytd,
    priorYtd: rowByName['Other Income and Expenses'].priorYtd,
  };
  const netIncome = {
    current: operatingIncome.current + otherIncomeExpense.current,
    prior: operatingIncome.prior + otherIncomeExpense.prior,
    ytd: rowByName['Net Income'].ytd,
    priorYtd: rowByName['Net Income'].priorYtd,
  };
  const departmentExpenseRows = expenseByDepartment.map((item) => ({
    id: `department-${item.department}`,
    label: item.department,
    current: -Math.round(item.value * periodShare),
    prior: -Math.round(item.value * periodShare * 0.91),
    ytd: -item.value,
    priorYtd: -Math.round(item.value * 0.88),
  }));
  const revenueChildren = [
    { id: 'allSourcesRevenue', label: 'Total Earned Revenue', ...totalRevenue },
    { id: 'directRevenue', label: 'Direct-Sourced Earned Revenue', ...directRevenue },
    { id: 'rpRevenue', label: 'RP-Sourced Earned Revenue', ...rpRevenue },
  ];
  const profitAndLossRows: ProfitAndLossRow[] = [
    { id: 'revenue', label: 'Revenue (GAAP Earned Revenue)', ...totalRevenue, children: revenueChildren },
    { id: 'operatingExpenses', label: 'Expenses', ...totalExpenses, children: departmentExpenseRows },
    { id: 'operatingIncome', label: 'Operating Income', ...operatingIncome },
    { id: 'otherIncomeExpense', label: 'Other Income and Expense', ...otherIncomeExpense },
    { id: 'netIncome', label: 'Net Income', ...netIncome },
  ];
  const sourceRevenueRows = [
    ['Total Earned Revenue', totalRevenue.current, totalRevenue.prior, totalRevenue.current - totalRevenue.prior],
    ['RP-Sourced Earned Revenue', rpRevenue.current, rpRevenue.prior, rpRevenue.current - rpRevenue.prior],
    ['Direct-Sourced Earned Revenue', directRevenue.current, directRevenue.prior, directRevenue.current - directRevenue.prior],
  ];
  const departmentExpenseTableRows = departmentExpenseRows.map((row) => [
    row.label,
    row.current,
    row.prior,
    row.current - row.prior,
  ]);
  const toggleExpandedRow = (rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId); else next.add(rowId);
      return next;
    });
  };

  return (
    <PageShell
      title="Income Statement"
      subtitle="Illustrative financial statement structure pending QuickBooks account mapping."
      selectedPeriod={selectedPeriodLabel(dateRange)}
      exportContext={`Finance-statement print layout. Reporting Period: ${selectedPeriodLabel(dateRange)}. Secondary Department, Source, and account filters belong in the Power BI filter pane. Illustrative financial statement structure pending QuickBooks account mapping.`}
    >
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Total Revenue" value={formatMoney(totalRevenue.current)} variance={formatMoney(totalRevenue.current - totalRevenue.prior)} status={totalRevenue.current >= totalRevenue.prior ? 'positive' : 'negative'} subtitle="GAAP Earned Revenue" tooltip="Total GAAP-compliant earned revenue for the selected period; distinct from Booked Sales and Final Sales." />
        <PowerBICard title="Total Expenses" value={formatMoney(totalExpenses.current)} variance={formatMoney(totalExpenses.current - totalExpenses.prior)} status={Math.abs(totalExpenses.current) <= Math.abs(totalExpenses.prior) ? 'positive' : 'negative'} subtitle="Illustrative expense structure" tooltip="Total expenses included in operating results for the selected period." />
        <PowerBICard title="Operating Income" value={formatMoney(operatingIncome.current)} variance={formatMoney(operatingIncome.current - operatingIncome.prior)} status={operatingIncome.current >= operatingIncome.prior ? 'positive' : 'negative'} subtitle="Financial statement subtotal" tooltip="Operating profit before other income and expense." />
        <PowerBICard title="Net Income" value={formatMoney(netIncome.current)} variance={formatMoney(netIncome.current - netIncome.prior)} status={netIncome.current >= netIncome.prior ? 'positive' : 'negative'} subtitle="Bottom-line income" tooltip="Income after operating and other income and expense." />
      </div>
      <ProfitAndLossTable title="Income Statement Matrix" subtitle="Illustrative account hierarchy pending QuickBooks mapping" rows={profitAndLossRows} expandedRows={expandedRows} onToggle={toggleExpandedRow} />
      <div className="grid grid-cols-3 gap-3">
        <FinanceTable title="Earned Revenue by Source" subtitle="Earned Revenue source labels are placeholders pending Finance confirmation" columns={['Source', 'Current Period', 'Prior Period', 'Dollar Variance']} rows={sourceRevenueRows} />
        <FinanceTable title="Expenses by Department" subtitle="Illustrative allocation pending Finance confirmation" columns={['Department', 'Current Period', 'Prior Period', 'Dollar Variance']} rows={departmentExpenseTableRows} />
        <ChartCard title="Earned Revenue and Expense Trend" subtitle="GAAP Earned Revenue and expenses by month" height={180}>
          <LineChart data={selectedMonthlyFinance} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Line type="monotone" dataKey="earnedRevenue" stroke="#3D654D" strokeWidth={2} name="Earned Revenue" />
            <Line type="monotone" dataKey="expenses" stroke="#D5741C" strokeWidth={2} name="Expenses" />
          </LineChart>
        </ChartCard>
      </div>
    </PageShell>
  );
}

export function RevenueRecognition({ filters }: FinancePageProps)
{
  const dateRange = filters;
  const selectedRecognitionMonths = selectedMonthsFor(dateRange);
  const [stageFilter, setStageFilter] = useState('all');
  const [recognitionMetric, setRecognitionMetric] = useState<'dollars' | 'acres'>('dollars');
  const [stageView, setStageView] = useState<'chart' | 'table'>('chart');
  const recognitionMonths = selectedRecognitionMonths;
  const recognitionPeriod = selectedPeriodLabel(dateRange);
  const stageNames = {
    stage1: 'Stage 1 — Signed Agreement',
    stage2: 'Stage 2 — Soil Data Collection Complete',
    stage3: 'Stage 3 — Report Complete',
  };
  const isRecognitionDateInRange = (date: string) => recognitionMonths.includes(monthFromIsoDate(date));
  const filteredDeals = financeDeals.filter((deal) =>
    [deal.stage1Date, deal.stage2Date, deal.stage3Date].some(isRecognitionDateInRange)
  );
  const stageTotals = filteredDeals.reduce((acc, deal) => {
    const stage = stageAmountForFinanceDeal(deal.contractValue);
    if (isRecognitionDateInRange(deal.stage1Date)) {
      acc.stage1.revenue += stage;
      acc.stage1.acres += deal.acres;
      acc.stage1.contracts += 1;
    }
    if (isRecognitionDateInRange(deal.stage2Date)) {
      acc.stage2.revenue += stage;
      acc.stage2.acres += deal.acres;
      acc.stage2.contracts += 1;
    }
    if (isRecognitionDateInRange(deal.stage3Date)) {
      acc.stage3.revenue += stage;
      acc.stage3.acres += deal.acres;
      acc.stage3.contracts += 1;
    }
    return acc;
  }, {
    stage1: { revenue: 0, acres: 0, contracts: 0 },
    stage2: { revenue: 0, acres: 0, contracts: 0 },
    stage3: { revenue: 0, acres: 0, contracts: 0 },
  });
  const totalEarnedRevenue = stageTotals.stage1.revenue + stageTotals.stage2.revenue + stageTotals.stage3.revenue;
  const recognizedAcres = filteredDeals.reduce((total, deal) => total + deal.acres, 0);
  const crmEarnedRevenue = totalEarnedRevenue;
  const generalLedgerRevenue = filteredDeals.reduce((total, deal) => total + deal.glRevenue, 0);
  const reconciliationVariance = generalLedgerRevenue - crmEarnedRevenue;
  const unmatchedRecords = filteredDeals.filter((deal) => deal.reconciliationStatus !== 'Reconciled').length;
  const stageRows = [
    [stageNames.stage1, stageTotals.stage1.revenue, stageTotals.stage1.acres, stageTotals.stage1.contracts],
    [stageNames.stage2, stageTotals.stage2.revenue, stageTotals.stage2.acres, stageTotals.stage2.contracts],
    [stageNames.stage3, stageTotals.stage3.revenue, stageTotals.stage3.acres, stageTotals.stage3.contracts],
  ];
  const visibleStageRows = stageRows.filter((row, index) => stageFilter === 'all' || stageFilter === `stage${index + 1}`);
  const periodData = recognitionMonths.map((month) => filteredDeals.reduce((period, deal) => {
    const stage = stageAmountForFinanceDeal(deal.contractValue);
    if (monthFromIsoDate(deal.stage1Date) === month) {
      period.stage1Dollars += stage;
      period.stage1Acres += deal.acres;
      period.stage1Contracts += 1;
    }
    if (monthFromIsoDate(deal.stage2Date) === month) {
      period.stage2Dollars += stage;
      period.stage2Acres += deal.acres;
      period.stage2Contracts += 1;
    }
    if (monthFromIsoDate(deal.stage3Date) === month) {
      period.stage3Dollars += stage;
      period.stage3Acres += deal.acres;
      period.stage3Contracts += 1;
    }
    return period;
  }, {
    period: month,
    stage1Dollars: 0,
    stage2Dollars: 0,
    stage3Dollars: 0,
    stage1Acres: 0,
    stage2Acres: 0,
    stage3Acres: 0,
    stage1Contracts: 0,
    stage2Contracts: 0,
    stage3Contracts: 0,
  }));
  const visiblePeriodData = periodData.map((item) => ({
    period: item.period,
    stage1: stageFilter === 'all' || stageFilter === 'stage1' ? metricValue(recognitionMetric, item.stage1Dollars, item.stage1Acres, item.stage1Contracts) : 0,
    stage2: stageFilter === 'all' || stageFilter === 'stage2' ? metricValue(recognitionMetric, item.stage2Dollars, item.stage2Acres, item.stage2Contracts) : 0,
    stage3: stageFilter === 'all' || stageFilter === 'stage3' ? metricValue(recognitionMetric, item.stage3Dollars, item.stage3Acres, item.stage3Contracts) : 0,
  }));
  const periodRows = visiblePeriodData.map((item) => [item.period, item.stage1, item.stage2, item.stage3, item.stage1 + item.stage2 + item.stage3]);

  return (
    <PageShell
      title="Revenue Recognition"
      subtitle="Stage amounts use one-third mockup logic pending final validation by Finance."
      selectedPeriod={recognitionPeriod}
      exportContext={`Earned Revenue audit report. Recognition Period: ${recognitionPeriod}. Recognition Stage: ${stageFilter}. Metric: ${recognitionMetric}. Customer, Source, and Reconciliation Result belong in the Power BI filter pane. One-third allocation is a mockup assumption based on the meeting description; final DAX and accounting treatment must be approved by Finance. Stage-acre calculation pending Finance confirmation. Open implementation rules include discounts, change orders, refunds, credits, cancellations, partial acreage changes, reopened accounts, and manual adjustments.`}
    >
      <div className="grid grid-cols-5 gap-3">
        <PowerBICard title="Total Earned Revenue" value={formatMoney(totalEarnedRevenue)} variance={formatMoney(reconciliationVariance)} status={reconciliationVariance === 0 ? 'positive' : 'negative'} subtitle="Operational stage completion" tooltip="GAAP-compliant revenue recognized when each applicable approved stage is completed." />
        <PowerBICard title="Stage 1 Earned Revenue" value={formatMoney(stageTotals.stage1.revenue)} subtitle={stageNames.stage1} tooltip="Earned Revenue recognized when Stage 1 — Signed Agreement is complete." />
        <PowerBICard title="Stage 2 Earned Revenue" value={formatMoney(stageTotals.stage2.revenue)} subtitle={stageNames.stage2} tooltip="Earned Revenue recognized when Stage 2 — Soil Data Collection Complete is recorded." />
        <PowerBICard title="Stage 3 Earned Revenue" value={formatMoney(stageTotals.stage3.revenue)} subtitle={stageNames.stage3} tooltip="Earned Revenue recognized when Stage 3 — Report Complete is recorded." />
        <PowerBICard title="Recognized Acres" value={formatAcres(recognizedAcres)} subtitle="Deals with Earned Revenue" tooltip="Acres associated with deals that have at least one completed recognition stage." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-3 gap-3">
          <PowerBISlicer title="Recognition Stage" value={stageFilter} onChange={setStageFilter} options={[{ value: 'all', label: 'All Stages' }, { value: 'stage1', label: stageNames.stage1 }, { value: 'stage2', label: stageNames.stage2 }, { value: 'stage3', label: stageNames.stage3 }]} />
          <PowerBISlicer title="Metric" value={recognitionMetric} onChange={(value) => setRecognitionMetric(value as 'dollars' | 'acres')} options={[{ value: 'dollars', label: 'Dollars' }, { value: 'acres', label: 'Acres' }]} />
          <PowerBISlicer title="View" value={stageView} onChange={(value) => setStageView(value as 'chart' | 'table')} options={[{ value: 'chart', label: 'Chart' }, { value: 'table', label: 'Table' }]} />
        </div>
      </div>
      <div className="text-[11px] text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        Stage-acre calculation pending Finance confirmation. Confirm whether acres should represent full contract acres at each stage, unique acres, or another approved definition.
      </div>
      <div className="grid grid-cols-2 items-start gap-3">
        {stageView === 'chart' ? (
          <ChartCard title="Monthly Stage Reporting" subtitle={`${metricLabel(recognitionMetric)} by recognition period and stage`} height={210}>
            <BarChart data={visiblePeriodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="period" tick={chartText} />
              <YAxis tick={chartText} tickFormatter={recognitionMetric === 'dollars' ? moneyAxis : (value) => `${(Number(value) / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => recognitionMetric === 'dollars' ? moneyTip(value) : `${formatAcres(Number(value))} Acres`} />
              <Legend wrapperStyle={chartText} />
              {(stageFilter === 'all' || stageFilter === 'stage1') && <Bar dataKey="stage1" stackId="stage" fill="#234E2A" name={stageNames.stage1} />}
              {(stageFilter === 'all' || stageFilter === 'stage2') && <Bar dataKey="stage2" stackId="stage" fill="#358540" name={stageNames.stage2} />}
              {(stageFilter === 'all' || stageFilter === 'stage3') && <Bar dataKey="stage3" stackId="stage" fill="#56708F" name={stageNames.stage3} />}
            </BarChart>
          </ChartCard>
        ) : (
          <FinanceTable title="Monthly Stage Reporting" subtitle={`${metricLabel(recognitionMetric)} by recognition period and stage`} columns={['Period', `${stageNames.stage1} ${metricLabel(recognitionMetric)}`, `${stageNames.stage2} ${metricLabel(recognitionMetric)}`, `${stageNames.stage3} ${metricLabel(recognitionMetric)}`, `Total ${metricLabel(recognitionMetric)}`]} rows={periodRows} />
        )}
        <FinanceTable title="Earned Revenue by Stage" subtitle="Stage-level dollars, acres, and contract count" columns={['Earned Revenue Stage', 'Dollars', 'Acres', 'Contract Count']} rows={visibleStageRows} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable title="Reconciliation Summary" subtitle="Operational Earned Revenue reconciled to general-ledger revenue" columns={['Reconciliation Summary', 'Value']} rows={[
          ['Operational or CRM Earned Revenue', crmEarnedRevenue],
          ['General-Ledger Revenue', generalLedgerRevenue],
          ['Variance', reconciliationVariance],
          ['Unmatched Records', unmatchedRecords],
          ['Last Reconciliation Date', '2026-06-30'],
        ]} />
      </div>
    </PageShell>
  );
}

export function BalanceSheet({ filters }: FinancePageProps)
{
  const dateRange = filters;
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['assets', 'currentAssets', 'liabilities', 'currentLiabilities', 'equity']));
  const selectedMonth = selectedMonthsFor(dateRange)[selectedMonthsFor(dateRange).length - 1];
  const selectedTrendPoint = balanceSheetTrend.find((item) => item.month === selectedMonth) ?? balanceSheetTrend[balanceSheetTrend.length - 1];
  const priorTrendPoint = balanceSheetTrend[Math.max(balanceSheetTrend.findIndex((item) => item.month === selectedTrendPoint.month) - 1, 0)] ?? selectedTrendPoint;
  const baseCurrentAssets = balanceSheetStatement.current.cash + balanceSheetStatement.current.accountsReceivable + balanceSheetStatement.current.otherCurrentAssets;
  const basePriorCurrentAssets = balanceSheetStatement.prior.cash + balanceSheetStatement.prior.accountsReceivable + balanceSheetStatement.prior.otherCurrentAssets;
  const baseTotalAssets = baseCurrentAssets + balanceSheetStatement.current.longTermAssets;
  const basePriorTotalAssets = basePriorCurrentAssets + balanceSheetStatement.prior.longTermAssets;
  const baseCurrentLiabilities = balanceSheetStatement.current.accountsPayable + balanceSheetStatement.current.accruedLiabilities;
  const basePriorCurrentLiabilities = balanceSheetStatement.prior.accountsPayable + balanceSheetStatement.prior.accruedLiabilities;
  const baseTotalLiabilities = baseCurrentLiabilities + balanceSheetStatement.current.longTermLiabilities;
  const basePriorTotalLiabilities = basePriorCurrentLiabilities + balanceSheetStatement.prior.longTermLiabilities;
  const baseTotalEquity = balanceSheetStatement.current.contributedCapital + balanceSheetStatement.current.retainedEarnings + balanceSheetStatement.current.currentPeriodEarnings;
  const basePriorTotalEquity = balanceSheetStatement.prior.contributedCapital + balanceSheetStatement.prior.retainedEarnings + balanceSheetStatement.prior.currentPeriodEarnings;
  const assetScale = selectedTrendPoint.assets / baseTotalAssets;
  const priorAssetScale = priorTrendPoint.assets / basePriorTotalAssets;
  const liabilityScale = selectedTrendPoint.liabilities / baseTotalLiabilities;
  const priorLiabilityScale = priorTrendPoint.liabilities / basePriorTotalLiabilities;
  const equityScale = selectedTrendPoint.equity / baseTotalEquity;
  const priorEquityScale = priorTrendPoint.equity / basePriorTotalEquity;
  const currentAssets = Math.round(baseCurrentAssets * assetScale);
  const priorCurrentAssets = Math.round(basePriorCurrentAssets * priorAssetScale);
  const totalAssets = selectedTrendPoint.assets;
  const priorTotalAssets = priorTrendPoint.assets;
  const currentLiabilities = Math.round(baseCurrentLiabilities * liabilityScale);
  const priorCurrentLiabilities = Math.round(basePriorCurrentLiabilities * priorLiabilityScale);
  const totalLiabilities = selectedTrendPoint.liabilities;
  const priorTotalLiabilities = priorTrendPoint.liabilities;
  const totalEquity = selectedTrendPoint.equity;
  const priorTotalEquity = priorTrendPoint.equity;
  const cash = Math.round(balanceSheetStatement.current.cash * assetScale);
  const priorCash = Math.round(balanceSheetStatement.prior.cash * priorAssetScale);
  const accountsReceivable = Math.round(balanceSheetStatement.current.accountsReceivable * assetScale);
  const priorAccountsReceivable = Math.round(balanceSheetStatement.prior.accountsReceivable * priorAssetScale);
  const otherCurrentAssets = currentAssets - cash - accountsReceivable;
  const priorOtherCurrentAssets = priorCurrentAssets - priorCash - priorAccountsReceivable;
  const longTermAssets = totalAssets - currentAssets;
  const priorLongTermAssets = priorTotalAssets - priorCurrentAssets;
  const accountsPayable = Math.round(balanceSheetStatement.current.accountsPayable * liabilityScale);
  const priorAccountsPayable = Math.round(balanceSheetStatement.prior.accountsPayable * priorLiabilityScale);
  const accruedLiabilities = currentLiabilities - accountsPayable;
  const priorAccruedLiabilities = priorCurrentLiabilities - priorAccountsPayable;
  const longTermLiabilities = totalLiabilities - currentLiabilities;
  const priorLongTermLiabilities = priorTotalLiabilities - priorCurrentLiabilities;
  const contributedCapital = Math.round(balanceSheetStatement.current.contributedCapital * equityScale);
  const priorContributedCapital = Math.round(balanceSheetStatement.prior.contributedCapital * priorEquityScale);
  const retainedEarnings = Math.round(balanceSheetStatement.current.retainedEarnings * equityScale);
  const priorRetainedEarnings = Math.round(balanceSheetStatement.prior.retainedEarnings * priorEquityScale);
  const currentPeriodEarnings = totalEquity - contributedCapital - retainedEarnings;
  const priorCurrentPeriodEarnings = priorTotalEquity - priorContributedCapital - priorRetainedEarnings;
  const overdueAr = 290000;
  const upcomingAp = 360000;
  const balanceDifference = totalAssets - (totalLiabilities + totalEquity);
  const rows: StatementRow[] = [
    {
      id: 'assets',
      label: 'Assets',
      current: totalAssets,
      prior: priorTotalAssets,
      children: [
        {
          id: 'currentAssets',
          label: 'Current Assets',
          current: currentAssets,
          prior: priorCurrentAssets,
          children: [
            { id: 'cash', label: 'Cash and Cash Equivalents', current: cash, prior: priorCash },
            { id: 'accountsReceivable', label: 'Accounts Receivable', current: accountsReceivable, prior: priorAccountsReceivable },
            { id: 'otherCurrentAssets', label: 'Other Current Assets', current: otherCurrentAssets, prior: priorOtherCurrentAssets },
          ],
        },
        { id: 'longTermAssets', label: 'Long-Term Assets', current: longTermAssets, prior: priorLongTermAssets },
      ],
    },
    {
      id: 'liabilities',
      label: 'Liabilities',
      current: totalLiabilities,
      prior: priorTotalLiabilities,
      children: [
        {
          id: 'currentLiabilities',
          label: 'Current Liabilities',
          current: currentLiabilities,
          prior: priorCurrentLiabilities,
          children: [
            { id: 'accountsPayable', label: 'Accounts Payable', current: accountsPayable, prior: priorAccountsPayable },
            { id: 'accruedLiabilities', label: 'Accrued Liabilities', current: accruedLiabilities, prior: priorAccruedLiabilities },
          ],
        },
        { id: 'longTermLiabilities', label: 'Long-Term Liabilities', current: longTermLiabilities, prior: priorLongTermLiabilities },
      ],
    },
    {
      id: 'equity',
      label: 'Equity',
      current: totalEquity,
      prior: priorTotalEquity,
      children: [
        { id: 'contributedCapital', label: 'Contributed Capital', current: contributedCapital, prior: priorContributedCapital },
        { id: 'retainedEarnings', label: 'Retained Earnings', current: retainedEarnings, prior: priorRetainedEarnings },
        { id: 'currentPeriodEarnings', label: 'Current Period Earnings', current: currentPeriodEarnings, prior: priorCurrentPeriodEarnings },
      ],
    },
  ];
  const toggleExpandedRow = (rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId); else next.add(rowId);
      return next;
    });
  };

  return (
    <PageShell
      title="Balance Sheet"
      subtitle="Illustrative account hierarchy pending final QuickBooks mapping."
      selectedPeriod={selectedPeriodLabel(dateRange)}
      exportContext={`Finance-statement print layout. Reporting Period: ${selectedPeriodLabel(dateRange)}. Includes hierarchical balance sheet, compact AR/AP relationship, prior-period comparison, and Assets = Liabilities + Equity validation. Illustrative account hierarchy pending final QuickBooks mapping.`}
    >
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Total Assets" value={formatMoney(totalAssets)} variance={formatMoney(totalAssets - priorTotalAssets)} status={totalAssets >= priorTotalAssets ? 'positive' : 'negative'} subtitle="Current Period" tooltip="Total current and long-term assets." />
        <PowerBICard title="Total Liabilities" value={formatMoney(totalLiabilities)} variance={formatMoney(totalLiabilities - priorTotalLiabilities)} status={totalLiabilities <= priorTotalLiabilities ? 'positive' : 'negative'} subtitle="Current Period" tooltip="Total current and long-term liabilities." />
        <PowerBICard title="Total Equity" value={formatMoney(totalEquity)} variance={formatMoney(totalEquity - priorTotalEquity)} status={totalEquity >= priorTotalEquity ? 'positive' : 'negative'} subtitle="Current Period" tooltip="Contributed capital, retained earnings, and current period earnings." />
        <PowerBICard title="Cash Balance" value={formatMoney(cash)} variance={formatMoney(cash - priorCash)} status={cash >= priorCash ? 'positive' : 'negative'} subtitle="Cash and Cash Equivalents" tooltip="Cash and cash equivalents at period end." />
      </div>
      <BalanceSheetStatementTable title="Balance Sheet Matrix" subtitle="Illustrative Assets, Liabilities, and Equity hierarchy pending final QuickBooks mapping" rows={rows} expandedRows={expandedRows} onToggle={toggleExpandedRow} />
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable title="AR and AP Relationship" subtitle="Open receivables and payables summary" columns={['AR and AP Relationship', 'Amount']} rows={[
          ['Total AR', accountsReceivable],
          ['Total AP', accountsPayable],
          ['Overdue AR', overdueAr],
          ['Near-Term AP', upcomingAp],
        ]} />
        <div className="self-start bg-white border border-[#CFD5D0] p-3">
          <div className="flex items-center justify-between gap-3 text-sm" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <span className="font-semibold text-[#006637]">Assets = Liabilities + Equity</span>
            <span className={balanceDifference === 0 ? 'font-semibold text-[#2F7641]' : 'font-semibold text-[#A33C1B]'}>
              {formatMoney(totalAssets)} = {formatMoney(totalLiabilities + totalEquity)}
            </span>
            <StatusBadge tone={balanceDifference === 0 ? 'green' : 'orange'}>{balanceDifference === 0 ? 'Balanced' : `Out of Balance ${formatMoney(balanceDifference)}`}</StatusBadge>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export function CashFlow({ filters }: FinancePageProps)
{
  const dateRange = filters;
  const selectedCashFlowTrend = monthlyCashFlowTrend.filter((item) => isMonthInRange(item.month, dateRange));
  const firstCashMonth = selectedCashFlowTrend[0] ?? monthlyCashFlowTrend[0];
  const lastCashMonth = selectedCashFlowTrend[selectedCashFlowTrend.length - 1] ?? monthlyCashFlowTrend[monthlyCashFlowTrend.length - 1];
  const beginningCash = firstCashMonth.endingCash - firstCashMonth.operatingCashFlow - firstCashMonth.investingCashFlow - firstCashMonth.financingCashFlow;
  const operatingCashFlow = selectedCashFlowTrend.reduce((total, item) => total + item.operatingCashFlow, 0);
  const investingCashFlow = selectedCashFlowTrend.reduce((total, item) => total + item.investingCashFlow, 0);
  const financingCashFlow = selectedCashFlowTrend.reduce((total, item) => total + item.financingCashFlow, 0);
  const freeCashFlow = operatingCashFlow + investingCashFlow;
  const netChangeInCash = operatingCashFlow + investingCashFlow + financingCashFlow;
  const endingCash = lastCashMonth.endingCash;
  const selectedCashFlowStatementRows = [
    ['Operating Activities', operatingCashFlow],
    ['Investing Activities', investingCashFlow],
    ['Financing Activities', financingCashFlow],
    ['Net Change in Cash', netChangeInCash],
    ['Beginning Cash', beginningCash],
    ['Ending Cash', endingCash],
  ];
  const selectedCashFlowOutlook = cashFlowOutlook.map(([label, amount]) => (
    label === 'Current Cash' ? [label, endingCash] : [label, amount]
  ));

  return (
    <PageShell
      title="Cash Flow"
      subtitle="Illustrative financial statement structure pending QuickBooks account mapping."
      selectedPeriod={selectedPeriodLabel(dateRange)}
      exportContext={`Finance-statement print layout. Reporting Period: ${selectedPeriodLabel(dateRange)}. Secondary account filters belong in the Power BI filter pane. Free Cash Flow definition pending Finance confirmation. Illustrative financial statement structure pending QuickBooks account mapping.`}
    >
      <div className="grid grid-cols-3 gap-3">
        <PowerBICard title="Ending Cash" value={formatMoney(endingCash)} status="positive" subtitle="Cash balance rollforward" tooltip="Cash and cash equivalents at the end of the selected period." />
        <PowerBICard title="Net Change in Cash" value={formatMoney(netChangeInCash)} status={netChangeInCash >= 0 ? 'positive' : 'negative'} subtitle="Operating + investing + financing" tooltip="Net change in cash from operating, investing, and financing activities." />
        <PowerBICard title="Free Cash Flow" value={formatMoney(freeCashFlow)} status={freeCashFlow >= 0 ? 'positive' : 'negative'} subtitle="Definition pending Finance confirmation." tooltip="Illustrative Free Cash Flow currently uses operating cash flow plus investing cash flow. Definition pending Finance confirmation." />
      </div>
      <FinanceTable title="Cash Flow Statement Matrix" subtitle="Illustrative operating, investing, and financing structure pending QuickBooks account mapping" columns={['Cash Flow Statement', 'Actual Amount']} rows={selectedCashFlowStatementRows} />
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable title="Basic Cash Outlook" subtitle="Basic cash outlook only" columns={['Cash Outlook', 'Amount']} rows={selectedCashFlowOutlook} />
        <ChartCard title="Free Cash Flow Trend" subtitle="Definition pending Finance confirmation." height={240}>
          <LineChart data={selectedCashFlowTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="freeCashFlow" stroke="#3D654D" strokeWidth={2} name="Free Cash Flow" />
          </LineChart>
        </ChartCard>
      </div>
    </PageShell>
  );
}

export function ExceptionReporting({ filters }: FinancePageProps)
{
  const dateRange = filters;
  const [exceptionTypeFilter, setExceptionTypeFilter] = useState('all');
  const exceptionCategories = [
    'Backward Stage Movement',
    'Missing Stage Date',
    'CRM or Operational-to-General-Ledger Mismatch',
    'Historical-Period Change',
  ];
  const filteredExceptions = controlExceptions.filter((item) => {
    if (!exceptionCategories.includes(item.exceptionType)) return false;
    if (!isDateInRange(item.detectedDate, dateRange)) return false;
    if (exceptionTypeFilter !== 'all' && item.exceptionType !== exceptionTypeFilter) return false;
    return true;
  });
  const backwardStageMovements = filteredExceptions.filter((item) => item.exceptionType === 'Backward Stage Movement').length;
  const missingStageDates = filteredExceptions.filter((item) => item.exceptionType === 'Missing Stage Date').length;
  const glMismatches = filteredExceptions.filter((item) => item.exceptionType === 'CRM or Operational-to-General-Ledger Mismatch').length;
  const historicalPeriodChanges = filteredExceptions.filter((item) => item.exceptionType === 'Historical-Period Change').length;
  const exceptionTypeOptions = exceptionCategories.map((type) => ({ value: type, label: type }));
  const exceptionSummaryRows = exceptionTypeOptions.map((option) => {
    const records = filteredExceptions.filter((item) => item.exceptionType === option.value);
    return [
      option.label,
      records.length,
      records.reduce((total, item) => total + item.revenueDifference, 0),
    ];
  });
  const exceptionDetailRows = filteredExceptions.map((item) => [
    item.exceptionType,
    item.dealOrProject,
    item.customer,
    item.affectedPeriod,
    item.revenueDifference,
    item.sourceSystem,
    item.detectedDate,
  ]);
  return (
    <PageShell
      title="Exception Reporting"
      subtitle="Read-only monitoring of revenue recognition and financial data exceptions."
      selectedPeriod={selectedPeriodLabel(dateRange)}
      exportContext={`Read-only exception report. Reporting Period=${selectedPeriodLabel(dateRange)}; Exception Type=${exceptionTypeFilter}. Customer and Source System belong in the Power BI filter pane. Interactions: read-only drillthrough to exception detail, Export Data, and Export to PDF. The report does not resolve, assign, or edit exceptions in Power BI. Filtered exceptions: ${filteredExceptions.length}.`}
    >
      <div className="grid grid-cols-5 gap-3">
        <PowerBICard title="Open Exceptions" value={filteredExceptions.length} status={filteredExceptions.length > 0 ? 'negative' : 'positive'} subtitle="Read-only exception count" tooltip="Open revenue-recognition and financial data exceptions in the selected view." />
        <PowerBICard title="Deals Moved Backward" value={backwardStageMovements} subtitle="Backward Stage Movement" status={backwardStageMovements > 0 ? 'negative' : 'positive'} tooltip="Deals where a revenue-recognition stage moved backward after being recorded." />
        <PowerBICard title="Missing Stage Dates" value={missingStageDates} subtitle="Missing Stage Date" status={missingStageDates > 0 ? 'negative' : 'positive'} tooltip="Records missing a required stage date." />
        <PowerBICard title="General-Ledger Mismatches" value={glMismatches} subtitle="CRM or Operational-to-GL" status={glMismatches > 0 ? 'negative' : 'positive'} tooltip="Operational Earned Revenue not matching general-ledger revenue." />
        <PowerBICard title="Historical-Period Changes" value={historicalPeriodChanges} subtitle="Historical-Period Change" status={historicalPeriodChanges > 0 ? 'negative' : 'positive'} tooltip="Revenue-recognition records changed after a prior period close." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-1 gap-3">
          <PowerBISlicer title="Exception Type" value={exceptionTypeFilter} onChange={setExceptionTypeFilter} options={[{ value: 'all', label: 'All Exception Types' }, ...exceptionTypeOptions]} />
        </div>
      </div>
      <FinanceTable title="Exception Summary" subtitle="Potential Financial Impact pending calculation definition" columns={['Exception Type', 'Record Count', 'Potential Financial Impact']} rows={exceptionSummaryRows} />
      <FinanceTable title="Exception Detail" subtitle="Read-only table; customer and source system filters belong in the Power BI filter pane" columns={['Exception Type', 'Deal / Project', 'Customer', 'Affected Period', 'Potential Financial Impact', 'Source System', 'Detected Date']} rows={exceptionDetailRows} />
    </PageShell>
  );
}
