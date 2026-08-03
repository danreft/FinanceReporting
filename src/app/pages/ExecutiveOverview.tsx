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
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import PowerBICard from '../components/PowerBICard';

interface ExecutiveOverviewProps {
  data: any;
}

export default function ExecutiveOverview({ data }: ExecutiveOverviewProps) {
  const {
    kpis,
    executiveInsights,
    dealValueByMonth,
    newRPsOverTime,
    dealsEnteredPaidAccountsByQuarter,
    revenueByBusinessSource,
  } = data;

  return (
    <div className="p-4 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3">
        <PowerBICard title="Active Referral Partners" value={kpis.activePartners} subtitle="Total active" />
        <PowerBICard title="Won Deal Value" value={kpis.wonDealValue} subtitle="RP + Non-RP deals" />
        <PowerBICard title="Total Acres" value={kpis.totalAcres} subtitle="RP + Non-RP deals" />
        <PowerBICard title="Paid Deals" value={kpis.paidDeals} subtitle="RP + Non-RP deals" />
        <PowerBICard title="Avg Deal Size" value={kpis.avgDealSize} subtitle="Per won deal" />
      </div>

      {/* Executive Insights */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-3" style={{ fontFamily: 'Merriweather, serif' }}>
            Executive Insights
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#E6EEE7] p-3 rounded">
              <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Best Performing RP by Won Deal Value</div>
              <div className="text-lg font-semibold text-[#006637] mt-1" style={{ fontFamily: 'Merriweather, serif' }}>
                {executiveInsights.bestPerformingRP.name}
              </div>
              <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                ${(executiveInsights.bestPerformingRP.wonValue / 1000).toFixed(0)}K won value
              </div>
            </div>

            <div className="bg-[#E6EEE7] p-3 rounded">
              <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Highest Conversion RP</div>
              <div className="text-lg font-semibold text-[#006637] mt-1" style={{ fontFamily: 'Merriweather, serif' }}>
                {executiveInsights.highestConversionRP.name}
              </div>
              <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                {executiveInsights.highestConversionRP.conversionRate}% conversion rate
              </div>
            </div>

            <div className="bg-[#E6EEE7] p-3 rounded">
              <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>RP+ Contribution to Total Won Value</div>
              <div className="text-lg font-semibold text-[#006637] mt-1" style={{ fontFamily: 'Merriweather, serif' }}>
                {executiveInsights.rpPlusContribution}
              </div>
              <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                Downstream deals from RP+ network
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Revenue by Business Source + Referred Deal Value by Month */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Revenue by Business Source</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals | SUM(DealValue) where Status = 'Won' by BusinessSource
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Source Sans 3, sans-serif' }} />
              <Pie
                data={revenueByBusinessSource}
                dataKey="value"
                nameKey="source"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
              >
                {revenueByBusinessSource.map((_: any, index: number) => (
                  <Cell key={`revenue-source-cell-${index}`} fill={['#358540', '#56708F'][index % 2]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Referred Deal Value by Month</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimDate | SUM(DealValue) by Month
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dealValueByMonth} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis
                tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Source Sans 3, sans-serif' }} />
              <Bar dataKey="rpValue" stackId="dealValue" fill="#234E2A" name="RP Deals" />
              <Bar dataKey="nonRpValue" stackId="dealValue" fill="#56708F" name="Non-RP Deals" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Deals Producing Revenue + New RP Acquisition Over Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Deals Producing Revenue</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals | COUNT(DealID) where Pipeline = 'Soils' and Stage = 'Paid Accounts'
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dealsEnteredPaidAccountsByQuarter} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis
                tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }}
                label={{ value: 'Deals', angle: -90, position: 'insideLeft', fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }}
              />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Source Sans 3, sans-serif' }} />
              <Bar dataKey="rpDeals" stackId="revenue" fill="#234E2A" name="RP Deals" />
              <Bar dataKey="nonRpDeals" stackId="revenue" fill="#56708F" name="Non-RP Deals" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>New RP Acquisition Over Time</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: DimReferralPartner, DimDate | COUNT(PartnerID) by Month
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={newRPsOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Source Sans 3, sans-serif' }} />
              <Line
                type="monotone"
                dataKey="newRPs"
                stroke="#3D654D"
                strokeWidth={2}
                name="New RPs Added"
                dot={{ fill: '#3D654D', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
