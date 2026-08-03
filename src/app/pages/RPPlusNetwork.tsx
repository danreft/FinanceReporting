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
} from 'recharts';
import PowerBICard from '../components/PowerBICard';

interface RPPlusNetworkProps {
  data: any;
}

export default function RPPlusNetwork({ data }: RPPlusNetworkProps) {
  const { kpis, downstreamValueByRPPlus, newDownstreamRPs, conversionComparison, downstreamAcresByRPPlus } = data;

  return (
    <div className="p-4 space-y-4">
      {/* Warning Banner if incomplete mapping */}
      {parseInt(kpis.incompleteMapping) > 0 && (
        <div className="bg-[#FFF9E6] border border-[#D5741C] p-3">
          <div className="text-xs font-semibold text-[#1A1A1A] mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            RP+ Mapping Needs Review
          </div>
          <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            {kpis.incompleteMapping} incomplete upstream/downstream mappings detected. Some RP+ relationships may not be fully tracked.
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-7 gap-3">
        <PowerBICard title="Active RP+ Partners" value={kpis.activeRPPlus} subtitle="Recruiting tier" />
        <PowerBICard title="Downstream RPs Recruited" value={kpis.downstreamRPsRecruited} subtitle="Total recruited" />
        <PowerBICard title="Downstream Deals" value={kpis.downstreamDeals} subtitle="All stages" />
        <PowerBICard title="Downstream Won Deals" value={kpis.downstreamWonDeals} subtitle="Closed won" />
        <PowerBICard title="Downstream Won Deal Value" value={kpis.downstreamWonValue} subtitle="Total won value" />
        <PowerBICard title="RP+ Contribution %" value={kpis.rpPlusContributionPct} subtitle="Of total won value" />
        <PowerBICard title="Incomplete Mappings" value={kpis.incompleteMapping} subtitle="Needs review" />
      </div>

      {/* Row 1: Downstream Value by RP+ + New Downstream RPs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Downstream Deal Value by RP+</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimRPPlusMapping | SUM(DealValue) where RecruitedByRPPlus
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={downstreamValueByRPPlus} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Bar dataKey="downstreamValue" fill="#7BBD5C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>New Downstream RPs Over Time</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: DimReferralPartner, DimRPPlusMapping | COUNT(PartnerID) where RecruitedBy IS NOT NULL
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={newDownstreamRPs} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
              <Line type="monotone" dataKey="count" stroke="#006637" strokeWidth={2} name="New Downstream RPs" dot={{ fill: '#006637', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Downstream Acres + Conversion Comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Downstream Acres by RP+</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimRPPlusMapping | SUM(Acres) where RecruitedByRPPlus
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={downstreamAcresByRPPlus} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => value.toLocaleString()} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => `${value.toLocaleString()} acres`} />
              <Bar dataKey="acres" fill="#234E2A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>RP+ Network vs Standard RP Conversion</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals | COUNT(Won) / COUNT(Total) by RPType
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={conversionComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => `${value}%`} domain={[0, 50]} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => `${value}%`} />
              <Bar dataKey="conversionRate" label={{ position: 'top', formatter: (value: number) => `${value}%`, fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }}>
                {conversionComparison.map((_: any, index: number) => (
                  <Cell key={`conversion-cell-${index}`} fill={index === 0 ? '#7BBD5C' : '#90B75D'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight Callouts */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#E6EEE7] border border-[#CFD5D0] p-3">
          <div className="text-xs text-[#3D654D] mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Top Recruiting RP+</div>
          <div className="text-lg font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>Prairie Ridge Advisors</div>
          <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>$385K downstream won value</div>
        </div>

        <div className="bg-[#E6EEE7] border border-[#CFD5D0] p-3">
          <div className="text-xs text-[#3D654D] mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>RP+ Network Conversion Rate</div>
          <div className="text-lg font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>32%</div>
          <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>+8% vs standard RP</div>
        </div>

        <div className="bg-[#E6EEE7] border border-[#CFD5D0] p-3">
          <div className="text-xs text-[#3D654D] mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>RP+ Data Completeness</div>
          <div className="text-lg font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>90%</div>
          <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>38 of 42 mapped</div>
        </div>

        <div className="bg-[#E6EEE7] border border-[#CFD5D0] p-3">
          <div className="text-xs text-[#3D654D] mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Downstream Acres Contribution</div>
          <div className="text-lg font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>9,240</div>
          <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>21% of total acres</div>
        </div>
      </div>
    </div>
  );
}
