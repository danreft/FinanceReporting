import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import PowerBICard from '../components/PowerBICard';

interface RPOverviewProps {
  data: any;
}

const AGREEMENT_TYPE_COLORS = ['#358540', '#234E2A', '#90B75D', '#2F8080'];

const formatCurrency = (value: number) => `$${Number(value ?? 0).toLocaleString()}`;

export default function RPOverview({ data }: RPOverviewProps) {
  const {
    kpis,
    dealValueByAgreementType = [],
    valueAndPayoutByAgreementType = [],
    paidDealsByAgreementType = [],
  } = data ?? {};

  return (
    <div className="p-4 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        <PowerBICard title="Won Deal Value" value={kpis.wonDealValue} subtitle="Referral partner deals" />
        <PowerBICard title="Won Deals" value={kpis.wonDeals} subtitle="Referral partner deals" />
        <PowerBICard title="Total Acres" value={kpis.totalAcres} subtitle="Referral partner deals" />
        <PowerBICard title="Avg. Deal Size" value={kpis.avgDealSize} subtitle="Per won deal" />
      </div>

      {/* Row 1: Deal Value Donut + Deal Value by Agreement Type */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
            Referred Deal Value by RP Agreement Type
          </div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimReferralPartner | SUM(DealValue) by AgreementType
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => formatCurrency(value)} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Source Sans 3, sans-serif' }} />
              <Pie
                data={dealValueByAgreementType}
                dataKey="value"
                nameKey="type"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
              >
                {dealValueByAgreementType.map((_: any, index: number) => (
                  <Cell key={`agreement-donut-cell-${index}`} fill={AGREEMENT_TYPE_COLORS[index % AGREEMENT_TYPE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
            Deal Value by RP Agreement Type
          </div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimReferralPartner | SUM(DealValue) by AgreementType
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={valueAndPayoutByAgreementType} margin={{ top: 20, right: 20, left: 10, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="agreementType" tick={{ fontSize: 9, fontFamily: 'Source Sans 3, sans-serif' }} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="dealValue" name="Deal Value" fill="#358540" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Paid Deals by Agreement Type */}
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
          Total Paid Deals by Agreement Type
        </div>
        <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Source: FactDeals | COUNT(DealID) where Stage = 'Paid Accounts' by AgreementType
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={paidDealsByAgreementType} margin={{ top: 5, right: 15, left: 10, bottom: 45 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
            <XAxis dataKey="type" tick={{ fontSize: 9, fontFamily: 'Source Sans 3, sans-serif' }} angle={-25} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
            <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
            <Bar dataKey="paidDeals" name="Paid Deals">
              {paidDealsByAgreementType.map((_: any, index: number) => (
                <Cell key={`paiddeals-cell-${index}`} fill={AGREEMENT_TYPE_COLORS[index % AGREEMENT_TYPE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
