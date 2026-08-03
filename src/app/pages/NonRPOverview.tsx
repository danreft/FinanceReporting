import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import PowerBICard from '../components/PowerBICard';

interface NonRPOverviewProps {
  data: any;
}

const SOURCE_COLORS = ['#358540', '#56708F'];

const formatCurrency = (value: number) => `$${Number(value ?? 0).toLocaleString()}`;

export default function NonRPOverview({ data }: NonRPOverviewProps) {
  const {
    kpis,
    totalDealsBySource = [],
    paidAcresBySource = [],
    revenueBySource = [],
  } = data ?? {};

  return (
    <div className="p-4 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Won Deal Value" value={kpis.wonDealValue} subtitle="Non-RP deals" />
        <PowerBICard title="Won Deals" value={kpis.wonDeals} subtitle="Non-RP deals" />
        <PowerBICard title="Total Acres" value={kpis.totalAcres} subtitle="Non-RP deals" />
        <PowerBICard title="Avg. Deal Size" value={kpis.avgDealSize} subtitle="Per won deal" />
      </div>

      {/* Row 1: Total Deals + Paid Acres by Source */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
            Total Deals by Business Source
          </div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals | COUNT(DealID) by BusinessSource
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={totalDealsBySource} margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="source" tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
              <Bar dataKey="deals" name="Total Deals">
                {totalDealsBySource.map((_: any, index: number) => (
                  <Cell key={`totaldeals-cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
            Paid Acres by Business Source
          </div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals | SUM(Acres) where Stage = 'Paid Accounts' by BusinessSource
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={paidAcresBySource} margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="source" tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => value.toLocaleString()} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => `${value.toLocaleString()} acres`} />
              <Bar dataKey="acres" name="Paid Acres">
                {paidAcresBySource.map((_: any, index: number) => (
                  <Cell key={`paidacres-cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Revenue by Source */}
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
          Revenue by Business Source
        </div>
        <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Source: FactDeals, DimReferralPartner | SUM(DealValue) by BusinessSource
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueBySource} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="source" tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => formatCurrency(value)} />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Source Sans 3, sans-serif' }} />
            <Bar dataKey="dealValue" name="Deal Value">
              {revenueBySource.map((_: any, index: number) => (
                <Cell key={`revenue-cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
