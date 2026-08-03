import { useState } from 'react';
import { Copy, ExternalLink, FileDown, FileText, Printer } from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import PowerBICard from '../components/PowerBICard';
import PowerBISlicer from '../components/PowerBISlicer';
import {
  arApAging,
  arApSummary,
  balanceSheetStatement,
  balanceSheetTrend,
  cashFlowOutlook,
  cashFlowOutlookDetail,
  cashFlowStatementRows,
  cashFlowVariance,
  controlExceptions,
  earnedForFinanceDeal,
  executiveTrend,
  expenseByDepartment,
  exceptions,
  financeDeals,
  financeSummary,
  formatMoney,
  incomeStatementRows,
  monthlyCashFlowTrend,
  monthlyFinance,
  stageAmountForFinanceDeal,
  vendors,
} from '../data/financeMockData';

const COLORS = ['#234E2A', '#358540', '#90B75D', '#56708F', '#D5741C'];

const exportDate = () => new Date().toISOString().slice(0, 10);
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function dashboardFileName(title: string, selectedPeriod: string, extension: string) {
  return `${slug(title)}-${slug(selectedPeriod)}-${exportDate()}.${extension}`;
}

function DashboardActions({
  title,
  selectedPeriod,
  exportContext,
}: {
  title: string;
  selectedPeriod: string;
  exportContext: string;
}) {
  const exportBody = [
    title,
    `Selected Period: ${selectedPeriod}`,
    `Export Date: ${exportDate()}`,
    '',
    exportContext,
  ].join('\n');
  const actionClass = 'px-2 py-1 text-xs font-semibold bg-[#E6EEE7] text-[#006637] flex items-center gap-1';
  const fileBase = dashboardFileName(title, selectedPeriod, '').replace(/\.$/, '');

  const copyTable = async () => {
    await navigator.clipboard?.writeText(exportBody);
  };

  return (
    <div className="dashboard-actions flex flex-wrap justify-end gap-2">
      <button type="button" onClick={copyTable} className={actionClass} style={{ fontFamily: 'Source Sans 3, sans-serif' }} title={`Power BI Export Data: ${fileBase}.csv`}>
        <FileDown className="w-3.5 h-3.5" /> Export Data
      </button>
      <button type="button" onClick={() => window.print()} className={actionClass} style={{ fontFamily: 'Source Sans 3, sans-serif' }} title={`Power BI Export to PDF: ${fileBase}.pdf`}>
        <FileText className="w-3.5 h-3.5" /> Export to PDF
      </button>
      <button type="button" onClick={() => window.print()} className={actionClass} style={{ fontFamily: 'Source Sans 3, sans-serif' }} title="Power BI Print Report">
        <Printer className="w-3.5 h-3.5" /> Print Report
      </button>
      <button type="button" onClick={copyTable} className={actionClass} style={{ fontFamily: 'Source Sans 3, sans-serif' }} title="Power BI Copy Table">
        <Copy className="w-3.5 h-3.5" /> Copy Table
      </button>
      <button type="button" onClick={copyTable} className={actionClass} style={{ fontFamily: 'Source Sans 3, sans-serif' }} title="Power BI drillthrough or paginated detail report">
        <ExternalLink className="w-3.5 h-3.5" /> View Detailed Report
      </button>
    </div>
  );
}

function PageShell({
  title,
  children,
  selectedPeriod = 'YTD 2026',
  exportContext,
}: {
  title: string;
  children: React.ReactNode;
  selectedPeriod?: string;
  exportContext?: string;
}) {
  return (
    <div className="print-report powerbi-page-shell p-4">
      <div className="powerbi-canvas space-y-4">
      <div className="flex items-start justify-between gap-4 print-section">
        <div>
          <div className="text-lg font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>{title}</div>
          <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Selected Period: {selectedPeriod}</div>
          <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Finance Reporting mockup for CFO requirements review</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="px-2 py-1 text-xs rounded font-semibold bg-[#56708F] text-white" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Illustrative Data
          </span>
          <DashboardActions title={title} selectedPeriod={selectedPeriod} exportContext={exportContext ?? `${title} dashboard export package.`} />
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
function ChartCard({ title, subtitle, height = 280, children }: { title: string; subtitle: string; height?: number; children: React.ReactNode }) {
  return (
    <div className="print-section bg-white border border-[#CFD5D0] p-4">
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
function FinanceTable({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <div className="print-section bg-white border border-[#CFD5D0] p-4 overflow-x-auto">
      <table className="w-full border-collapse text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        <thead>
          <tr className="border-b border-[#CFD5D0]">
            {columns.map((column) => (
              <th key={column} className="text-left text-[#006637] font-semibold py-2 pr-3 whitespace-nowrap">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-[#E6EEE7] last:border-0">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">
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
    if (/acres/i.test(column)) return `${formatAcres(cell)} Acres`;
    if (/contract count|contracts|records|unmatched/i.test(column)) return formatCount(cell);
    return cell > 999 || cell < 0 ? formatMoney(cell) : cell.toLocaleString();
  }
  if (['Reconciled', 'Resolved', 'Clear'].includes(cell)) return <StatusBadge tone="green">{cell}</StatusBadge>;
  if (['Review Required', 'Investigating', 'High'].includes(cell)) return <StatusBadge tone="blue">{cell}</StatusBadge>;
  if (['Missing Data', 'Material Variance', 'Critical', 'New'].includes(cell)) return <StatusBadge tone="orange">{cell}</StatusBadge>;
  if (['Accepted Exception', 'Medium', 'Low'].includes(cell)) return <StatusBadge tone="gray">{cell}</StatusBadge>;
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
const metricAxis = (metric: MetricMode) => (value: number) => metric === 'dollars' ? moneyAxis(value) : metric === 'acres' ? `${(value / 1000).toFixed(0)}K` : formatCount(value);
const metricTip = (metric: MetricMode) => (value: number) => metric === 'dollars' ? formatMoney(value) : metric === 'acres' ? `${formatAcres(value)} Acres` : `${formatCount(value)} Contracts`;
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
const marginFormat = (numerator: number, denominator: number) => percentFormat((numerator / Math.max(Math.abs(denominator), 1)) * 100);

function varianceTone(value: number) {
  if (value > 0) return 'text-[#2F7641]';
  if (value < 0) return 'text-[#A33C1B]';
  return 'text-[#3D654D]';
}

function ProfitAndLossTable({
  rows,
  expandedRows,
  onToggle,
}: {
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
          <td className={`py-2 pr-3 whitespace-nowrap ${rowClass}`} style={{ paddingLeft: `${depth * 18}px` }}>
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
          <td className={`py-2 pr-3 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.current)}</td>
          <td className={`py-2 pr-3 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.prior)}</td>
          <td className={`py-2 pr-3 text-right whitespace-nowrap font-semibold ${varianceTone(dollarVariance)}`}>{formatMoney(dollarVariance)}</td>
          <td className={`py-2 pr-3 text-right whitespace-nowrap font-semibold ${varianceTone(dollarVariance)}`}>{percentFormat(percentVariance)}</td>
          <td className={`py-2 pr-3 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.ytd)}</td>
          <td className={`py-2 pr-3 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.priorYtd)}</td>
        </tr>
      );

      if (!expanded || !row.children?.length) return [current];
      return [current, ...renderRows(row.children, depth + 1)];
    });

  return (
    <div className="bg-white border border-[#CFD5D0] p-4 overflow-x-auto">
      <table className="w-full border-collapse text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        <thead>
          <tr className="border-b border-[#CFD5D0]">
            {['Account', 'Current Period', 'Prior Period', 'Dollar Variance', 'Percent Variance', 'Year-to-Date', 'Prior-Year-to-Date'].map((column, index) => (
              <th key={column} className={`${index === 0 ? 'text-left' : 'text-right'} text-[#006637] font-semibold py-2 pr-3 whitespace-nowrap`}>
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
  rows,
  expandedRows,
  onToggle,
}: {
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
          <td className={`py-2 pr-3 whitespace-nowrap ${rowClass}`} style={{ paddingLeft: `${depth * 18}px` }}>
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
          <td className={`py-2 pr-3 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.current)}</td>
          <td className={`py-2 pr-3 text-right whitespace-nowrap ${rowClass}`}>{formatMoney(row.prior)}</td>
          <td className={`py-2 pr-3 text-right whitespace-nowrap font-semibold ${varianceTone(dollarVariance)}`}>{formatMoney(dollarVariance)}</td>
          <td className={`py-2 pr-3 text-right whitespace-nowrap font-semibold ${varianceTone(dollarVariance)}`}>{percentFormat(percentVariance)}</td>
        </tr>
      );

      if (!expanded || !row.children?.length) return [current];
      return [current, ...renderRows(row.children, depth + 1)];
    });

  return (
    <div className="bg-white border border-[#CFD5D0] p-4 overflow-x-auto">
      <table className="w-full border-collapse text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        <thead>
          <tr className="border-b border-[#CFD5D0]">
            {['Account', 'Current Period', 'Prior Period', 'Dollar Variance', 'Percent Variance'].map((column, index) => (
              <th key={column} className={`${index === 0 ? 'text-left' : 'text-right'} text-[#006637] font-semibold py-2 pr-3 whitespace-nowrap`}>
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

export function ExecutiveSnapshot() {
  const [processMetric, setProcessMetric] = useState<MetricMode>('dollars');
  const currentPeriodLabel = 'YTD 2026';
  const trendTotals = executiveTrend.reduce((totals, item) => ({
    earnedRevenue: totals.earnedRevenue + item.earnedRevenue,
    priorEarnedRevenue: totals.priorEarnedRevenue + item.priorEarnedRevenue,
    expenses: totals.expenses + item.expenses,
    priorExpenses: totals.priorExpenses + item.priorExpenses,
  }), { earnedRevenue: 0, priorEarnedRevenue: 0, expenses: 0, priorExpenses: 0 });
  const totalVendorSpend = vendors.reduce((total, [, spend]) => total + Number(spend), 0);
  const topCustomers = financeDeals
    .map((deal) => [deal.customer, deal.contractValue, deal.acres, 1] as [string, number, number, number])
    .sort((a, b) => b[1] - a[1])
    .map(([customer, value, acres, contracts], index) => [index + 1, customer, value, acres, contracts, `${((value / financeSummary.bookSales) * 100).toFixed(1)}%`]);
  const topVendors = vendors
    .map(([vendor, spend], index) => [index + 1, vendor, Number(spend), `${((Number(spend) / totalVendorSpend) * 100).toFixed(1)}%`]);
  const processComparison = [
    ['Book Sales', financeSummary.bookSales, financeSummary.bookAcres, financeDeals.length, 'Signed contract value at front end of process'],
    ['Earned Revenue', financeSummary.earnedRevenue, financeSummary.earnedAcres, financeDeals.filter((deal) => earnedForFinanceDeal(deal) > 0).length, 'GAAP revenue recognized through three stages'],
    ['Final Sales', financeSummary.finalSales, financeSummary.finalAcres, financeDeals.filter((deal) => deal.finalSales > 0).length, 'Fully collected accounts eligible for incentives'],
  ];
  const processChartData = processComparison.map(([metric, dollars, acres, contracts]) => ({
    metric,
    value: metricValue(processMetric, Number(dollars), Number(acres), Number(contracts)),
  }));

  return (
    <PageShell
      title="Executive Snapshot"
      selectedPeriod={currentPeriodLabel}
      exportContext="Presentation-friendly export: major KPI cards, revenue and expense trend, AR/AP summary, top customers, and Book Sales / Earned Revenue / Final Sales comparison."
    >
      <div className="grid grid-cols-6 gap-3">
        <PowerBICard title="Book Sales" value={formatMoney(financeSummary.bookSales)} variance="Positive +8.4%" status="positive" subtitle={`${formatAcres(financeSummary.bookAcres)} Acres | ${formatCount(financeDeals.length)} Contracts`} tooltip="Signed contract value and associated acres at the front end of the process." />
        <PowerBICard title="Earned Revenue" value={formatMoney(financeSummary.earnedRevenue)} variance="Positive +6.1%" status="positive" subtitle={`${formatAcres(financeSummary.earnedAcres)} Acres | ${formatCount(financeDeals.filter((deal) => earnedForFinanceDeal(deal) > 0).length)} Contracts`} tooltip="GAAP revenue recognized through the three revenue-recognition stages." />
        <PowerBICard title="Final Sales" value={formatMoney(financeSummary.finalSales)} variance="Neutral +$891K" status="neutral" subtitle={`${formatAcres(financeSummary.finalAcres)} Acres | ${formatCount(financeDeals.filter((deal) => deal.finalSales > 0).length)} Contracts`} tooltip="Fully collected accounts that may qualify for referral-partner or internal sales incentives." />
        <PowerBICard title="Free Cash Flow" value={formatMoney(financeSummary.freeCashFlow)} variance="Positive +$42K" status="positive" subtitle={`${currentPeriodLabel} vs prior period`} tooltip="Operating cash flow less capital spend for the selected period." />
        <PowerBICard title="Accounts Receivable" value={formatMoney(financeSummary.accountsReceivable)} variance="Negative +$74K" status="negative" subtitle="Open customer balances" tooltip="Open customer invoice balances outstanding at period end." />
        <PowerBICard title="Accounts Payable" value={formatMoney(financeSummary.accountsPayable)} variance="Positive -$38K" status="positive" subtitle="Open vendor obligations" tooltip="Open vendor obligations expected to be paid from available cash." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Revenue and Expense Trend" subtitle="Month-over-month Earned Revenue and expenses vs prior period">
          <BarChart data={executiveTrend} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
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
        <ChartCard title="Cash Flow Outlook" subtitle="Beginning cash, expected movement, and projected ending cash">
          <BarChart data={cashFlowOutlook.map(([category, amount]) => ({ category, amount }))} margin={{ top: 5, right: 30, left: 20, bottom: 45 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="category" tick={{ ...chartText, fontSize: 9 }} angle={-20} textAnchor="end" height={58} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="amount" fill="#234E2A" name="Cash Flow Outlook" />
          </BarChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable columns={['Revenue and Expense Totals', 'Current Period', 'Prior Period', 'Variance']} rows={[
          ['Total Earned Revenue', trendTotals.earnedRevenue, trendTotals.priorEarnedRevenue, trendTotals.earnedRevenue - trendTotals.priorEarnedRevenue],
          ['Total Expenses', trendTotals.expenses, trendTotals.priorExpenses, trendTotals.expenses - trendTotals.priorExpenses],
        ]} />
        <FinanceTable columns={['Cash Flow Outlook', 'Amount']} rows={cashFlowOutlook} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="AR and AP Summary" subtitle="Current, overdue, and upcoming balances">
          <BarChart data={arApSummary.map(([category, amount]) => ({ category, amount }))} margin={{ top: 5, right: 30, left: 20, bottom: 45 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="category" tick={{ ...chartText, fontSize: 9 }} angle={-20} textAnchor="end" height={58} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="amount" fill="#56708F" name="Balance" />
          </BarChart>
        </ChartCard>
        <ChartCard title="AR and AP Aging" subtitle="Simple aging view by days outstanding">
          <BarChart data={arApAging} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="bucket" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="ar" fill="#234E2A" name="Accounts Receivable" />
            <Bar dataKey="ap" fill="#56708F" name="Accounts Payable" />
          </BarChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable columns={['Rank', 'Customer', 'Total Sales or Revenue', 'Acres', 'Contract Count', '% of Total']} rows={topCustomers} />
        <FinanceTable columns={['Rank', 'Vendor', 'Total Expense', '% of Total']} rows={topVendors} />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <PowerBISlicer title="Process Metric" value={processMetric} onChange={(value) => setProcessMetric(value as MetricMode)} options={[{ value: 'dollars', label: 'Dollars' }, { value: 'acres', label: 'Acres' }, { value: 'contracts', label: 'Contracts' }]} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Book Sales, Earned Revenue, and Final Sales Comparison" subtitle={`Distinct business process stages by ${metricLabel(processMetric).toLowerCase()}`}>
          <BarChart data={processChartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="metric" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={metricAxis(processMetric)} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={metricTip(processMetric)} />
            <Bar dataKey="value" fill="#358540" name={metricLabel(processMetric)} />
          </BarChart>
        </ChartCard>
        <FinanceTable columns={['Metric', 'Dollars', 'Acres', 'Contract Count', 'Business Process Stage']} rows={processComparison} />
      </div>
    </PageShell>
  );
}

export function IncomeStatement() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['revenue', 'operatingExpenses']));
  const [revenueView, setRevenueView] = useState('total');
  const [expenseView, setExpenseView] = useState('total');
  const [dateFilter, setDateFilter] = useState('yearToDate');
  const [periodFilter, setPeriodFilter] = useState('currentMonth');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [revenueSourceFilter, setRevenueSourceFilter] = useState('all');

  const rowByName = Object.fromEntries(incomeStatementRows.map(([name, current, prior, ytd, priorYtd]) => [
    String(name),
    { current: Number(current), prior: Number(prior), ytd: Number(ytd), priorYtd: Number(priorYtd) },
  ]));
  const directRevenue = rowByName['Direct Sales Earned Revenue'];
  const rpRevenue = rowByName['Referral Partner Earned Revenue'];
  const totalRevenue = rowByName['Total Earned Revenue'];
  const costOfRevenue = rowByName['Cost of Revenue'];
  const grossProfit = rowByName['Gross Profit'];
  const totalOperatingExpenses = rowByName['Total Operating Expenses'];
  const operatingIncome = rowByName['Operating Income'];
  const otherIncomeExpense = rowByName['Other Income and Expenses'];
  const netIncome = rowByName['Net Income'];
  const operatingExpenseRows = ['Payroll Expenses', 'Referral Partner Expenses', 'Marketing Expenses', 'Technology Expenses', 'General and Administrative Expenses']
    .map((name) => ({ id: name.replace(/\s+/g, '-').toLowerCase(), label: name, ...rowByName[name] }));
  const departmentExpenseRows = expenseByDepartment.map((item) => ({
    id: `department-${item.department}`,
    label: item.department,
    current: -Math.round(item.value / 6),
    prior: -Math.round((item.value / 6) * 0.91),
    ytd: -item.value,
    priorYtd: -Math.round(item.value * 0.88),
  }));
  const revenueChildren = revenueView === 'rp'
    ? [{ id: 'rpRevenue', label: 'RP-Related Revenue', ...rpRevenue }]
    : revenueView === 'direct'
      ? [{ id: 'directRevenue', label: 'Direct or Non-RP Sales Revenue', ...directRevenue }]
      : [
          { id: 'directRevenue', label: 'Direct or Non-RP Sales Revenue', ...directRevenue },
          { id: 'rpRevenue', label: 'RP-Related Revenue', ...rpRevenue },
        ];
  const selectedRevenue = revenueChildren.reduce((total, row) => ({
    current: total.current + row.current,
    prior: total.prior + row.prior,
    ytd: total.ytd + row.ytd,
    priorYtd: total.priorYtd + row.priorYtd,
  }), { current: 0, prior: 0, ytd: 0, priorYtd: 0 });
  const selectedExpenseChildren = expenseView === 'department' ? departmentExpenseRows : expenseView === 'category' ? operatingExpenseRows : [];
  const profitAndLossRows: ProfitAndLossRow[] = [
    { id: 'revenue', label: 'Revenue', ...selectedRevenue, children: revenueChildren },
    { id: 'costOfRevenue', label: 'Cost of Revenue', ...costOfRevenue },
    { id: 'grossProfit', label: 'Gross Profit', ...grossProfit },
    { id: 'operatingExpenses', label: 'Operating Expenses', ...totalOperatingExpenses, children: selectedExpenseChildren },
    { id: 'operatingIncome', label: 'Operating Income', ...operatingIncome },
    { id: 'otherIncomeExpense', label: 'Other Income and Expense', ...otherIncomeExpense },
    { id: 'netIncome', label: 'Net Income', ...netIncome },
  ];
  // Mock rolling 12-month P&L series until a full trailing-month finance feed is connected.
  const rollingProfitAndLoss = [
    { month: 'Jul', earnedRevenue: 345000, expenses: 326000 },
    { month: 'Aug', earnedRevenue: 372000, expenses: 334000 },
    { month: 'Sep', earnedRevenue: 388000, expenses: 341000 },
    { month: 'Oct', earnedRevenue: 421000, expenses: 352000 },
    { month: 'Nov', earnedRevenue: 455000, expenses: 368000 },
    { month: 'Dec', earnedRevenue: 498000, expenses: 386000 },
    ...monthlyFinance,
  ].map((item) => ({ ...item, netIncome: item.earnedRevenue - item.expenses }));
  const expenseSliceData = expenseView === 'department'
    ? departmentExpenseRows.map((row) => ({ name: row.label, value: Math.abs(row.ytd) }))
    : expenseView === 'category'
      ? operatingExpenseRows.map((row) => ({ name: row.label, value: Math.abs(row.ytd) }))
      : [{ name: 'Total Expenses', value: Math.abs(costOfRevenue.ytd + totalOperatingExpenses.ytd) }];
  const totalExpensesCurrent = costOfRevenue.current + totalOperatingExpenses.current;
  const totalExpensesPrior = costOfRevenue.prior + totalOperatingExpenses.prior;
  const grossMarginCurrent = grossProfit.current / totalRevenue.current;
  const grossMarginPrior = grossProfit.prior / totalRevenue.prior;
  const operatingMarginCurrent = operatingIncome.current / totalRevenue.current;
  const operatingMarginPrior = operatingIncome.prior / totalRevenue.prior;
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
      selectedPeriod={`${dateFilter} / ${periodFilter}`}
      exportContext={`Finance-statement print layout. Date: ${dateFilter}. Period: ${periodFilter}. Department: ${departmentFilter}. Revenue Source: ${revenueSourceFilter}. Revenue View: ${revenueView}. Expense View: ${expenseView}.`}
    >
      <div className="grid grid-cols-6 gap-3">
        <PowerBICard title="Total Revenue" value={formatMoney(totalRevenue.current)} variance={formatMoney(totalRevenue.current - totalRevenue.prior)} status={totalRevenue.current >= totalRevenue.prior ? 'positive' : 'negative'} subtitle="Current Period vs Prior Period" tooltip="Total financial statement revenue for the selected period." />
        <PowerBICard title="Total Expenses" value={formatMoney(totalExpensesCurrent)} variance={formatMoney(totalExpensesCurrent - totalExpensesPrior)} status={Math.abs(totalExpensesCurrent) <= Math.abs(totalExpensesPrior) ? 'positive' : 'negative'} subtitle="Cost of Revenue + Operating Expenses" tooltip="Total expenses included in operating results for the selected period." />
        <PowerBICard title="Operating Income" value={formatMoney(operatingIncome.current)} variance={formatMoney(operatingIncome.current - operatingIncome.prior)} status={operatingIncome.current >= operatingIncome.prior ? 'positive' : 'negative'} subtitle="Gross Profit less Operating Expenses" tooltip="Operating profit before other income and expense." />
        <PowerBICard title="Net Income" value={formatMoney(netIncome.current)} variance={formatMoney(netIncome.current - netIncome.prior)} status={netIncome.current >= netIncome.prior ? 'positive' : 'negative'} subtitle="Bottom-line income" tooltip="Income after operating and other income and expense." />
        <PowerBICard title="Gross Margin" value={marginFormat(grossProfit.current, totalRevenue.current)} variance={`${((grossMarginCurrent - grossMarginPrior) * 100).toFixed(1)} pts`} status={grossMarginCurrent >= grossMarginPrior ? 'positive' : 'negative'} subtitle="Gross Profit / Total Revenue" tooltip="Gross Profit divided by Total Revenue." />
        <PowerBICard title="Operating Margin" value={marginFormat(operatingIncome.current, totalRevenue.current)} variance={`${((operatingMarginCurrent - operatingMarginPrior) * 100).toFixed(1)} pts`} status={operatingMarginCurrent >= operatingMarginPrior ? 'positive' : 'negative'} subtitle="Operating Income / Total Revenue" tooltip="Operating Income divided by Total Revenue." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-4 gap-3">
          <PowerBISlicer title="Date" value={dateFilter} onChange={setDateFilter} options={[{ value: 'currentMonth', label: 'Current Month' }, { value: 'yearToDate', label: 'Year to Date' }, { value: 'trailing12', label: 'Trailing 12 Months' }]} />
          <PowerBISlicer title="Period" value={periodFilter} onChange={setPeriodFilter} options={[{ value: 'currentMonth', label: 'Current Period' }, { value: 'priorMonth', label: 'Prior Period' }, { value: 'budget', label: 'Budget' }]} />
          <PowerBISlicer title="Department" value={departmentFilter} onChange={setDepartmentFilter} options={[{ value: 'all', label: 'All Departments' }, { value: 'sales', label: 'Sales' }, { value: 'operations', label: 'Operations' }, { value: 'reporting', label: 'Reporting' }, { value: 'ga', label: 'General and Administrative' }]} />
          <PowerBISlicer title="Revenue Source" value={revenueSourceFilter} onChange={setRevenueSourceFilter} options={[{ value: 'all', label: 'All Revenue Sources' }, { value: 'direct', label: 'Direct or Non-RP Sales Revenue' }, { value: 'rp', label: 'RP-Related Revenue' }]} />
        </div>
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-2 gap-3">
          <PowerBISlicer title="Revenue View" value={revenueView} onChange={setRevenueView} options={[{ value: 'total', label: 'Total' }, { value: 'rp', label: 'RP-Related Revenue' }, { value: 'direct', label: 'Direct or Non-RP Sales Revenue' }]} />
          <PowerBISlicer title="Expense View" value={expenseView} onChange={setExpenseView} options={[{ value: 'total', label: 'Total' }, { value: 'department', label: 'Department' }, { value: 'category', label: 'Expense Category' }]} />
        </div>
      </div>
      <ProfitAndLossTable rows={profitAndLossRows} expandedRows={expandedRows} onToggle={toggleExpandedRow} />
      <div className="grid grid-cols-3 gap-3">
        <ChartCard title="Rolling 12-Month Revenue" subtitle="Trailing financial statement revenue trend" height={240}>
          <LineChart data={rollingProfitAndLoss} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="earnedRevenue" stroke="#3D654D" strokeWidth={2} name="Earned Revenue" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Rolling 12-Month Expenses" subtitle="Trailing expense trend" height={240}>
          <LineChart data={rollingProfitAndLoss} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="expenses" stroke="#D5741C" strokeWidth={2} name="Expenses" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Rolling 12-Month Net Income" subtitle="Trailing bottom-line performance" height={240}>
          <LineChart data={rollingProfitAndLoss} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="netIncome" stroke="#234E2A" strokeWidth={2} name="Net Income" />
          </LineChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Revenue Slice" subtitle="Revenue by selected view" height={240}>
          <PieChart>
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Pie data={revenueChildren.map((row) => ({ name: row.label, value: row.ytd }))} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
              {revenueChildren.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ChartCard>
        <ChartCard title="Expense Slice" subtitle="Expenses by selected view" height={240}>
          <BarChart data={expenseSliceData} margin={{ top: 5, right: 30, left: 20, bottom: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="name" tick={{ ...chartText, fontSize: 9 }} angle={-20} textAnchor="end" height={70} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="value" fill="#D5741C" name="Expenses" />
          </BarChart>
        </ChartCard>
      </div>
    </PageShell>
  );
}

export function RevenueRecognition() {
  const [recognitionPeriod, setRecognitionPeriod] = useState('monthly');
  const [stageFilter, setStageFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');
  const [referralPartnerFilter, setReferralPartnerFilter] = useState('all');
  const [reconciliationStatusFilter, setReconciliationStatusFilter] = useState('all');
  const [periodViewMode, setPeriodViewMode] = useState('chart');
  const [recognitionMetric, setRecognitionMetric] = useState<MetricMode>('dollars');
  const stageTotals = financeDeals.reduce((acc, deal) => {
    const stage = stageAmountForFinanceDeal(deal.contractValue);
    if (deal.stage1Date) {
      acc.stage1.revenue += stage;
      acc.stage1.acres += deal.acres;
      acc.stage1.contracts += 1;
    }
    if (deal.stage2Date) {
      acc.stage2.revenue += stage;
      acc.stage2.acres += deal.acres;
      acc.stage2.contracts += 1;
    }
    if (deal.stage3Date) {
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
  const filteredDeals = financeDeals.filter((deal) => {
    if (customerFilter !== 'all' && deal.dealId !== customerFilter) return false;
    if (reconciliationStatusFilter !== 'all' && deal.reconciliationStatus !== reconciliationStatusFilter) return false;
    if (referralPartnerFilter !== 'all' && deal.referralPartner !== referralPartnerFilter) return false;
    return true;
  });
  const rows = filteredDeals.map((deal) => {
    const stage = stageAmountForFinanceDeal(deal.contractValue);
    const earned = earnedForFinanceDeal(deal);
    return [deal.dealId, deal.customer, deal.contract, deal.contractValue, deal.acres, deal.stage1Date || 'Missing', deal.stage1Date ? stage : 0, deal.stage2Date || 'Missing', deal.stage2Date ? stage : 0, deal.stage3Date || 'Missing', deal.stage3Date ? stage : 0, earned, deal.glRevenue, deal.reconciliationStatus];
  });
  const totalEarnedRevenue = stageTotals.stage1.revenue + stageTotals.stage2.revenue + stageTotals.stage3.revenue;
  const recognizedContracts = financeDeals.filter((deal) => earnedForFinanceDeal(deal) > 0).length;
  const crmEarnedRevenue = financeDeals.reduce((total, deal) => total + earnedForFinanceDeal(deal), 0);
  const generalLedgerRevenue = financeDeals.reduce((total, deal) => total + deal.glRevenue, 0);
  const reconciliationVariance = generalLedgerRevenue - crmEarnedRevenue;
  const unmatchedRecords = financeDeals.filter((deal) => deal.reconciliationStatus !== 'Reconciled').length;
  const stageRows = [
    ['Signed Agreement', stageTotals.stage1.revenue, stageTotals.stage1.acres, stageTotals.stage1.contracts, `${((stageTotals.stage1.revenue / totalEarnedRevenue) * 100).toFixed(1)}%`],
    ['Soil Data Collection Complete', stageTotals.stage2.revenue, stageTotals.stage2.acres, stageTotals.stage2.contracts, `${((stageTotals.stage2.revenue / totalEarnedRevenue) * 100).toFixed(1)}%`],
    ['Report Complete', stageTotals.stage3.revenue, stageTotals.stage3.acres, stageTotals.stage3.contracts, `${((stageTotals.stage3.revenue / totalEarnedRevenue) * 100).toFixed(1)}%`],
  ];
  const visibleStageRows = stageRows.filter((row, index) => stageFilter === 'all' || stageFilter === `stage${index + 1}`);
  const periodDollarData = recognitionPeriod === 'quarterly'
    ? [
        { period: 'Q1', stage1: 594000, stage2: 409000, stage3: 185000 },
        { period: 'Q2', stage1: 629000, stage2: 474000, stage3: 404000 },
      ]
    : recognitionPeriod === 'yearly'
      ? [{ period: '2026', stage1: stageTotals.stage1.revenue, stage2: stageTotals.stage2.revenue, stage3: stageTotals.stage3.revenue }]
      : monthlyFinance.map((m) => ({ period: m.month, stage1: Math.round(m.earnedRevenue * 0.42), stage2: Math.round(m.earnedRevenue * 0.34), stage3: Math.round(m.earnedRevenue * 0.24) }));
  const periodData = periodDollarData.map((item) => {
    const scale = totalEarnedRevenue > 0 ? (item.stage1 + item.stage2 + item.stage3) / totalEarnedRevenue : 0;
    return {
      period: item.period,
      stage1Dollars: item.stage1,
      stage2Dollars: item.stage2,
      stage3Dollars: item.stage3,
      stage1Acres: Math.round(stageTotals.stage1.acres * scale),
      stage2Acres: Math.round(stageTotals.stage2.acres * scale),
      stage3Acres: Math.round(stageTotals.stage3.acres * scale),
      stage1Contracts: Math.max(0, Math.round(stageTotals.stage1.contracts * scale)),
      stage2Contracts: Math.max(0, Math.round(stageTotals.stage2.contracts * scale)),
      stage3Contracts: Math.max(0, Math.round(stageTotals.stage3.contracts * scale)),
    };
  });
  const visiblePeriodData = periodData.map((item) => ({
    period: item.period,
    stage1: stageFilter === 'all' || stageFilter === 'stage1' ? metricValue(recognitionMetric, item.stage1Dollars, item.stage1Acres, item.stage1Contracts) : 0,
    stage2: stageFilter === 'all' || stageFilter === 'stage2' ? metricValue(recognitionMetric, item.stage2Dollars, item.stage2Acres, item.stage2Contracts) : 0,
    stage3: stageFilter === 'all' || stageFilter === 'stage3' ? metricValue(recognitionMetric, item.stage3Dollars, item.stage3Acres, item.stage3Contracts) : 0,
  }));
  const periodRows = visiblePeriodData.map((item) => [item.period, item.stage1, item.stage2, item.stage3, item.stage1 + item.stage2 + item.stage3]);
  const currentPeriodEarnedRevenue = monthlyFinance[monthlyFinance.length - 1].earnedRevenue;
  const priorPeriodEarnedRevenue = Math.round(currentPeriodEarnedRevenue * 0.88);
  const periodVariance = currentPeriodEarnedRevenue - priorPeriodEarnedRevenue;
  const currentPeriodAcres = Math.round(financeSummary.earnedAcres / 6);
  const priorPeriodAcres = Math.round(currentPeriodAcres * 0.9);
  const currentPeriodContracts = Math.max(1, Math.round(recognizedContracts / 6));
  const priorPeriodContracts = Math.max(1, currentPeriodContracts - 1);
  const currentPeriodMetric = metricValue(recognitionMetric, currentPeriodEarnedRevenue, currentPeriodAcres, currentPeriodContracts);
  const priorPeriodMetric = metricValue(recognitionMetric, priorPeriodEarnedRevenue, priorPeriodAcres, priorPeriodContracts);
  const periodMetricVariance = currentPeriodMetric - priorPeriodMetric;
  const auditIndicators = [
    ['Missing Stage Date', financeDeals.filter((deal) => !deal.stage1Date || !deal.stage2Date || !deal.stage3Date).length, 98000, 'New'],
    ['Duplicate Stage Event', 0, 0, 'Clear'],
    ['Stage Reversal', exceptions.filter((item) => String(item[3]).includes('backward')).length, 210000, 'New'],
    ['GL Mismatch', financeDeals.filter((deal) => deal.glRevenue !== earnedForFinanceDeal(deal)).length, Math.abs(reconciliationVariance), 'New'],
    ['Incomplete Source Data', exceptions.filter((item) => String(item[3]).includes('Missing') || String(item[3]).includes('missing')).length, 0, 'Review Required'],
  ];

  return (
    <PageShell
      title="Revenue Recognition"
      selectedPeriod={recognitionPeriod}
      exportContext={`Earned Revenue audit report. Recognition Period: ${recognitionPeriod}. Stage: ${stageFilter}. Customer: ${customerFilter}. Department: ${departmentFilter}. Salesperson: ${salespersonFilter}. Referral Partner: ${referralPartnerFilter}. Reconciliation Status: ${reconciliationStatusFilter}. Metric: ${recognitionMetric}.`}
    >
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Total Earned Revenue" value={formatMoney(totalEarnedRevenue)} variance={formatMoney(reconciliationVariance)} status={reconciliationVariance === 0 ? 'positive' : 'negative'} subtitle={`${formatAcres(financeSummary.earnedAcres)} Acres | ${formatCount(recognizedContracts)} Contracts`} tooltip="Total GAAP Earned Revenue recognized through the three approved stages." />
        <PowerBICard title="Stage 1 Earned Revenue" value={formatMoney(stageTotals.stage1.revenue)} subtitle={`${formatAcres(stageTotals.stage1.acres)} Acres | ${formatCount(stageTotals.stage1.contracts)} Contracts`} tooltip="Earned Revenue recognized when Signed Agreement is complete." />
        <PowerBICard title="Stage 2 Earned Revenue" value={formatMoney(stageTotals.stage2.revenue)} subtitle={`${formatAcres(stageTotals.stage2.acres)} Acres | ${formatCount(stageTotals.stage2.contracts)} Contracts`} tooltip="Earned Revenue recognized when Soil Data Collection Complete is recorded." />
        <PowerBICard title="Stage 3 Earned Revenue" value={formatMoney(stageTotals.stage3.revenue)} subtitle={`${formatAcres(stageTotals.stage3.acres)} Acres | ${formatCount(stageTotals.stage3.contracts)} Contracts`} tooltip="Earned Revenue recognized when Report Complete is recorded." />
        <PowerBICard title="Recognized Acres" value={formatAcres(financeSummary.earnedAcres)} subtitle="Whole Acres tied to recognized stages" tooltip="Acres associated with recognized Earned Revenue events." />
        <PowerBICard title="Recognized Contracts" value={recognizedContracts} subtitle="Contracts with Earned Revenue" tooltip="Contracts with at least one recognized Earned Revenue stage." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-4 gap-3">
          <PowerBISlicer title="Recognition Period" value={recognitionPeriod} onChange={setRecognitionPeriod} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'yearly', label: 'Yearly' }]} />
          <PowerBISlicer title="Stage" value={stageFilter} onChange={setStageFilter} options={[{ value: 'all', label: 'All Stages' }, { value: 'stage1', label: 'Signed Agreement' }, { value: 'stage2', label: 'Soil Data Collection Complete' }, { value: 'stage3', label: 'Report Complete' }]} />
          <PowerBISlicer title="Customer" value={customerFilter} onChange={setCustomerFilter} options={[{ value: 'all', label: 'All Customers' }, ...financeDeals.map((deal) => ({ value: deal.dealId, label: deal.customer }))]} />
          <PowerBISlicer title="Department" value={departmentFilter} onChange={setDepartmentFilter} options={[{ value: 'all', label: 'All Departments' }, { value: 'finance', label: 'Finance' }, { value: 'revenueOps', label: 'Revenue Ops' }, { value: 'reporting', label: 'Reporting' }]} />
          <PowerBISlicer title="Salesperson" value={salespersonFilter} onChange={setSalespersonFilter} options={[{ value: 'all', label: 'All Salespeople' }, { value: 'direct', label: 'Direct' }, { value: 'sarahKeller', label: 'Sarah Keller' }, { value: 'marcusLee', label: 'Marcus Lee' }, { value: 'ninaPatel', label: 'Nina Patel' }]} />
          <PowerBISlicer title="Referral Partner" value={referralPartnerFilter} onChange={setReferralPartnerFilter} options={[{ value: 'all', label: 'All Referral Partners' }, { value: 'Prairie Growth Advisors', label: 'Prairie Growth Advisors' }, { value: 'Harvest Ridge Partners', label: 'Harvest Ridge Partners' }, { value: 'Dakota Land Network', label: 'Dakota Land Network' }, { value: 'None', label: 'None' }]} />
          <PowerBISlicer title="Reconciliation Status" value={reconciliationStatusFilter} onChange={setReconciliationStatusFilter} options={[{ value: 'all', label: 'All Statuses' }, { value: 'Reconciled', label: 'Reconciled' }, { value: 'Review Required', label: 'Review Required' }, { value: 'Missing Data', label: 'Missing Data' }, { value: 'Material Variance', label: 'Material Variance' }]} />
          <PowerBISlicer title="View" value={periodViewMode} onChange={setPeriodViewMode} options={[{ value: 'chart', label: 'Chart' }, { value: 'table', label: 'Table' }]} />
          <PowerBISlicer title="Metric" value={recognitionMetric} onChange={(value) => setRecognitionMetric(value as MetricMode)} options={[{ value: 'dollars', label: 'Dollars' }, { value: 'acres', label: 'Acres' }, { value: 'contracts', label: 'Contracts' }]} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {periodViewMode === 'chart' ? (
          <ChartCard title="Earned Revenue by Stage and Period" subtitle={`${recognitionPeriod} view by ${metricLabel(recognitionMetric).toLowerCase()} and approved stage`}>
            <BarChart data={visiblePeriodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="period" tick={chartText} />
              <YAxis tick={chartText} tickFormatter={metricAxis(recognitionMetric)} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={metricTip(recognitionMetric)} />
              <Legend wrapperStyle={chartText} />
              {(stageFilter === 'all' || stageFilter === 'stage1') && <Bar dataKey="stage1" stackId="stage" fill="#234E2A" name="Signed Agreement" />}
              {(stageFilter === 'all' || stageFilter === 'stage2') && <Bar dataKey="stage2" stackId="stage" fill="#358540" name="Soil Data Collection Complete" />}
              {(stageFilter === 'all' || stageFilter === 'stage3') && <Bar dataKey="stage3" stackId="stage" fill="#56708F" name="Report Complete" />}
            </BarChart>
          </ChartCard>
        ) : (
          <FinanceTable columns={['Period', `Signed Agreement ${metricLabel(recognitionMetric)}`, `Soil Data Collection Complete ${metricLabel(recognitionMetric)}`, `Report Complete ${metricLabel(recognitionMetric)}`, `Total ${metricLabel(recognitionMetric)}`]} rows={periodRows} />
        )}
        <FinanceTable columns={['Earned Revenue Stage', 'Revenue', 'Acres', 'Contract Count', '% of Total']} rows={visibleStageRows} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable columns={['Period Comparison', metricLabel(recognitionMetric)]} rows={[
          [`Current Period ${metricLabel(recognitionMetric)}`, currentPeriodMetric],
          [`Prior Period ${metricLabel(recognitionMetric)}`, priorPeriodMetric],
          [`${metricLabel(recognitionMetric)} Variance`, periodMetricVariance],
          ['Percent Variance', `${((periodMetricVariance / Math.max(Math.abs(priorPeriodMetric), 1)) * 100).toFixed(1)}%`],
        ]} />
        <ChartCard title="Operational Earned Revenue vs. General Ledger Revenue" subtitle="Reconciliation variance by deal">
          <BarChart data={filteredDeals.map((deal) => ({ dealId: deal.dealId, operational: earnedForFinanceDeal(deal), gl: deal.glRevenue }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="dealId" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="operational" fill="#234E2A" name="CRM or Operational Earned Revenue" />
            <Bar dataKey="gl" fill="#56708F" name="General-Ledger Revenue" />
          </BarChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable columns={['Reconciliation Summary', 'Value']} rows={[
          ['CRM or Operational Earned Revenue', crmEarnedRevenue],
          ['General-Ledger Revenue', generalLedgerRevenue],
          ['Variance', reconciliationVariance],
          ['Unmatched Records', unmatchedRecords],
          ['Last Reconciliation Date', '2026-06-30'],
        ]} />
        <FinanceTable columns={['Audit Indicator', 'Records', 'Financial Exposure', 'Status']} rows={auditIndicators} />
      </div>
      <FinanceTable columns={['Deal or Project', 'Customer', 'Contract', 'Total Contract Value', 'Acres', 'Signed Agreement Date', 'Signed Agreement Amount', 'Soil Data Collection Complete Date', 'Soil Data Collection Complete Amount', 'Report Complete Date', 'Report Complete Amount', 'Total Earned Revenue', 'General-Ledger Amount', 'Reconciliation Status']} rows={rows} />
    </PageShell>
  );
}

export function BalanceSheet() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['assets', 'currentAssets', 'liabilities', 'currentLiabilities', 'equity']));
  const currentAssets = balanceSheetStatement.current.cash + balanceSheetStatement.current.accountsReceivable + balanceSheetStatement.current.otherCurrentAssets;
  const priorCurrentAssets = balanceSheetStatement.prior.cash + balanceSheetStatement.prior.accountsReceivable + balanceSheetStatement.prior.otherCurrentAssets;
  const totalAssets = currentAssets + balanceSheetStatement.current.longTermAssets;
  const priorTotalAssets = priorCurrentAssets + balanceSheetStatement.prior.longTermAssets;
  const currentLiabilities = balanceSheetStatement.current.accountsPayable + balanceSheetStatement.current.accruedLiabilities;
  const priorCurrentLiabilities = balanceSheetStatement.prior.accountsPayable + balanceSheetStatement.prior.accruedLiabilities;
  const totalLiabilities = currentLiabilities + balanceSheetStatement.current.longTermLiabilities;
  const priorTotalLiabilities = priorCurrentLiabilities + balanceSheetStatement.prior.longTermLiabilities;
  const totalEquity = balanceSheetStatement.current.contributedCapital + balanceSheetStatement.current.retainedEarnings + balanceSheetStatement.current.currentPeriodEarnings;
  const priorTotalEquity = balanceSheetStatement.prior.contributedCapital + balanceSheetStatement.prior.retainedEarnings + balanceSheetStatement.prior.currentPeriodEarnings;
  const workingCapital = currentAssets - currentLiabilities;
  const priorWorkingCapital = priorCurrentAssets - priorCurrentLiabilities;
  const currentRatio = currentAssets / currentLiabilities;
  const priorCurrentRatio = priorCurrentAssets / priorCurrentLiabilities;
  const overdueAr = arApAging.filter((item) => item.bucket !== 'Current').reduce((total, item) => total + item.ar, 0);
  const upcomingAp = arApAging.slice(0, 2).reduce((total, item) => total + item.ap, 0);
  const netWorkingCapitalImpact = balanceSheetStatement.current.accountsReceivable - balanceSheetStatement.current.accountsPayable;
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
            { id: 'cash', label: 'Cash and Cash Equivalents', current: balanceSheetStatement.current.cash, prior: balanceSheetStatement.prior.cash },
            { id: 'accountsReceivable', label: 'Accounts Receivable', current: balanceSheetStatement.current.accountsReceivable, prior: balanceSheetStatement.prior.accountsReceivable },
            { id: 'otherCurrentAssets', label: 'Other Current Assets', current: balanceSheetStatement.current.otherCurrentAssets, prior: balanceSheetStatement.prior.otherCurrentAssets },
          ],
        },
        { id: 'longTermAssets', label: 'Long-Term Assets', current: balanceSheetStatement.current.longTermAssets, prior: balanceSheetStatement.prior.longTermAssets },
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
            { id: 'accountsPayable', label: 'Accounts Payable', current: balanceSheetStatement.current.accountsPayable, prior: balanceSheetStatement.prior.accountsPayable },
            { id: 'accruedLiabilities', label: 'Accrued Liabilities', current: balanceSheetStatement.current.accruedLiabilities, prior: balanceSheetStatement.prior.accruedLiabilities },
          ],
        },
        { id: 'longTermLiabilities', label: 'Long-Term Liabilities', current: balanceSheetStatement.current.longTermLiabilities, prior: balanceSheetStatement.prior.longTermLiabilities },
      ],
    },
    {
      id: 'equity',
      label: 'Equity',
      current: totalEquity,
      prior: priorTotalEquity,
      children: [
        { id: 'contributedCapital', label: 'Contributed Capital', current: balanceSheetStatement.current.contributedCapital, prior: balanceSheetStatement.prior.contributedCapital },
        { id: 'retainedEarnings', label: 'Retained Earnings', current: balanceSheetStatement.current.retainedEarnings, prior: balanceSheetStatement.prior.retainedEarnings },
        { id: 'currentPeriodEarnings', label: 'Current Period Earnings', current: balanceSheetStatement.current.currentPeriodEarnings, prior: balanceSheetStatement.prior.currentPeriodEarnings },
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
      selectedPeriod="Current Period"
      exportContext="Finance-statement print layout. Includes hierarchical balance sheet, AR/AP relationship, balance trends, working capital trend, and Assets = Liabilities + Equity validation."
    >
      <div className="grid grid-cols-6 gap-3">
        <PowerBICard title="Total Assets" value={formatMoney(totalAssets)} variance={formatMoney(totalAssets - priorTotalAssets)} status={totalAssets >= priorTotalAssets ? 'positive' : 'negative'} subtitle="Current Period" tooltip="Total current and long-term assets." />
        <PowerBICard title="Total Liabilities" value={formatMoney(totalLiabilities)} variance={formatMoney(totalLiabilities - priorTotalLiabilities)} status={totalLiabilities <= priorTotalLiabilities ? 'positive' : 'negative'} subtitle="Current Period" tooltip="Total current and long-term liabilities." />
        <PowerBICard title="Total Equity" value={formatMoney(totalEquity)} variance={formatMoney(totalEquity - priorTotalEquity)} status={totalEquity >= priorTotalEquity ? 'positive' : 'negative'} subtitle="Current Period" tooltip="Contributed capital, retained earnings, and current period earnings." />
        <PowerBICard title="Working Capital" value={formatMoney(workingCapital)} variance={formatMoney(workingCapital - priorWorkingCapital)} status={workingCapital >= priorWorkingCapital ? 'positive' : 'negative'} subtitle="Current Assets less Current Liabilities" tooltip="Current assets minus current liabilities." />
        <PowerBICard title="Current Ratio" value={currentRatio.toFixed(2)} variance={`${(currentRatio - priorCurrentRatio).toFixed(2)}`} status={currentRatio >= priorCurrentRatio ? 'positive' : 'negative'} subtitle="Current Assets / Current Liabilities" tooltip="Liquidity ratio comparing current assets to current liabilities." />
        <PowerBICard title="Cash Balance" value={formatMoney(balanceSheetStatement.current.cash)} variance={formatMoney(balanceSheetStatement.current.cash - balanceSheetStatement.prior.cash)} status={balanceSheetStatement.current.cash >= balanceSheetStatement.prior.cash ? 'positive' : 'negative'} subtitle="Cash and Cash Equivalents" tooltip="Cash and cash equivalents at period end." />
      </div>
      <BalanceSheetStatementTable rows={rows} expandedRows={expandedRows} onToggle={toggleExpandedRow} />
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable columns={['AR and AP Relationship', 'Amount']} rows={[
          ['Total AR', balanceSheetStatement.current.accountsReceivable],
          ['Total AP', balanceSheetStatement.current.accountsPayable],
          ['Net Working-Capital Impact', netWorkingCapitalImpact],
          ['Overdue Amount', overdueAr],
          ['Upcoming Obligations', upcomingAp],
        ]} />
        <ChartCard title="Aging Status" subtitle="AR and AP aging by days outstanding">
          <BarChart data={arApAging}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="bucket" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="ar" fill="#234E2A" name="Accounts Receivable" />
            <Bar dataKey="ap" fill="#56708F" name="Accounts Payable" />
          </BarChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Assets, Liabilities, and Equity Over Time" subtitle="Monthly balance sheet trend">
          <LineChart data={balanceSheetTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Line type="monotone" dataKey="assets" stroke="#234E2A" strokeWidth={2} name="Assets" />
            <Line type="monotone" dataKey="liabilities" stroke="#D5741C" strokeWidth={2} name="Liabilities" />
            <Line type="monotone" dataKey="equity" stroke="#56708F" strokeWidth={2} name="Equity" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Working Capital Over Time" subtitle="Current Assets less Current Liabilities">
          <LineChart data={balanceSheetTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="workingCapital" stroke="#3D654D" strokeWidth={2} name="Working Capital" />
          </LineChart>
        </ChartCard>
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="flex items-center justify-between text-sm" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          <span className="font-semibold text-[#006637]">Balance Check</span>
          <span className={balanceDifference === 0 ? 'font-semibold text-[#2F7641]' : 'font-semibold text-[#A33C1B]'}>
            Assets {formatMoney(totalAssets)} = Liabilities + Equity {formatMoney(totalLiabilities + totalEquity)}
          </span>
          <StatusBadge tone={balanceDifference === 0 ? 'green' : 'orange'}>{balanceDifference === 0 ? 'Balanced' : `Out of Balance ${formatMoney(balanceDifference)}`}</StatusBadge>
        </div>
      </div>
    </PageShell>
  );
}

export function CashFlow() {
  const [dateFilter, setDateFilter] = useState('yearToDate');
  const [monthFilter, setMonthFilter] = useState('all');
  const [quarterFilter, setQuarterFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2026');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [cashFlowCategoryFilter, setCashFlowCategoryFilter] = useState('all');
  const beginningCash = 1410000;
  const operatingCashFlow = 430000;
  const investingCashFlow = -120000;
  const financingCashFlow = 120000;
  const freeCashFlow = operatingCashFlow + investingCashFlow;
  const netChangeInCash = operatingCashFlow + investingCashFlow + financingCashFlow;
  const endingCash = beginningCash + netChangeInCash;
  const varianceRows = cashFlowVariance.map(([category, actual, forecast]) => {
    const variance = Number(actual) - Number(forecast);
    const variancePercent = (variance / Math.max(Math.abs(Number(forecast)), 1)) * 100;
    return [category, Number(actual), Number(forecast), variance, percentFormat(variancePercent)];
  });

  return (
    <PageShell
      title="Cash Flow"
      selectedPeriod={`${dateFilter} / ${monthFilter} / ${quarterFilter} / ${yearFilter}`}
      exportContext={`Finance-statement print layout. Date: ${dateFilter}. Month: ${monthFilter}. Quarter: ${quarterFilter}. Year: ${yearFilter}. Department: ${departmentFilter}. Cash-Flow Category: ${cashFlowCategoryFilter}.`}
    >
      <div className="grid grid-cols-6 gap-3">
        <PowerBICard title="Beginning Cash" value={formatMoney(beginningCash)} variance="Actual" status="neutral" subtitle="Start of period" tooltip="Cash and cash equivalents at the start of the selected period." />
        <PowerBICard title="Operating Cash Flow" value={formatMoney(operatingCashFlow)} variance="+$35K vs forecast" status="positive" subtitle="Operating Activities" tooltip="Cash generated from operating activities." />
        <PowerBICard title="Investing Cash Flow" value={formatMoney(investingCashFlow)} variance="($25K) vs forecast" status="negative" subtitle="Investing Activities" tooltip="Cash used for investing activity, including capital expenditures." />
        <PowerBICard title="Financing Cash Flow" value={formatMoney(financingCashFlow)} variance="+$20K vs forecast" status="positive" subtitle="Financing Activities" tooltip="Cash generated from or used by financing activity." />
        <PowerBICard title="Free Cash Flow" value={formatMoney(freeCashFlow)} variance="+$10K vs forecast" status="positive" subtitle="Operating Cash Flow + Investing Cash Flow" tooltip="Operating cash flow after investing activity." />
        <PowerBICard title="Ending Cash" value={formatMoney(endingCash)} variance="+$45K vs forecast" status="positive" subtitle="Beginning Cash + Net Change" tooltip="Cash and cash equivalents at the end of the selected period." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-3 gap-3">
          <PowerBISlicer title="Date" value={dateFilter} onChange={setDateFilter} options={[{ value: 'currentMonth', label: 'Current Month' }, { value: 'yearToDate', label: 'Year to Date' }, { value: 'trailing12', label: 'Trailing 12 Months' }]} />
          <PowerBISlicer title="Month" value={monthFilter} onChange={setMonthFilter} options={[{ value: 'all', label: 'All Months' }, { value: 'jan', label: 'January' }, { value: 'feb', label: 'February' }, { value: 'mar', label: 'March' }, { value: 'apr', label: 'April' }, { value: 'may', label: 'May' }, { value: 'jun', label: 'June' }]} />
          <PowerBISlicer title="Quarter" value={quarterFilter} onChange={setQuarterFilter} options={[{ value: 'all', label: 'All Quarters' }, { value: 'q1', label: 'Q1' }, { value: 'q2', label: 'Q2' }, { value: 'q3', label: 'Q3' }, { value: 'q4', label: 'Q4' }]} />
          <PowerBISlicer title="Year" value={yearFilter} onChange={setYearFilter} options={[{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }]} />
          <PowerBISlicer title="Department" value={departmentFilter} onChange={setDepartmentFilter} options={[{ value: 'all', label: 'All Departments' }, { value: 'sales', label: 'Sales' }, { value: 'operations', label: 'Operations' }, { value: 'reporting', label: 'Reporting' }, { value: 'ga', label: 'General and Administrative' }]} />
          <PowerBISlicer title="Cash-Flow Category" value={cashFlowCategoryFilter} onChange={setCashFlowCategoryFilter} options={[{ value: 'all', label: 'All Categories' }, { value: 'operating', label: 'Operating Activities' }, { value: 'investing', label: 'Investing Activities' }, { value: 'financing', label: 'Financing Activities' }]} />
        </div>
      </div>
      <FinanceTable columns={['Cash Flow Statement', 'Actual Amount']} rows={cashFlowStatementRows} />
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable columns={['Cash Flow Outlook', 'Forecast Amount']} rows={cashFlowOutlookDetail} />
        <FinanceTable columns={['Variance View', 'Actual', 'Forecast', 'Variance', 'Variance Percent']} rows={varianceRows} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <ChartCard title="Monthly Operating Cash Flow" subtitle="Actuals compared with forecast" height={240}>
          <LineChart data={monthlyCashFlowTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Line type="monotone" dataKey="operatingCashFlow" stroke="#234E2A" strokeWidth={2} name="Actual Operating Cash Flow" />
            <Line type="monotone" dataKey="forecastOperatingCashFlow" stroke="#56708F" strokeWidth={2} strokeDasharray="4 4" name="Forecast Operating Cash Flow" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Monthly Free Cash Flow" subtitle="Operating Cash Flow plus Investing Cash Flow" height={240}>
          <LineChart data={monthlyCashFlowTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="freeCashFlow" stroke="#3D654D" strokeWidth={2} name="Free Cash Flow" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Ending Cash Balance Over Time" subtitle="Actuals distinguished from forecast" height={240}>
          <LineChart data={monthlyCashFlowTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Line type="monotone" dataKey="endingCash" stroke="#234E2A" strokeWidth={2} name="Actual Ending Cash" />
            <Line type="monotone" dataKey="forecastEndingCash" stroke="#56708F" strokeWidth={2} strokeDasharray="4 4" name="Forecast Ending Cash" />
          </LineChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Operating, Investing, and Financing Cash Flow" subtitle="Actual cash movement by activity type">
          <BarChart data={monthlyCashFlowTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="operatingCashFlow" fill="#234E2A" name="Operating Activities" />
            <Bar dataKey="investingCashFlow" fill="#D5741C" name="Investing Activities" />
            <Bar dataKey="financingCashFlow" fill="#56708F" name="Financing Activities" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Cash Flow Outlook Detail" subtitle="Forecast inflows and outflows by near-term category">
          <BarChart data={cashFlowOutlookDetail.map(([category, amount]) => ({ category, amount }))} margin={{ top: 5, right: 30, left: 20, bottom: 65 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="category" tick={{ ...chartText, fontSize: 9 }} angle={-25} textAnchor="end" height={80} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="amount" fill="#358540" name="Forecast Amount" />
          </BarChart>
        </ChartCard>
      </div>
    </PageShell>
  );
}

export function ExceptionReporting() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('unresolved');
  const [exceptionTypeFilter, setExceptionTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [exceptionImpactMetric, setExceptionImpactMetric] = useState<MetricMode>('dollars');
  const filteredExceptions = controlExceptions.filter((item) => {
    if (severityFilter !== 'all' && item.severity !== severityFilter) return false;
    if (statusFilter === 'resolved' && item.status !== 'Resolved') return false;
    if (statusFilter === 'unresolved' && ['Resolved', 'Accepted Exception'].includes(item.status)) return false;
    if (statusFilter !== 'all' && !['resolved', 'unresolved'].includes(statusFilter) && item.status !== statusFilter) return false;
    if (exceptionTypeFilter !== 'all' && item.exceptionType !== exceptionTypeFilter) return false;
    if (dateFilter !== 'all' && item.detectedDate.slice(0, 7) !== dateFilter) return false;
    return true;
  });
  const unresolvedExceptions = controlExceptions.filter((item) => !['Resolved', 'Accepted Exception'].includes(item.status));
  const criticalExceptions = filteredExceptions.filter((item) => item.severity === 'Critical');
  const revenueAtRisk = filteredExceptions.filter((item) => item.status !== 'Resolved').reduce((total, item) => total + item.revenueImpact, 0);
  const acresAtRisk = filteredExceptions.filter((item) => item.status !== 'Resolved').reduce((total, item) => total + item.acresImpact, 0);
  const backwardStageMovements = filteredExceptions.filter((item) => item.exceptionType === 'Backward stage movement').length;
  const missingStageDates = filteredExceptions.filter((item) => item.exceptionType === 'Missing revenue-recognition dates').length;
  const glMismatches = filteredExceptions.filter((item) => item.exceptionType === 'CRM-to-General-Ledger mismatch').length;
  const exceptionTypeOptions = Array.from(new Set(controlExceptions.map((item) => item.exceptionType))).map((type) => ({ value: type, label: type }));
  const severityData = ['Critical', 'High', 'Medium', 'Low'].map((severity) => ({
    severity,
    count: filteredExceptions.filter((item) => item.severity === severity).length,
  }));
  const typeImpactData = exceptionTypeOptions.map((option) => ({
    type: option.label,
    impact: filteredExceptions
      .filter((item) => item.exceptionType === option.value)
      .reduce((total, item) => total + metricValue(exceptionImpactMetric, item.revenueImpact, item.acresImpact, 1), 0),
  }));
  const tableColumns = ['Exception Type', 'Severity', 'Deal or Project', 'Customer', 'Affected Stage', 'Affected Period', 'Revenue Impact', 'Acres Impact', 'Source System', 'Detected Date', 'Owner', 'Status', 'Resolution Notes'];
  return (
    <PageShell
      title="Exception Reporting"
      selectedPeriod={dateFilter === 'all' ? 'All Dates' : dateFilter}
      exportContext={`Active filters: Severity=${severityFilter}; Status=${statusFilter}; Exception Type=${exceptionTypeFilter}; Detected Date=${dateFilter}; Impact Metric=${exceptionImpactMetric}. Exception status population: New=${controlExceptions.filter((item) => item.status === 'New').length}; Investigating=${controlExceptions.filter((item) => item.status === 'Investigating').length}; Resolved=${controlExceptions.filter((item) => item.status === 'Resolved').length}; Accepted Exception=${controlExceptions.filter((item) => item.status === 'Accepted Exception').length}. Filtered exceptions: ${filteredExceptions.length}.`}
    >
      <div className="grid grid-cols-6 gap-3">
        <PowerBICard title="Total Open Exceptions" value={unresolvedExceptions.length} variance={`${filteredExceptions.length} shown`} status={unresolvedExceptions.length > 0 ? 'negative' : 'positive'} subtitle="New or investigating" tooltip="Open finance and revenue-recognition control exceptions." />
        <PowerBICard title="Critical Exceptions" value={criticalExceptions.length} variance="Immediate review" status={criticalExceptions.length > 0 ? 'negative' : 'positive'} subtitle="Severity = Critical" tooltip="Exceptions with potential financial statement impact." />
        <PowerBICard title="Revenue at Risk" value={formatMoney(revenueAtRisk)} variance="Unresolved exposure" status={revenueAtRisk > 0 ? 'negative' : 'positive'} subtitle={`${formatAcres(acresAtRisk)} Acres impacted`} tooltip="Revenue impact tied to unresolved exceptions." />
        <PowerBICard title="Deals Moved Backward" value={backwardStageMovements} subtitle="Backward stage movement" status={backwardStageMovements > 0 ? 'negative' : 'positive'} tooltip="Deals where a stage moved backward after recognition or operational completion." />
        <PowerBICard title="Missing Stage Dates" value={missingStageDates} subtitle="Recognition date gaps" status={missingStageDates > 0 ? 'negative' : 'positive'} tooltip="Missing signed-agreement, soil-completion, or report-complete dates." />
        <PowerBICard title="GL Mismatches" value={glMismatches} subtitle="CRM-to-General-Ledger mismatch" status={glMismatches > 0 ? 'negative' : 'positive'} tooltip="Operational Earned Revenue not matching general-ledger revenue." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>Control Alert State</div>
          <StatusBadge tone={criticalExceptions.length > 0 ? 'orange' : 'green'}>{criticalExceptions.length > 0 ? `${criticalExceptions.length} Critical Alert${criticalExceptions.length === 1 ? '' : 's'}` : 'No Critical Alerts'}</StatusBadge>
        </div>
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-4 gap-3">
          <PowerBISlicer title="Severity" value={severityFilter} onChange={setSeverityFilter} options={[{ value: 'all', label: 'All Severities' }, { value: 'Critical', label: 'Critical' }, { value: 'High', label: 'High' }, { value: 'Medium', label: 'Medium' }, { value: 'Low', label: 'Low' }]} />
          <PowerBISlicer title="Status" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'unresolved', label: 'Unresolved' }, { value: 'resolved', label: 'Resolved' }, { value: 'all', label: 'All Statuses' }, { value: 'New', label: 'New' }, { value: 'Investigating', label: 'Investigating' }, { value: 'Resolved', label: 'Resolved' }, { value: 'Accepted Exception', label: 'Accepted Exception' }]} />
          <PowerBISlicer title="Exception Type" value={exceptionTypeFilter} onChange={setExceptionTypeFilter} options={[{ value: 'all', label: 'All Exception Types' }, ...exceptionTypeOptions]} />
          <PowerBISlicer title="Detected Date" value={dateFilter} onChange={setDateFilter} options={[{ value: 'all', label: 'All Dates' }, { value: '2026-06', label: 'June 2026' }, { value: '2026-05', label: 'May 2026' }, { value: '2026-04', label: 'April 2026' }, { value: '2026-03', label: 'March 2026' }]} />
          <PowerBISlicer title="Impact Metric" value={exceptionImpactMetric} onChange={(value) => setExceptionImpactMetric(value as MetricMode)} options={[{ value: 'dollars', label: 'Dollars' }, { value: 'acres', label: 'Acres' }, { value: 'contracts', label: 'Contracts' }]} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Exceptions by Severity" subtitle="Current exception population">
          <BarChart data={severityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="severity" tick={chartText} />
            <YAxis tick={chartText} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
            <Bar dataKey="count" fill="#A33C1B" name="Exceptions" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Exception Impact by Type" subtitle={`Potential impact by ${metricLabel(exceptionImpactMetric).toLowerCase()}`}>
          <BarChart data={typeImpactData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="type" tick={{ ...chartText, fontSize: 9 }} angle={-25} textAnchor="end" height={90} />
            <YAxis tick={chartText} tickFormatter={metricAxis(exceptionImpactMetric)} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={metricTip(exceptionImpactMetric)} />
            <Bar dataKey="impact" fill="#D5741C" name={`${metricLabel(exceptionImpactMetric)} Impact`} />
          </BarChart>
        </ChartCard>
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>Exception Detail</div>
          <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{filteredExceptions.length} filtered records</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <thead>
              <tr className="border-b border-[#CFD5D0]">
                {tableColumns.map((column) => (
                  <th key={column} className="text-left text-[#006637] font-semibold py-2 pr-3 whitespace-nowrap">{column}</th>
                ))}
                <th className="text-left text-[#006637] font-semibold py-2 pr-3 whitespace-nowrap">Drilldown</th>
              </tr>
            </thead>
            <tbody>
              {filteredExceptions.map((item) => (
                <tr key={item.id} className="border-b border-[#E6EEE7] last:border-0">
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{item.exceptionType}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">{renderCell(item.severity)}</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{item.dealOrProject}</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{item.customer}</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{item.affectedStage}</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{item.affectedPeriod}</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{formatMoney(item.revenueImpact)}</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{formatAcres(item.acresImpact)} Acres</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{item.sourceSystem}</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{item.detectedDate}</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{item.owner}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">{renderCell(item.status)}</td>
                  <td className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">{item.resolutionNotes}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold bg-[#E6EEE7] text-[#006637]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Drillthrough Page</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
