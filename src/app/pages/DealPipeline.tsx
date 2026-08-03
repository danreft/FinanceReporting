import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';
import PowerBICard from '../components/PowerBICard';

interface DealPipelineProps {
  data: any;
}

export default function DealPipeline({ data }: DealPipelineProps) {
  const { kpis, pipelineFunnel, dealsAddedOverTime, pipelineByBusinessType, stageAging } = data;

  return (
    <div className="p-4 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-3">
        <PowerBICard title="Total Referred Deals" value={kpis.totalReferredDeals} subtitle="All stages" />
        <PowerBICard title="Open Pipeline Value" value={kpis.openPipelineValue} subtitle="In progress" />
        <PowerBICard title="Lost Deal Value" value={kpis.lostDealValue} subtitle="Closed lost" />
        <PowerBICard title="Avg Deal Value" value={kpis.avgDealValue} subtitle="Per deal" />
        <PowerBICard title="Avg Acres per Deal" value={kpis.avgAcresPerDeal} subtitle="Average size" />
        <PowerBICard title="Deals Entered Paid Accounts" value={kpis.dealsEnteredPaidAccounts} subtitle="This quarter" />
      </div>

      {/* Row 1: Pipeline Funnel + Deal Value by Stage */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Pipeline Funnel</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals | COUNT(DealID) by DealStage
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <FunnelChart margin={{ top: 10, right: 200, bottom: 10, left: 10 }}>
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
              <Funnel dataKey="count" data={pipelineFunnel} isAnimationActive>
                {pipelineFunnel.map((_: any, index: number) => (
                  <Cell key={`funnel-cell-${index}`} fill={['#358540', '#234E2A', '#90B75D', '#2F8080', '#00A9E0', '#305C9E', '#C97A1C'][index % 7]} />
                ))}
                <LabelList
                  position="right"
                  fill="#1A1A1A"
                  stroke="none"
                  content={({ x, y, width, height, index }: any) => {
                    const stage = pipelineFunnel[index];
                    return (
                      <text
                        x={Number(x) + Number(width) + 8}
                        y={Number(y) + Number(height) / 2}
                        fill="#1A1A1A"
                        textAnchor="start"
                        dominantBaseline="middle"
                        fontFamily="Source Sans 3, sans-serif"
                        fontSize="10"
                      >
                        {stage?.stage} ({stage?.count})
                      </text>
                    );
                  }}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Deal Value by Stage</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals | SUM(DealValue) by DealStage
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={pipelineFunnel} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <YAxis dataKey="stage" type="category" width={160} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Bar dataKey="value">
                {pipelineFunnel.map((_: any, index: number) => (
                  <Cell key={`dealvalue-cell-${index}`} fill={['#358540', '#234E2A', '#90B75D', '#2F8080', '#00A9E0', '#305C9E', '#C97A1C'][index % 7]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Deals Added Over Time + Pipeline by Business Type */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Deals Added Over Time</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimDate | COUNT(DealID) by Month
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dealsAddedOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
              <Line type="monotone" dataKey="deals" stroke="#234E2A" strokeWidth={2} dot={{ fill: '#234E2A', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Pipeline by Business Type</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimReferralPartner | COUNT(DealID) by BusinessType
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pipelineByBusinessType} margin={{ top: 5, right: 15, left: 10, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="type" tick={{ fontSize: 9, fontFamily: 'Source Sans 3, sans-serif' }} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
              <Bar dataKey="count">
                {pipelineByBusinessType.map((_: any, index: number) => (
                  <Cell key={`businesstype-cell-${index}`} fill={['#358540', '#234E2A', '#90B75D', '#2F8080', '#00A9E0'][index % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Stage Aging */}
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Average Days in Stage</div>
        <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Source: FactDeals | AVG(DaysInStage) by DealStage
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stageAging} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="stage" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
            <YAxis tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fontSize: 10, fontFamily: 'Source Sans 3, sans-serif', fill: '#3D654D' } }} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
            <Bar dataKey="avgDays" fill="#7BBD5C" label={{ position: 'top', fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
