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
  cashFlowOutlook,
  cashFlowStatementRows,
  controlExceptions,
  earnedForFinanceDeal,
  executiveTrend,
  expenseByDepartment,
  exceptions,
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
function ChartCard({ title, subtitle, height = 220, children }: { title: string; subtitle: string; height?: number; children: React.ReactNode }) {
  return (
    <div className="print-section bg-white border border-[#CFD5D0] p-3">
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

function DetailCandidate({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="print-section bg-white border border-[#CFD5D0] p-3">
      <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>{title}</div>
      <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{subtitle}</div>
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

export function ExecutiveSnapshot() {
  const [processMetric, setProcessMetric] = useState<MetricMode>('dollars');
  const [topListView, setTopListView] = useState<'customers' | 'vendors'>('customers');
  const currentPeriodLabel = 'YTD 2026';
  const totalVendorSpend = vendors.reduce((total, [, spend]) => total + Number(spend), 0);
  const topCustomers = financeDeals
    .map((deal) => [deal.customer, deal.contractValue] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([customer, value], index) => [index + 1, customer, value, `${((value / financeSummary.bookedSales) * 100).toFixed(1)}%`]);
  const topVendors = vendors
    .map(([vendor, spend]) => [vendor, Number(spend)] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([vendor, spend], index) => [index + 1, vendor, spend, `${((spend / totalVendorSpend) * 100).toFixed(1)}%`]);
  const topTable = topListView === 'customers'
    ? { title: 'Top 10 Customers', columns: ['Rank', 'Customer', 'Amount', '% of Total'], rows: topCustomers }
    : { title: 'Top 10 Vendors', columns: ['Rank', 'Vendor', 'Amount', '% of Total'], rows: topVendors };
  const processComparison = [
    ['Booked Sales', financeSummary.bookedSales, financeSummary.bookedAcres, financeDeals.length],
    ['Earned Revenue', financeSummary.earnedRevenue, financeSummary.earnedAcres, financeDeals.filter((deal) => earnedForFinanceDeal(deal) > 0).length],
    ['Final Sales', financeSummary.finalSales, financeSummary.finalAcres, financeDeals.filter((deal) => deal.finalSales > 0).length],
  ];
  const processChartData = processComparison.map(([metric, dollars, acres, contracts]) => ({
    metric,
    value: metricValue(processMetric, Number(dollars), Number(acres), Number(contracts)),
  }));
  const cashOutlookRows = [
    ['Current Cash', financeSummary.cashBalance],
    ['Expected Customer Collections', 735000],
    ['Expected Near-Term Payments', -685000],
    ['Projected Cash', 1890000],
  ];
  const arApRows = [
    ['Total AR', financeSummary.accountsReceivable],
    ['Total AP', financeSummary.accountsPayable],
    ['Overdue AR', 290000],
    ['Near-Term AP', 360000],
  ];

  return (
    <PageShell
      title="Executive Snapshot"
      subtitle="Executive financial overview for the selected reporting period."
      selectedPeriod={currentPeriodLabel}
      exportContext="Presentation-friendly export: six KPI cards, trend, basic cash outlook, AR/AP relationship, top 10 list, and Booked Sales / Earned Revenue / Final Sales comparison."
      canvasClassName="fixed-report-canvas space-y-2"
    >
      <div className="grid grid-cols-6 gap-2">
        <PowerBICard title="Booked Sales" value={formatMoney(financeSummary.bookedSales)} variance="+8.4% vs prior period" status="positive" subtitle="Signed DocuSign agreements" tooltip="Total signed contract value, associated acres, and contract count for agreements fully signed through DocuSign during the selected reporting period." />
        <PowerBICard title="Earned Revenue" value={formatMoney(financeSummary.earnedRevenue)} variance="+6.1% vs prior period" status="positive" subtitle="GAAP recognized revenue" tooltip="GAAP-compliant revenue recognized through Signed Agreement, Soil Data Collection Complete, and Report Complete." />
        <PowerBICard title="Final Sales" value={formatMoney(financeSummary.finalSales)} variance="+$891K vs prior period" status="neutral" subtitle="Paid Account deals" tooltip="Value of accounts for which the full customer balance has been collected and the deal has reached Paid Account." />
        <PowerBICard title="Free Cash Flow" value={formatMoney(financeSummary.freeCashFlow)} variance="+$42K vs prior period" status="positive" subtitle="Operating less investing cash flow" tooltip="Operating cash flow less capital spend for the selected period." />
        <PowerBICard title="Accounts Receivable" value={formatMoney(financeSummary.accountsReceivable)} variance="+$74K vs prior period" status="negative" subtitle="Open customer balances" tooltip="Open customer invoice balances outstanding at period end." />
        <PowerBICard title="Accounts Payable" value={formatMoney(financeSummary.accountsPayable)} variance="-$38K vs prior period" status="positive" subtitle="Open vendor obligations" tooltip="Open vendor obligations expected to be paid from available cash." />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
        <ChartCard title="Revenue and Expense Trend" subtitle="Month-over-month and year-over-year for the selected period" height={190}>
          <BarChart data={executiveTrend} margin={{ top: 5, right: 20, left: 10, bottom: 8 }}>
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
          <FinanceTable title="Basic Cash Outlook" columns={['Cash Outlook', 'Amount']} rows={cashOutlookRows} />
          <FinanceTable title="AR and AP Relationship" columns={['AR/AP', 'Amount']} rows={arApRows} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white border border-[#CFD5D0] p-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>Booked Sales, Earned Revenue, and Final Sales Comparison</div>
            <div className="w-40">
              <PowerBISlicer title="Metric" value={processMetric} onChange={(value) => setProcessMetric(value as MetricMode)} options={[{ value: 'dollars', label: 'Dollars' }, { value: 'acres', label: 'Acres' }, { value: 'contracts', label: 'Contract Count' }]} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
          <BarChart data={processChartData} margin={{ top: 5, right: 20, left: 10, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="metric" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={metricAxis(processMetric)} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={metricTip(processMetric)} />
            <Bar dataKey="value" fill="#358540" name={metricLabel(processMetric)} />
          </BarChart>
          </ResponsiveContainer>
          <table className="w-full border-collapse text-xs mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
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

export function IncomeStatement() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [dateFilter, setDateFilter] = useState('yearToDate');
  const [periodFilter, setPeriodFilter] = useState('currentMonth');

  const rowByName = Object.fromEntries(incomeStatementRows.map(([name, current, prior, ytd, priorYtd]) => [
    String(name),
    { current: Number(current), prior: Number(prior), ytd: Number(ytd), priorYtd: Number(priorYtd) },
  ]));
  const directRevenue = rowByName['Direct-Sourced Earned Revenue'];
  const rpRevenue = rowByName['RP-Sourced Earned Revenue'];
  const totalRevenue = rowByName['Total Earned Revenue'];
  const costOfRevenue = rowByName['Cost of Revenue'];
  const totalOperatingExpenses = rowByName['Total Operating Expenses'];
  const operatingIncome = rowByName['Operating Income'];
  const otherIncomeExpense = rowByName['Other Income and Expenses'];
  const netIncome = rowByName['Net Income'];
  const departmentExpenseRows = expenseByDepartment.map((item) => ({
    id: `department-${item.department}`,
    label: item.department,
    current: -Math.round(item.value / 6),
    prior: -Math.round((item.value / 6) * 0.91),
    ytd: -item.value,
    priorYtd: -Math.round(item.value * 0.88),
  }));
  const revenueChildren = [
    { id: 'allSourcesRevenue', label: 'All Sources', ...totalRevenue },
    { id: 'directRevenue', label: 'Direct-Sourced Earned Revenue', ...directRevenue },
    { id: 'rpRevenue', label: 'RP-Sourced Earned Revenue', ...rpRevenue },
  ];
  const totalExpenses = {
    current: costOfRevenue.current + totalOperatingExpenses.current,
    prior: costOfRevenue.prior + totalOperatingExpenses.prior,
    ytd: costOfRevenue.ytd + totalOperatingExpenses.ytd,
    priorYtd: costOfRevenue.priorYtd + totalOperatingExpenses.priorYtd,
  };
  const profitAndLossRows: ProfitAndLossRow[] = [
    { id: 'revenue', label: 'Revenue', ...totalRevenue, children: revenueChildren },
    { id: 'operatingExpenses', label: 'Expenses', ...totalExpenses, children: departmentExpenseRows },
    { id: 'operatingIncome', label: 'Operating Income', ...operatingIncome },
    { id: 'otherIncomeExpense', label: 'Other Income and Expense', ...otherIncomeExpense },
    { id: 'netIncome', label: 'Net Income', ...netIncome },
  ];
  const expenseSliceData = departmentExpenseRows.map((row) => ({ name: row.label, value: Math.abs(row.ytd) }));
  const sourceRevenueRows = [
    ['All Sources', totalRevenue.current, totalRevenue.prior, totalRevenue.current - totalRevenue.prior],
    ['RP-Sourced', rpRevenue.current, rpRevenue.prior, rpRevenue.current - rpRevenue.prior],
    ['Direct-Sourced', directRevenue.current, directRevenue.prior, directRevenue.current - directRevenue.prior],
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
      title="Income Statement"
      subtitle="Illustrative financial statement structure pending QuickBooks account mapping."
      selectedPeriod={`${dateFilter} / ${periodFilter}`}
      exportContext={`Finance-statement print layout. Date: ${dateFilter}. Period: ${periodFilter}. Illustrative financial statement structure pending QuickBooks account mapping.`}
    >
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Total Revenue" value={formatMoney(totalRevenue.current)} variance={formatMoney(totalRevenue.current - totalRevenue.prior)} status={totalRevenue.current >= totalRevenue.prior ? 'positive' : 'negative'} subtitle="Current Period vs Prior Period" tooltip="Total financial statement revenue for the selected period." />
        <PowerBICard title="Total Expenses" value={formatMoney(totalExpenses.current)} variance={formatMoney(totalExpenses.current - totalExpenses.prior)} status={Math.abs(totalExpenses.current) <= Math.abs(totalExpenses.prior) ? 'positive' : 'negative'} subtitle="Illustrative expense structure" tooltip="Total expenses included in operating results for the selected period." />
        <PowerBICard title="Operating Income" value={formatMoney(operatingIncome.current)} variance={formatMoney(operatingIncome.current - operatingIncome.prior)} status={operatingIncome.current >= operatingIncome.prior ? 'positive' : 'negative'} subtitle="Financial statement subtotal" tooltip="Operating profit before other income and expense." />
        <PowerBICard title="Net Income" value={formatMoney(netIncome.current)} variance={formatMoney(netIncome.current - netIncome.prior)} status={netIncome.current >= netIncome.prior ? 'positive' : 'negative'} subtitle="Bottom-line income" tooltip="Income after operating and other income and expense." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-2 gap-3">
          <PowerBISlicer title="Date" value={dateFilter} onChange={setDateFilter} options={[{ value: 'currentMonth', label: 'Current Month' }, { value: 'yearToDate', label: 'Year to Date' }]} />
          <PowerBISlicer title="Period" value={periodFilter} onChange={setPeriodFilter} options={[{ value: 'currentMonth', label: 'Current Period' }, { value: 'priorMonth', label: 'Prior Period' }]} />
        </div>
      </div>
      <ProfitAndLossTable title="Income Statement Matrix" subtitle="Illustrative account hierarchy pending QuickBooks chart-of-accounts mapping" rows={profitAndLossRows} expandedRows={expandedRows} onToggle={toggleExpandedRow} />
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable title="Revenue by Source" subtitle="All Sources, RP-Sourced, and Direct-Sourced analysis" columns={['Source', 'Current Period', 'Prior Period', 'Dollar Variance']} rows={sourceRevenueRows} />
        <ChartCard title="Year-over-Year Revenue and Expense Comparison" subtitle="Revenue and expense comparison by month" height={240}>
          <LineChart data={monthlyFinance} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
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
      <div className="grid grid-cols-1 gap-3">
        <ChartCard title="Expenses by Department" subtitle="Department expense view" height={240}>
          <BarChart data={expenseSliceData} margin={{ top: 5, right: 30, left: 20, bottom: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="name" tick={{ ...chartText, fontSize: 9 }} angle={-20} textAnchor="end" height={70} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="value" fill="#D5741C" name="Expenses" />
          </BarChart>
        </ChartCard>
      </div>
      <DetailCandidate
        title="RP and RPM Financial Analysis"
        subtitle="Moved to supporting drillthrough: RP or RPM name, Earned Revenue, expenses, difference, associated Final Sales, and associated acres. Illustrative pending Finance approval of expense allocation and incentive rules."
      />
    </PageShell>
  );
}

export function RevenueRecognition() {
  const [recognitionPeriod, setRecognitionPeriod] = useState('monthly');
  const [stageFilter, setStageFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [reconciliationResultFilter, setReconciliationResultFilter] = useState('all');
  const [recognitionMetric, setRecognitionMetric] = useState<MetricMode>('dollars');
  const [stageView, setStageView] = useState<'chart' | 'table'>('chart');
  const stageNames = {
    stage1: 'Signed Agreement',
    stage2: 'Soil Data Collection Complete',
    stage3: 'Report Complete',
  };
  const monthFromDate = (date: string) => {
    if (!date) return '';
    const monthIndex = Number(date.slice(5, 7)) - 1;
    return months[monthIndex] || '';
  };
  const filteredDeals = financeDeals.filter((deal) => {
    if (customerFilter !== 'all' && deal.dealId !== customerFilter) return false;
    if (sourceFilter !== 'all' && deal.source !== sourceFilter) return false;
    if (reconciliationResultFilter !== 'all' && deal.reconciliationStatus !== reconciliationResultFilter) return false;
    return true;
  });
  const stageTotals = filteredDeals.reduce((acc, deal) => {
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
  const totalEarnedRevenue = stageTotals.stage1.revenue + stageTotals.stage2.revenue + stageTotals.stage3.revenue;
  const recognizedAcres = new Set(filteredDeals.filter((deal) => earnedForFinanceDeal(deal) > 0).map((deal) => deal.dealId)).size
    ? filteredDeals.filter((deal) => earnedForFinanceDeal(deal) > 0).reduce((total, deal) => total + deal.acres, 0)
    : 0;
  const recognizedContracts = filteredDeals.filter((deal) => earnedForFinanceDeal(deal) > 0).length;
  const crmEarnedRevenue = filteredDeals.reduce((total, deal) => total + earnedForFinanceDeal(deal), 0);
  const generalLedgerRevenue = filteredDeals.reduce((total, deal) => total + deal.glRevenue, 0);
  const reconciliationVariance = generalLedgerRevenue - crmEarnedRevenue;
  const unmatchedRecords = filteredDeals.filter((deal) => deal.reconciliationStatus !== 'Reconciled').length;
  const reconciliationResultOptions = Array.from(new Set(financeDeals.map((deal) => deal.reconciliationStatus))).map((result) => ({ value: result, label: result }));
  const stageRows = [
    [stageNames.stage1, stageTotals.stage1.revenue, stageTotals.stage1.acres, stageTotals.stage1.contracts],
    [stageNames.stage2, stageTotals.stage2.revenue, stageTotals.stage2.acres, stageTotals.stage2.contracts],
    [stageNames.stage3, stageTotals.stage3.revenue, stageTotals.stage3.acres, stageTotals.stage3.contracts],
  ];
  const visibleStageRows = stageRows.filter((row, index) => stageFilter === 'all' || stageFilter === `stage${index + 1}`);
  const periodData = months.map((month) => filteredDeals.reduce((period, deal) => {
    const stage = stageAmountForFinanceDeal(deal.contractValue);
    if (monthFromDate(deal.stage1Date) === month) {
      period.stage1Dollars += stage;
      period.stage1Acres += deal.acres;
      period.stage1Contracts += 1;
    }
    if (monthFromDate(deal.stage2Date) === month) {
      period.stage2Dollars += stage;
      period.stage2Acres += deal.acres;
      period.stage2Contracts += 1;
    }
    if (monthFromDate(deal.stage3Date) === month) {
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
  const currentPeriod = periodData[periodData.length - 1];
  const priorPeriod = periodData[periodData.length - 2];
  const currentPeriodEarnedRevenue = currentPeriod.stage1Dollars + currentPeriod.stage2Dollars + currentPeriod.stage3Dollars;
  const priorPeriodEarnedRevenue = priorPeriod.stage1Dollars + priorPeriod.stage2Dollars + priorPeriod.stage3Dollars;
  const currentPeriodAcres = currentPeriod.stage1Acres + currentPeriod.stage2Acres + currentPeriod.stage3Acres;
  const priorPeriodAcres = priorPeriod.stage1Acres + priorPeriod.stage2Acres + priorPeriod.stage3Acres;
  const currentPeriodContracts = currentPeriod.stage1Contracts + currentPeriod.stage2Contracts + currentPeriod.stage3Contracts;
  const priorPeriodContracts = priorPeriod.stage1Contracts + priorPeriod.stage2Contracts + priorPeriod.stage3Contracts;
  const currentPeriodMetric = metricValue(recognitionMetric, currentPeriodEarnedRevenue, currentPeriodAcres, currentPeriodContracts);
  const priorPeriodMetric = metricValue(recognitionMetric, priorPeriodEarnedRevenue, priorPeriodAcres, priorPeriodContracts);
  const periodMetricVariance = currentPeriodMetric - priorPeriodMetric;
  const periodComparisonRows = [
    ['Current Period', currentPeriodMetric],
    ['Prior Period', priorPeriodMetric],
    ['Variance', periodMetricVariance],
  ];
  const auditIndicators = [
    ['Missing stage date', filteredDeals.filter((deal) => !deal.stage1Date || !deal.stage2Date || !deal.stage3Date).length, 98000],
    ['Backward stage movement', exceptions.filter((item) => String(item[2]).includes('backward')).length, 210000],
    ['Repeated stage event', exceptions.filter((item) => String(item[2]).includes('Previously reported period changed')).length, 69000],
    ['General-Ledger mismatch', filteredDeals.filter((deal) => deal.glRevenue !== earnedForFinanceDeal(deal)).length, Math.abs(reconciliationVariance)],
    ['Historical-period change', exceptions.filter((item) => String(item[2]).includes('Previously reported period changed')).length, 69000],
  ];

  return (
    <PageShell
      title="Revenue Recognition"
      subtitle="Stage amounts are illustrative and require Finance validation before implementation."
      selectedPeriod={recognitionPeriod}
      exportContext={`Earned Revenue audit report. Recognition Period: ${recognitionPeriod}. Recognition Stage: ${stageFilter}. Customer: ${customerFilter}. Source: ${sourceFilter}. Reconciliation Result: ${reconciliationResultFilter}. Metric: ${recognitionMetric}. One-third allocation is a mockup assumption based on the meeting description; final DAX and accounting treatment must be approved by Finance. Open implementation rules include discounts, change orders, refunds, credits, cancellations, partial acreage changes, reopened accounts, and manual adjustments.`}
    >
      <div className="grid grid-cols-6 gap-3">
        <PowerBICard title="Total Earned Revenue" value={formatMoney(totalEarnedRevenue)} variance={formatMoney(reconciliationVariance)} status={reconciliationVariance === 0 ? 'positive' : 'negative'} subtitle="Operational stage completion" tooltip="GAAP-compliant revenue recognized when each applicable approved stage is completed." />
        <PowerBICard title="Signed Agreement Earned Revenue" value={formatMoney(stageTotals.stage1.revenue)} subtitle={stageNames.stage1} tooltip="Earned Revenue recognized when Signed Agreement is complete." />
        <PowerBICard title="Soil Data Collection Complete Earned Revenue" value={formatMoney(stageTotals.stage2.revenue)} subtitle={stageNames.stage2} tooltip="Earned Revenue recognized when Soil Data Collection Complete is recorded." />
        <PowerBICard title="Report Complete Earned Revenue" value={formatMoney(stageTotals.stage3.revenue)} subtitle={stageNames.stage3} tooltip="Earned Revenue recognized when Report Complete is recorded." />
        <PowerBICard title="Recognized Acres" value={formatAcres(recognizedAcres)} subtitle="Deals with Earned Revenue" tooltip="Acres associated with deals that have at least one completed recognition stage." />
        <PowerBICard title="Recognized Contracts" value={formatCount(recognizedContracts)} subtitle="Deals with Earned Revenue" tooltip="Contract count associated with deals that have at least one completed recognition stage." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-5 gap-3">
          <PowerBISlicer title="Recognition Period" value={recognitionPeriod} onChange={setRecognitionPeriod} options={[{ value: 'monthly', label: 'Monthly' }]} />
          <PowerBISlicer title="Recognition Stage" value={stageFilter} onChange={setStageFilter} options={[{ value: 'all', label: 'All Stages' }, { value: 'stage1', label: stageNames.stage1 }, { value: 'stage2', label: stageNames.stage2 }, { value: 'stage3', label: stageNames.stage3 }]} />
          <PowerBISlicer title="Customer" value={customerFilter} onChange={setCustomerFilter} options={[{ value: 'all', label: 'All Customers' }, ...financeDeals.map((deal) => ({ value: deal.dealId, label: deal.customer }))]} />
          <PowerBISlicer title="Source" value={sourceFilter} onChange={setSourceFilter} options={[{ value: 'all', label: 'All Sources' }, { value: 'RP-Sourced', label: 'RP-Sourced' }, { value: 'Direct-Sourced', label: 'Direct-Sourced' }]} />
          <PowerBISlicer title="Reconciliation Result" value={reconciliationResultFilter} onChange={setReconciliationResultFilter} options={[{ value: 'all', label: 'All Results' }, ...reconciliationResultOptions]} />
        </div>
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-2 gap-3">
          <PowerBISlicer title="Metric" value={recognitionMetric} onChange={(value) => setRecognitionMetric(value as MetricMode)} options={[{ value: 'dollars', label: 'Dollars' }, { value: 'acres', label: 'Acres' }, { value: 'contracts', label: 'Contract Count' }]} />
          <PowerBISlicer title="View" value={stageView} onChange={(value) => setStageView(value as 'chart' | 'table')} options={[{ value: 'chart', label: 'Chart View' }, { value: 'table', label: 'Table View' }]} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stageView === 'chart' ? (
          <ChartCard title="Earned Revenue by Stage and Period" subtitle={`Monthly view by ${metricLabel(recognitionMetric).toLowerCase()} and approved stage`} height={190}>
            <BarChart data={visiblePeriodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="period" tick={chartText} />
              <YAxis tick={chartText} tickFormatter={metricAxis(recognitionMetric)} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={metricTip(recognitionMetric)} />
              <Legend wrapperStyle={chartText} />
              {(stageFilter === 'all' || stageFilter === 'stage1') && <Bar dataKey="stage1" stackId="stage" fill="#234E2A" name={stageNames.stage1} />}
              {(stageFilter === 'all' || stageFilter === 'stage2') && <Bar dataKey="stage2" stackId="stage" fill="#358540" name={stageNames.stage2} />}
              {(stageFilter === 'all' || stageFilter === 'stage3') && <Bar dataKey="stage3" stackId="stage" fill="#56708F" name={stageNames.stage3} />}
            </BarChart>
          </ChartCard>
        ) : (
          <FinanceTable title="Earned Revenue by Stage and Period" subtitle={`Monthly table by selected ${metricLabel(recognitionMetric).toLowerCase()} metric`} columns={['Period', `${stageNames.stage1} ${metricLabel(recognitionMetric)}`, `${stageNames.stage2} ${metricLabel(recognitionMetric)}`, `${stageNames.stage3} ${metricLabel(recognitionMetric)}`, `Total ${metricLabel(recognitionMetric)}`]} rows={periodRows} />
        )}
        <FinanceTable title="Current Period versus Prior Period" subtitle={`Comparison by selected ${metricLabel(recognitionMetric).toLowerCase()} metric`} columns={['Period Comparison', metricLabel(recognitionMetric)]} rows={periodComparisonRows} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable title="Earned Revenue by Stage" subtitle="Stage-level dollars, acres, and contract count" columns={['Earned Revenue Stage', 'Dollars', 'Acres', 'Contract Count']} rows={visibleStageRows} />
        <ChartCard title="Operational Earned Revenue vs. General Ledger Revenue" subtitle="Reconciliation variance by deal" height={190}>
          <BarChart data={filteredDeals.map((deal) => ({ dealId: deal.dealId, operational: earnedForFinanceDeal(deal), gl: deal.glRevenue }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="dealId" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="operational" fill="#234E2A" name="Operational or CRM Earned Revenue" />
            <Bar dataKey="gl" fill="#56708F" name="General-Ledger Revenue" />
          </BarChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable title="Reconciliation Summary" subtitle="Operational Earned Revenue reconciled to general-ledger revenue" columns={['Reconciliation Summary', 'Value']} rows={[
          ['Operational or CRM Earned Revenue', crmEarnedRevenue],
          ['General-Ledger Revenue', generalLedgerRevenue],
          ['Variance', reconciliationVariance],
          ['Unmatched Records', unmatchedRecords],
          ['Last Reconciliation Date', '2026-06-30'],
        ]} />
        <FinanceTable title="Audit Indicators" subtitle="Read-only indicators connected to missing dates, movements, repeated events, GL mismatches, and historical-period changes" columns={['Audit Indicator', 'Records', 'Earned Revenue Exposure']} rows={auditIndicators} />
      </div>
      <DetailCandidate title="Revenue Recognition Audit Detail" subtitle="Moved to drillthrough or paginated report: contract/deal, customer, contract value, acres, stage dates, stage amounts, total Earned Revenue, GL amount, and reconciliation result." />
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
      subtitle="Illustrative financial statement structure pending QuickBooks account mapping."
      selectedPeriod="Current Period"
      exportContext="Finance-statement print layout. Includes hierarchical balance sheet, AR/AP relationship, prior-period comparison, and Assets = Liabilities + Equity validation. Illustrative financial statement structure pending QuickBooks account mapping."
    >
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Total Assets" value={formatMoney(totalAssets)} variance={formatMoney(totalAssets - priorTotalAssets)} status={totalAssets >= priorTotalAssets ? 'positive' : 'negative'} subtitle="Current Period" tooltip="Total current and long-term assets." />
        <PowerBICard title="Total Liabilities" value={formatMoney(totalLiabilities)} variance={formatMoney(totalLiabilities - priorTotalLiabilities)} status={totalLiabilities <= priorTotalLiabilities ? 'positive' : 'negative'} subtitle="Current Period" tooltip="Total current and long-term liabilities." />
        <PowerBICard title="Total Equity" value={formatMoney(totalEquity)} variance={formatMoney(totalEquity - priorTotalEquity)} status={totalEquity >= priorTotalEquity ? 'positive' : 'negative'} subtitle="Current Period" tooltip="Contributed capital, retained earnings, and current period earnings." />
        <PowerBICard title="Cash Balance" value={formatMoney(balanceSheetStatement.current.cash)} variance={formatMoney(balanceSheetStatement.current.cash - balanceSheetStatement.prior.cash)} status={balanceSheetStatement.current.cash >= balanceSheetStatement.prior.cash ? 'positive' : 'negative'} subtitle="Cash and Cash Equivalents" tooltip="Cash and cash equivalents at period end." />
      </div>
      <BalanceSheetStatementTable title="Balance Sheet Matrix" subtitle="Illustrative Assets, Liabilities, and Equity hierarchy pending QuickBooks chart-of-accounts mapping" rows={rows} expandedRows={expandedRows} onToggle={toggleExpandedRow} />
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable title="AR and AP Relationship" subtitle="Open receivables and payables summary" columns={['AR and AP Relationship', 'Amount']} rows={[
          ['Total AR', balanceSheetStatement.current.accountsReceivable],
          ['Total AP', balanceSheetStatement.current.accountsPayable],
          ['Overdue AR', overdueAr],
          ['Near-Term AP', upcomingAp],
        ]} />
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="flex items-center justify-between text-sm" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <span className="font-semibold text-[#006637]">Balance Validation</span>
            <span className={balanceDifference === 0 ? 'font-semibold text-[#2F7641]' : 'font-semibold text-[#A33C1B]'}>
              Assets {formatMoney(totalAssets)} = Liabilities + Equity {formatMoney(totalLiabilities + totalEquity)}
            </span>
            <StatusBadge tone={balanceDifference === 0 ? 'green' : 'orange'}>{balanceDifference === 0 ? 'Balanced' : `Out of Balance ${formatMoney(balanceDifference)}`}</StatusBadge>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export function CashFlow() {
  const [dateFilter, setDateFilter] = useState('yearToDate');
  const beginningCash = 1410000;
  const operatingCashFlow = 430000;
  const investingCashFlow = -120000;
  const financingCashFlow = 120000;
  const freeCashFlow = operatingCashFlow + investingCashFlow;
  const netChangeInCash = operatingCashFlow + investingCashFlow + financingCashFlow;
  const endingCash = beginningCash + netChangeInCash;

  return (
    <PageShell
      title="Cash Flow"
      subtitle="Illustrative financial statement structure pending QuickBooks account mapping."
      selectedPeriod={dateFilter}
      exportContext={`Finance-statement print layout. Date: ${dateFilter}. Illustrative financial statement structure pending QuickBooks account mapping.`}
    >
      <div className="grid grid-cols-5 gap-3">
        <PowerBICard title="Operating Cash Flow" value={formatMoney(operatingCashFlow)} status="positive" subtitle="Operating activities" tooltip="Cash flow from operating activities." />
        <PowerBICard title="Investing Cash Flow" value={formatMoney(investingCashFlow)} status="negative" subtitle="Investing activities" tooltip="Cash flow from investing activities." />
        <PowerBICard title="Financing Cash Flow" value={formatMoney(financingCashFlow)} status="positive" subtitle="Financing activities" tooltip="Cash flow from financing activities." />
        <PowerBICard title="Free Cash Flow" value={formatMoney(freeCashFlow)} status="positive" subtitle="Operating Cash Flow + Investing Cash Flow" tooltip="Operating cash flow after investing activity." />
        <PowerBICard title="Ending Cash" value={formatMoney(endingCash)} status="positive" subtitle="Cash balance rollforward" tooltip="Cash and cash equivalents at the end of the selected period." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-1 gap-3">
          <PowerBISlicer title="Date" value={dateFilter} onChange={setDateFilter} options={[{ value: 'currentMonth', label: 'Current Month' }, { value: 'yearToDate', label: 'Year to Date' }]} />
        </div>
      </div>
      <FinanceTable title="Cash Flow Statement Matrix" subtitle="Illustrative operating, investing, and financing structure pending QuickBooks account mapping" columns={['Cash Flow Statement', 'Actual Amount']} rows={cashFlowStatementRows} />
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable title="Basic Cash Outlook" subtitle="Basic cash outlook only" columns={['Cash Outlook', 'Amount']} rows={cashFlowOutlook} />
        <ChartCard title="Free Cash Flow Trend" subtitle="Period comparison" height={240}>
          <LineChart data={monthlyCashFlowTrend}>
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

export function ExceptionReporting() {
  const [reportingPeriodFilter, setReportingPeriodFilter] = useState('all');
  const [exceptionTypeFilter, setExceptionTypeFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [sourceSystemFilter, setSourceSystemFilter] = useState('all');
  const filteredExceptions = controlExceptions.filter((item) => {
    if (reportingPeriodFilter !== 'all' && item.detectedDate.slice(0, 7) !== reportingPeriodFilter) return false;
    if (exceptionTypeFilter !== 'all' && item.exceptionType !== exceptionTypeFilter) return false;
    if (customerFilter !== 'all' && item.customer !== customerFilter) return false;
    if (sourceSystemFilter !== 'all' && item.sourceSystem !== sourceSystemFilter) return false;
    return true;
  });
  const backwardStageMovements = filteredExceptions.filter((item) => item.exceptionType === 'Backward Stage Movement').length;
  const missingStageDates = filteredExceptions.filter((item) => item.exceptionType === 'Missing Stage Date').length;
  const glMismatches = filteredExceptions.filter((item) => item.exceptionType === 'CRM or Operational-to-General-Ledger Mismatch').length;
  const historicalPeriodChanges = filteredExceptions.filter((item) => item.exceptionType === 'Historical-Period Change').length;
  const exceptionTypeOptions = Array.from(new Set(controlExceptions.map((item) => item.exceptionType))).map((type) => ({ value: type, label: type }));
  const customerOptions = Array.from(new Set(controlExceptions.map((item) => item.customer))).map((customer) => ({ value: customer, label: customer }));
  const sourceSystemOptions = Array.from(new Set(controlExceptions.map((item) => item.sourceSystem))).map((sourceSystem) => ({ value: sourceSystem, label: sourceSystem }));
  const mismatchDifferenceData = exceptionTypeOptions.map((option) => ({
    type: option.label,
    difference: filteredExceptions
      .filter((item) => item.exceptionType === option.value)
      .reduce((total, item) => total + item.revenueDifference, 0),
  }));
  return (
    <PageShell
      title="Exception Reporting"
      subtitle="Read-only monitoring of revenue recognition and financial data exceptions."
      selectedPeriod={reportingPeriodFilter === 'all' ? 'All Periods' : reportingPeriodFilter}
      exportContext={`Read-only exception report. Reporting Period=${reportingPeriodFilter}; Exception Type=${exceptionTypeFilter}; Customer=${customerFilter}; Source System=${sourceSystemFilter}. Interactions: read-only drillthrough to exception detail, Export Data, and Export to PDF. The report does not resolve, assign, or edit exceptions in Power BI. Filtered exceptions: ${filteredExceptions.length}.`}
    >
      <div className="grid grid-cols-5 gap-3">
        <PowerBICard title="Open Exceptions" value={filteredExceptions.length} status={filteredExceptions.length > 0 ? 'negative' : 'positive'} subtitle="Read-only exception count" tooltip="Open revenue-recognition and financial data exceptions in the selected view." />
        <PowerBICard title="Deals Moved Backward" value={backwardStageMovements} subtitle="Backward Stage Movement" status={backwardStageMovements > 0 ? 'negative' : 'positive'} tooltip="Deals where a revenue-recognition stage moved backward after being recorded." />
        <PowerBICard title="Missing Stage Dates" value={missingStageDates} subtitle="Missing Stage Date" status={missingStageDates > 0 ? 'negative' : 'positive'} tooltip="Records missing a required stage date." />
        <PowerBICard title="General-Ledger Mismatches" value={glMismatches} subtitle="CRM or Operational-to-GL" status={glMismatches > 0 ? 'negative' : 'positive'} tooltip="Operational Earned Revenue not matching general-ledger revenue." />
        <PowerBICard title="Historical-Period Changes" value={historicalPeriodChanges} subtitle="Historical-Period Change" status={historicalPeriodChanges > 0 ? 'negative' : 'positive'} tooltip="Revenue-recognition records changed after a prior period close." />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="grid grid-cols-4 gap-3">
          <PowerBISlicer title="Reporting Period" value={reportingPeriodFilter} onChange={setReportingPeriodFilter} options={[{ value: 'all', label: 'All Periods' }, { value: '2026-06', label: 'June 2026' }, { value: '2026-05', label: 'May 2026' }, { value: '2026-04', label: 'April 2026' }, { value: '2026-03', label: 'March 2026' }]} />
          <PowerBISlicer title="Exception Type" value={exceptionTypeFilter} onChange={setExceptionTypeFilter} options={[{ value: 'all', label: 'All Exception Types' }, ...exceptionTypeOptions]} />
          <PowerBISlicer title="Customer" value={customerFilter} onChange={setCustomerFilter} options={[{ value: 'all', label: 'All Customers' }, ...customerOptions]} />
          <PowerBISlicer title="Source System" value={sourceSystemFilter} onChange={setSourceSystemFilter} options={[{ value: 'all', label: 'All Source Systems' }, ...sourceSystemOptions]} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <ChartCard title="Revenue Difference by Exception Type" subtitle="Direct sum of identified revenue differences where calculable" height={250}>
          <BarChart data={mismatchDifferenceData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="type" tick={{ ...chartText, fontSize: 9 }} angle={-25} textAnchor="end" height={90} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="difference" fill="#D5741C" name="Revenue Difference" />
          </BarChart>
        </ChartCard>
      </div>
      <DetailCandidate title="Exception Detail" subtitle={`${filteredExceptions.length} filtered records moved to read-only drillthrough or Export Data: exception type, deal/project, customer, affected stage and period, revenue difference, acres, source system, detected date, and description.`} />
    </PageShell>
  );
}
