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
import {
  arApAging,
  balanceSheetRows,
  earnedForFinanceDeal,
  expenseByDepartment,
  exceptions,
  financeDeals,
  financeSummary,
  formatMoney,
  formatNumber,
  incomeStatementRows,
  monthlyFinance,
  stageAmountForFinanceDeal,
  vendors,
} from '../data/financeMockData';

const COLORS = ['#234E2A', '#358540', '#90B75D', '#56708F', '#D5741C'];

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>{title}</div>
          <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Finance Reporting mockup for CFO requirements review</div>
        </div>
        <span className="px-2 py-1 text-xs rounded font-semibold bg-[#56708F] text-white" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Illustrative Data
        </span>
      </div>
      {children}
    </div>
  );
}

function ChartCard({ title, subtitle, height = 280, children }: { title: string; subtitle: string; height?: number; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#CFD5D0] p-4">
      <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>{title}</div>
      <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{subtitle}</div>
      <ResponsiveContainer width="100%" height={height}>{children as any}</ResponsiveContainer>
    </div>
  );
}

function FinanceTable({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <div className="bg-white border border-[#CFD5D0] p-4 overflow-x-auto">
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
            <tr key={rowIndex} className="border-b border-[#E6EEE7] last:border-0 hover:bg-[#F5F7F6]">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="py-2 pr-3 text-[#1A1A1A] whitespace-nowrap">
                  {cellIndex === 0 && typeof cell === 'string' && cell.includes('Total') ? <span className="font-semibold text-[#006637]">{cell}</span> : renderCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(cell: string | number) {
  if (typeof cell === 'number') return cell > 999 || cell < 0 ? formatMoney(cell) : cell.toLocaleString();
  if (['Reconciled', 'Resolved'].includes(cell)) return <StatusBadge tone="green">{cell}</StatusBadge>;
  if (['Review Required', 'In Review', 'High'].includes(cell)) return <StatusBadge tone="blue">{cell}</StatusBadge>;
  if (['Missing Data', 'Material Variance', 'Critical', 'Open'].includes(cell)) return <StatusBadge tone="orange">{cell}</StatusBadge>;
  if (['Dismissed', 'Medium', 'Low'].includes(cell)) return <StatusBadge tone="gray">{cell}</StatusBadge>;
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
const chartText = { fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' };

export function FinanceOverview() {
  const topCustomers = financeDeals
    .map((deal) => [deal.customer, deal.contractValue] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  return (
    <PageShell title="Executive Finance Overview">
      <div className="grid grid-cols-5 gap-3">
        <PowerBICard title="Booked Sales" value={formatMoney(financeSummary.bookedSales)} subtitle="+8.4% vs prior period" />
        <PowerBICard title="Earned Revenue" value={formatMoney(financeSummary.earnedRevenue)} subtitle="+6.1% vs prior period" />
        <PowerBICard title="Final Sales" value={formatMoney(financeSummary.finalSales)} subtitle="Paid account stage" />
        <PowerBICard title="Booked Acres" value={`${(financeSummary.bookedAcres / 1000).toFixed(1)}K`} subtitle="Contract booking acres" />
        <PowerBICard title="Earned Acres" value={`${(financeSummary.earnedAcres / 1000).toFixed(1)}K`} subtitle="Recognized stage acres" />
        <PowerBICard title="Cash Balance" value={formatMoney(financeSummary.cashBalance)} subtitle="Ending cash" />
        <PowerBICard title="Accounts Receivable" value={formatMoney(financeSummary.accountsReceivable)} subtitle="Open invoices" />
        <PowerBICard title="Accounts Payable" value={formatMoney(financeSummary.accountsPayable)} subtitle="Vendor obligations" />
        <PowerBICard title="Free Cash Flow" value={formatMoney(financeSummary.freeCashFlow)} subtitle="+$42K vs prior period" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Booked Sales vs. Earned Revenue vs. Final Sales by Month" subtitle="Source: Finance mock data | Stage-based revenue recognition">
          <BarChart data={monthlyFinance} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="bookedSales" fill="#234E2A" name="Booked Sales" />
            <Bar dataKey="earnedRevenue" fill="#358540" name="Earned Revenue" />
            <Bar dataKey="finalSales" fill="#56708F" name="Final Sales" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Earned Revenue by Source" subtitle="Direct Sales and Referral Partner earned revenue">
          <PieChart>
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Pie data={[{ source: 'Direct Sales', value: 898000 }, { source: 'Referral Partner', value: 1797000 }]} dataKey="value" nameKey="source" innerRadius={70} outerRadius={100} paddingAngle={2}>
              {[0, 1].map((index) => <Cell key={index} fill={COLORS[index]} />)}
            </Pie>
          </PieChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Expenses by Department" subtitle="Operating expenses by finance department">
          <BarChart data={expenseByDepartment} margin={{ top: 5, right: 20, left: 20, bottom: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="department" tick={{ ...chartText, fontSize: 9 }} angle={-25} textAnchor="end" height={70} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="value" fill="#358540" name="Expenses" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Accounts Receivable vs. Accounts Payable" subtitle="Current balance trend by aging bucket">
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
        <FinanceTable columns={['Top 10 Customers', 'Booked Sales']} rows={topCustomers} />
        <FinanceTable columns={['Top 10 Vendors', 'Spend']} rows={vendors} />
      </div>
    </PageShell>
  );
}

export function IncomeStatement() {
  const rows = incomeStatementRows.map(([name, current, prior, ytd, py]) => {
    const variance = Number(current) - Number(prior);
    const ytdVariance = Number(ytd) - Number(py);
    return [name, current, prior, variance, `${((variance / Math.abs(Number(prior))) * 100).toFixed(1)}%`, ytd, py, ytdVariance];
  });

  return (
    <PageShell title="Income Statement">
      <FinanceTable columns={['Account Category', 'Current Month', 'Prior Month', 'Variance', 'Variance %', 'Year to Date', 'Prior-Year YTD', 'YTD Variance']} rows={rows} />
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Rolling 12-Month Earned Revenue" subtitle="Monthly earned revenue trend">
          <LineChart data={monthlyFinance} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="earnedRevenue" stroke="#3D654D" strokeWidth={2} name="Earned Revenue" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Monthly Net Income" subtitle="Earned revenue less operating expenses">
          <BarChart data={monthlyFinance.map((item) => ({ ...item, netIncome: item.earnedRevenue - item.expenses }))} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="netIncome" fill="#358540" name="Net Income" />
          </BarChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <ChartCard title="Revenue Year over Year" subtitle="Current-year and prior-year comparison" height={240}>
          <BarChart data={monthlyFinance.map((item) => ({ ...item, priorYear: Math.round(item.earnedRevenue * 0.82) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="earnedRevenue" fill="#234E2A" name="Current Year" />
            <Bar dataKey="priorYear" fill="#56708F" name="Prior Year" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Expenses Year over Year" subtitle="Operating expense comparison" height={240}>
          <BarChart data={monthlyFinance.map((item) => ({ ...item, priorYear: Math.round(item.expenses * 0.88) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="expenses" fill="#D5741C" name="Current Year" />
            <Bar dataKey="priorYear" fill="#56708F" name="Prior Year" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Expenses by Department" subtitle="YTD department spend" height={240}>
          <PieChart>
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Pie data={expenseByDepartment} dataKey="value" nameKey="department" innerRadius={54} outerRadius={82}>
              {expenseByDepartment.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ChartCard>
      </div>
    </PageShell>
  );
}

export function RevenueRecognition() {
  const stageTotals = financeDeals.reduce((acc, deal) => {
    if (deal.stage1Date) acc.stage1 += stageAmountForFinanceDeal(deal.contractValue);
    if (deal.stage2Date) acc.stage2 += stageAmountForFinanceDeal(deal.contractValue);
    if (deal.stage3Date) acc.stage3 += stageAmountForFinanceDeal(deal.contractValue);
    return acc;
  }, { stage1: 0, stage2: 0, stage3: 0 });
  const rows = financeDeals.map((deal) => {
    const stage = stageAmountForFinanceDeal(deal.contractValue);
    const earned = earnedForFinanceDeal(deal);
    return [deal.dealId, deal.customer, deal.contract, deal.acres, deal.contractValue, deal.stage1Date || 'Missing', deal.stage1Date ? stage : 0, deal.stage2Date || 'Missing', deal.stage2Date ? stage : 0, deal.stage3Date || 'Missing', deal.stage3Date ? stage : 0, earned, deal.glRevenue, deal.glRevenue - earned, deal.reconciliationStatus];
  });
  const stageMix = [{ stage: 'Stage 1', value: stageTotals.stage1 }, { stage: 'Stage 2', value: stageTotals.stage2 }, { stage: 'Stage 3', value: stageTotals.stage3 }];

  return (
    <PageShell title="Revenue Recognition">
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Stage 1 Earned Revenue" value={formatMoney(stageTotals.stage1)} subtitle="Signed Agreement" />
        <PowerBICard title="Stage 2 Earned Revenue" value={formatMoney(stageTotals.stage2)} subtitle="Soil Data Complete" />
        <PowerBICard title="Stage 3 Earned Revenue" value={formatMoney(stageTotals.stage3)} subtitle="Report Complete" />
        <PowerBICard title="Total Earned Revenue" value={formatMoney(financeSummary.earnedRevenue)} subtitle="Stage 1 + Stage 2 + Stage 3" />
        <PowerBICard title="Earned Acres" value={`${(financeSummary.earnedAcres / 1000).toFixed(1)}K`} subtitle="Recognized acres" />
        <PowerBICard title="Projects Recognized" value={financeDeals.length} subtitle="Deals with recognized stages" />
        <PowerBICard title="Unrecognized Contract Value" value={formatMoney(financeSummary.bookedSales - financeSummary.earnedRevenue)} subtitle="Booked not earned" />
        <PowerBICard title="CRM-to-GL Variance" value={formatMoney(5000)} subtitle="Open variance" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Monthly Earned Revenue by Recognition Stage" subtitle="One-third recognition by operational milestone">
          <BarChart data={monthlyFinance.map((m) => ({ month: m.month, stage1: Math.round(m.earnedRevenue * 0.42), stage2: Math.round(m.earnedRevenue * 0.34), stage3: Math.round(m.earnedRevenue * 0.24) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="stage1" stackId="stage" fill="#234E2A" name="Stage 1" />
            <Bar dataKey="stage2" stackId="stage" fill="#358540" name="Stage 2" />
            <Bar dataKey="stage3" stackId="stage" fill="#56708F" name="Stage 3" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Recognition Stage Mix" subtitle="Earned revenue distribution by stage">
          <PieChart>
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Pie data={stageMix} dataKey="value" nameKey="stage" innerRadius={70} outerRadius={100}>
              {stageMix.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
            </Pie>
          </PieChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Earned Revenue Trend" subtitle="Monthly GAAP-compliant earned revenue">
          <LineChart data={monthlyFinance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="earnedRevenue" stroke="#3D654D" strokeWidth={2} />
          </LineChart>
        </ChartCard>
        <ChartCard title="CRM Earned Revenue vs. General Ledger Revenue" subtitle="Reconciliation variance by deal">
          <BarChart data={financeDeals.map((deal) => ({ dealId: deal.dealId, crm: earnedForFinanceDeal(deal), gl: deal.glRevenue }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="dealId" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="crm" fill="#234E2A" name="CRM Earned Revenue" />
            <Bar dataKey="gl" fill="#56708F" name="General Ledger Revenue" />
          </BarChart>
        </ChartCard>
      </div>
      <FinanceTable columns={['Deal ID', 'Customer', 'Contract', 'Acres', 'Contract Value', 'Stage 1 Date', 'Stage 1 Amount', 'Stage 2 Date', 'Stage 2 Amount', 'Stage 3 Date', 'Stage 3 Amount', 'Total Earned Revenue', 'General Ledger Revenue', 'Variance', 'Reconciliation Status']} rows={rows} />
    </PageShell>
  );
}

export function SalesOverview() {
  const stages = [
    ['Booked Sales', financeSummary.bookedSales, financeSummary.bookedAcres, financeDeals.length, '100%', 0],
    ['Earned Revenue Stage 1', 1223000, 122300, 8, '100%', 18],
    ['Earned Revenue Stage 2', 883000, 88300, 5, '72%', 43],
    ['Earned Revenue Stage 3', 589000, 58900, 3, '48%', 78],
    ['Final Sales', financeSummary.finalSales, financeSummary.finalAcres, 2, '23%', 74],
  ];

  return (
    <PageShell title="Sales Overview">
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="text-sm font-semibold text-[#006637] mb-3" style={{ fontFamily: 'Merriweather, serif' }}>Booked Sales to Final Sales Lifecycle</div>
        <div className="space-y-3">
          {stages.map(([stage, dollars, acres, count, percent, days]) => (
            <div key={String(stage)}>
              <div className="flex items-center justify-between text-xs mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                <span className="font-semibold text-[#1A1A1A]">{stage}</span>
                <span className="text-[#3D654D]">{formatMoney(Number(dollars))} | {formatNumber(Number(acres))} Acres | {count} Deals | {days} Avg Days</span>
              </div>
              <div className="h-4 bg-[#E6EEE7]">
                <div className="h-4 bg-[#358540]" style={{ width: String(percent) }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Monthly Booked Sales vs. Earned Revenue vs. Final Sales" subtitle="Lifecycle values by month">
          <BarChart data={monthlyFinance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="bookedSales" fill="#234E2A" name="Booked Sales" />
            <Bar dataKey="earnedRevenue" fill="#358540" name="Earned Revenue" />
            <Bar dataKey="finalSales" fill="#56708F" name="Final Sales" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Sales by Source" subtitle="Booked sales by originating channel">
          <PieChart>
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Pie data={[{ source: 'Direct Sales', value: 837000 }, { source: 'Referral Partner', value: 2832000 }]} dataKey="value" nameKey="source" innerRadius={70} outerRadius={100}>
              {[0, 1].map((index) => <Cell key={index} fill={COLORS[index]} />)}
            </Pie>
          </PieChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Booked-to-Final Conversion" subtitle="Percentage of Booked Sales reaching paid account stage">
          <LineChart data={monthlyFinance.map((m) => ({ month: m.month, conversion: Math.round((m.finalSales / Math.max(m.bookedSales, 1)) * 100) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
            <Line type="monotone" dataKey="conversion" stroke="#3D654D" strokeWidth={2} name="Conversion %" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Sales by Partner Program Manager" subtitle="Booked sales tied to finance program managers">
          <BarChart data={[{ manager: 'Sarah Keller', value: 1014000 }, { manager: 'Marcus Lee', value: 1188000 }, { manager: 'Nina Patel', value: 630000 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="manager" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="value" fill="#358540" name="Booked Sales" />
          </BarChart>
        </ChartCard>
      </div>
      <FinanceTable columns={['Deal ID', 'Customer', 'Source', 'Dollars', 'Acres', 'Deal Count', '% of Booked Sales', 'Average Days to Reach Stage']} rows={financeDeals.map((deal) => [deal.dealId, deal.customer, deal.source, deal.contractValue, deal.acres, 1, `${((deal.contractValue / financeSummary.bookedSales) * 100).toFixed(1)}%`, deal.daysToFinal || 'In Progress'])} />
    </PageShell>
  );
}

export function BalanceSheet() {
  return (
    <PageShell title="Balance Sheet">
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Working Capital" value={formatMoney(1330000)} subtitle="Current assets less current liabilities" />
        <PowerBICard title="Current Ratio" value="2.08" subtitle="Current assets / current liabilities" />
        <PowerBICard title="Accounts Receivable" value={formatMoney(financeSummary.accountsReceivable)} subtitle="Open customer balances" />
        <PowerBICard title="Accounts Payable" value={formatMoney(financeSummary.accountsPayable)} subtitle="Open vendor balances" />
      </div>
      <FinanceTable columns={['Account', 'Balance']} rows={balanceSheetRows} />
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Cash Balance Trend" subtitle="Monthly ending cash balance">
          <LineChart data={monthlyFinance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="cashBalance" stroke="#3D654D" strokeWidth={2} />
          </LineChart>
        </ChartCard>
        <ChartCard title="AR Aging and AP Aging" subtitle="Receivables and payables by days outstanding">
          <BarChart data={arApAging}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="bucket" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="ar" fill="#234E2A" name="AR Aging" />
            <Bar dataKey="ap" fill="#56708F" name="AP Aging" />
          </BarChart>
        </ChartCard>
      </div>
    </PageShell>
  );
}

export function CashFlow() {
  const rows = [
    ['Beginning Cash', 1410000],
    ['Cash from Operating Activities', 430000],
    ['Cash from Investing Activities', -120000],
    ['Cash from Financing Activities', 120000],
    ['Net Change in Cash', 430000],
    ['Ending Cash', financeSummary.cashBalance],
    ['Free Cash Flow', financeSummary.freeCashFlow],
  ];

  return (
    <PageShell title="Statement of Cash Flows">
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Beginning Cash" value={formatMoney(1410000)} subtitle="Start of period" />
        <PowerBICard title="Net Change in Cash" value={formatMoney(430000)} subtitle="Operating + investing + financing" />
        <PowerBICard title="Ending Cash" value={formatMoney(financeSummary.cashBalance)} subtitle="Beginning cash + net change" />
        <PowerBICard title="Free Cash Flow" value={formatMoney(financeSummary.freeCashFlow)} subtitle="Operating less capital spend" />
      </div>
      <FinanceTable columns={['Cash Flow Category', 'Amount']} rows={rows} />
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Monthly Cash Balance" subtitle="Ending cash by month">
          <LineChart data={monthlyFinance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="cashBalance" stroke="#3D654D" strokeWidth={2} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Cash Inflows vs. Outflows" subtitle="Monthly cash movement">
          <BarChart data={monthlyFinance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="inflows" fill="#234E2A" name="Inflows" />
            <Bar dataKey="outflows" fill="#A33C1B" name="Outflows" />
          </BarChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Free Cash Flow Trend" subtitle="Operating cash flow less investing activity">
          <LineChart data={monthlyFinance.map((m) => ({ month: m.month, fcf: m.inflows - m.outflows - 20000 }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="fcf" stroke="#3D654D" strokeWidth={2} name="Free Cash Flow" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Illustrative Cash Outlook" subtitle="Illustrative view only; forecast calculation not finalized">
          <LineChart data={[...monthlyFinance, { month: 'Jul', cashBalance: 1890000 }, { month: 'Aug', cashBalance: 1945000 }, { month: 'Sep', cashBalance: 1980000 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Line type="monotone" dataKey="cashBalance" stroke="#56708F" strokeWidth={2} name="Cash Outlook" />
          </LineChart>
        </ChartCard>
      </div>
    </PageShell>
  );
}

export function ReferralPartnerFinancialPerformance() {
  const referralPartnerDeals = financeDeals.filter((deal) => deal.source === 'Referral Partner');
  const referralPartnerRevenue = referralPartnerDeals.reduce((total, deal) => total + earnedForFinanceDeal(deal), 0);
  const rows = referralPartnerDeals.map((deal) => [deal.referralPartner, deal.partnerProgramManager, deal.customer, earnedForFinanceDeal(deal), Math.round(earnedForFinanceDeal(deal) * 0.12), Math.round(earnedForFinanceDeal(deal) * 0.88), '3.9x']);

  return (
    <PageShell title="Referral Partner Financial Performance">
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Referral Partner Earned Revenue" value={formatMoney(referralPartnerRevenue)} subtitle="Referral Partner source" />
        <PowerBICard title="Referral Partner Final Sales" value={formatMoney(555000)} subtitle="Paid referral partner accounts" />
        <PowerBICard title="Referral Partner Program Expenses" value={formatMoney(681000)} subtitle="YTD program cost" />
        <PowerBICard title="Referral Partner Net Contribution" value={formatMoney(referralPartnerRevenue - 681000)} subtitle="Earned revenue less expenses" />
        <PowerBICard title="Referral Partner ROI" value="3.6x" subtitle="Net contribution / expense" />
        <PowerBICard title="Revenue per Referral Partner" value={formatMoney(Math.round(referralPartnerRevenue / 3))} subtitle="Active financial referral partner" />
        <PowerBICard title="Cost per Referral Partner" value={formatMoney(227000)} subtitle="Program expenses / referral partner" />
        <PowerBICard title="Incentive Payouts" value={formatMoney(323000)} subtitle="Accrued and paid" />
      </div>
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="flex gap-1">
          {['Total Referral Partner Program', 'Partner Program Manager', 'Individual Referral Partner'].map((view, index) => (
            <button key={view} className={`px-4 py-2 text-sm font-semibold border-b-2 ${index === 0 ? 'text-[#006637] border-[#006637] bg-[#E6EEE7]' : 'text-[#3D654D] border-transparent hover:bg-[#F5F7F6]'}`} style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{view}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Referral Partner Earned Revenue vs. Expenses" subtitle="Referral Partner financial contribution">
          <BarChart data={monthlyFinance.map((m) => ({ month: m.month, revenue: m.referralPartner, expenses: Math.round(m.referralPartner * 0.28) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="month" tick={chartText} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Legend wrapperStyle={chartText} />
            <Bar dataKey="revenue" fill="#234E2A" name="Referral Partner Earned Revenue" />
            <Bar dataKey="expenses" fill="#D5741C" name="Referral Partner Expenses" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Referral Partner ROI by Program Manager" subtitle="Financial return by manager">
          <BarChart data={[{ manager: 'Sarah Keller', roi: 4.2 }, { manager: 'Marcus Lee', roi: 3.7 }, { manager: 'Nina Patel', roi: 2.8 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="manager" tick={chartText} />
            <YAxis tick={chartText} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
            <Bar dataKey="roi" fill="#358540" name="ROI" />
          </BarChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FinanceTable columns={['Top Referral Partners', 'Earned Revenue']} rows={rows.map((row) => [row[0], row[3]]).sort((a: any, b: any) => b[1] - a[1])} />
        <FinanceTable columns={['Lowest-Performing Referral Partners', 'Earned Revenue']} rows={rows.map((row) => [row[0], row[3]]).sort((a: any, b: any) => a[1] - b[1])} />
      </div>
      <FinanceTable columns={['Referral Partner', 'Program Manager', 'Customer', 'Referral Partner Earned Revenue', 'Incentive Payouts', 'Referral Partner Net Contribution', 'Referral Partner ROI']} rows={rows} />
    </PageShell>
  );
}

export function ExceptionsReconciliation() {
  return (
    <PageShell title="Exceptions & Reconciliation">
      <div className="grid grid-cols-3 gap-3">
        <PowerBICard title="Open Exceptions" value={3} subtitle="Open or in review" />
        <PowerBICard title="Critical Exceptions" value={1} subtitle="Immediate finance review" />
        <PowerBICard title="Missing Stage Dates" value={1} subtitle="Recognition support missing" />
        <PowerBICard title="Backward Stage Movements" value={1} subtitle="CRM process regression" />
        <PowerBICard title="CRM-to-GL Variances" value={1} subtitle="Material variance candidates" />
        <PowerBICard title="Prior-Period Changes" value={1} subtitle="Previously reported period changed" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="Exceptions by Severity" subtitle="Current exception population">
          <BarChart data={[{ severity: 'Critical', count: 1 }, { severity: 'High', count: 2 }, { severity: 'Medium', count: 1 }, { severity: 'Low', count: 1 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="severity" tick={chartText} />
            <YAxis tick={chartText} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
            <Bar dataKey="count" fill="#A33C1B" name="Exceptions" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Financial Impact by Exception Type" subtitle="Open reconciliation exposure">
          <BarChart data={exceptions.map((item) => ({ type: String(item[3]).split(' ').slice(0, 3).join(' '), impact: Number(item[7]) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="type" tick={{ ...chartText, fontSize: 9 }} angle={-20} textAnchor="end" height={55} />
            <YAxis tick={chartText} tickFormatter={moneyAxis} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={moneyTip} />
            <Bar dataKey="impact" fill="#D5741C" name="Financial Impact" />
          </BarChart>
        </ChartCard>
      </div>
      <FinanceTable columns={['Severity', 'Deal ID', 'Customer', 'Exception Type', 'Prior Stage', 'Current Stage', 'Recognition Date', 'Financial Impact', 'Date Detected', 'Owner', 'Status']} rows={exceptions} />
    </PageShell>
  );
}
