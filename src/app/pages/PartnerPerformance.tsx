import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import PowerBICard from '../components/PowerBICard';

interface PartnerPerformanceProps {
  data: any;
}

const formatCurrency = (value: unknown) => `$${Number(value ?? 0).toLocaleString()}`;
const formatNumber = (value: unknown) => Number(value ?? 0).toLocaleString();

export default function PartnerPerformance({ data }: PartnerPerformanceProps) {
  const {
    kpis = {},
    topPartnersByDeals = [],
    topPartnersByValue = [],
    conversionByPartner = [],
    avgDealValueByType = [],
    partnerTable = [],
    partnersNeedingAttention = [],
  } = data ?? {};

  return (
    <div className="p-4 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-3">
        <PowerBICard title="Top RP Won Deal Value" value={kpis.topRPWonValue} subtitle="Best performer" />
        <PowerBICard title="Average Conversion Rate" value={kpis.avgConversionRate} subtitle="All partners" />
        <PowerBICard title="Partners with 0 Deals" value={kpis.partnersWithZeroDeals} subtitle="No activity" />
        <PowerBICard title="Low Revenue Partners" value={kpis.lowRevenuePartners} subtitle={kpis.lowRevenueSubtitle} />
        <PowerBICard title="Inactive RPs" value={kpis.inactiveRPs} subtitle={kpis.inactiveSubtitle} />
        <PowerBICard title="New RPs This Quarter" value={kpis.newRPsThisQuarter} subtitle={kpis.newRPsThisQuarterSubtitle} />
      </div>

      {/* Section Header: High Performers */}
      <div className="text-sm font-semibold text-[#006637] mt-4 mb-2 uppercase tracking-wide" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        High Performing Partners
      </div>

      {/* Top 2 Charts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Top Referral Partners by Deal Count</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimReferralPartner | COUNT(DealID) by PartnerName
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topPartnersByDeals} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
              <Bar dataKey="dealCount" fill="#234E2A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Top Referral Partners by Deal Value</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimReferralPartner | SUM(DealValue) by PartnerName
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topPartnersByValue} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="totalValue" fill="#7BBD5C" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom 2 Charts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Conversion Rate by Partner</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals | COUNT(Won) / COUNT(Total) by PartnerName
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={conversionByPartner} margin={{ top: 20, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: 'Source Sans 3, sans-serif' }} angle={-15} textAnchor="end" height={60} />
              <YAxis
                tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => `${value}%`} />
              <Bar dataKey="conversionRate" fill="#006637" label={{ position: 'top', formatter: (value: number) => `${value}%`, fontSize: 9, fontFamily: 'Source Sans 3, sans-serif' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Average Deal Value by Business Type</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals, DimReferralPartner | AVG(DealValue) by BusinessType
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={avgDealValueByType} margin={{ top: 5, right: 15, left: 10, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis dataKey="type" tick={{ fontSize: 9, fontFamily: 'Source Sans 3, sans-serif' }} angle={-25} textAnchor="end" height={60} />
              <YAxis
                tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="avgValue">
                {avgDealValueByType.map((_: any, index: number) => (
                  <Cell key={`avgvalue-cell-${index}`} fill={['#358540', '#234E2A', '#90B75D', '#2F8080', '#00A9E0'][index % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Partners Needing Attention Table */}
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Partners Needing Attention</div>
        <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Source: DimReferralPartner, FactDeals | Partners with zero deals, low revenue, or inactive status
        </div>
        <div className="overflow-auto" style={{ maxHeight: '250px' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <thead className="bg-[#E6EEE7] sticky top-0">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Partner Name</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Issue Type</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">City / State</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Deal Count</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Total Value</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Days Since Last Deal</th>
              </tr>
            </thead>
            <tbody>
              {partnersNeedingAttention.map((partner: any, index: number) => {
                const issueType = partner.issueType ?? partner.segment ?? 'Needs Attention';

                return (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F7F6]'}>
                  <td className="px-3 py-2 text-[#1A1A1A] font-semibold border-b border-[#E6EEE7]">{partner.name}</td>
                  <td className="px-3 py-2 border-b border-[#E6EEE7]">
                    <span className={`px-2 py-1 text-xs rounded ${
                      issueType === 'Zero Deals' ? 'bg-[#A33C1B] text-white' :
                      issueType === 'Low Revenue' ? 'bg-[#56708F] text-white' :
                      issueType === 'Inactive' ? 'bg-[#CFD5D0] text-[#1A1A1A]' :
                      'bg-[#E6EEE7] text-[#3D654D]'
                    }`}>
                      {issueType}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{[partner.city, partner.state].filter(Boolean).join(', ') || '-'}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{partner.dealCount ?? 0}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{formatCurrency(partner.totalValue ?? partner.wonValue)}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{partner.daysSinceLastDeal || '-'}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partner Detail Table */}
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Referral Partner Performance Detail</div>
        <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Source: DimReferralPartner, FactDeals | Multiple fields aggregated by PartnerID
        </div>
        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
          <table className="w-full text-sm" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <thead className="bg-[#E6EEE7] sticky top-0">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Referral Partner</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">RP ID</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Company</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">City / State</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Business Type</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Concierge RP</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Status</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Tier</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">RP Added</th>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Regional Mgr</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Deal Count</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Won Deals</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Conv %</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Total Value</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Avg Deal Value</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Won Value</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Total Acres</th>
              </tr>
            </thead>
            <tbody>
              {partnerTable.map((partner: any, index: number) => (
                <tr key={partner.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F7F6]'}>
                  <td className="px-3 py-2 text-[#1A1A1A] font-semibold border-b border-[#E6EEE7]">{partner.referralPartnerName}</td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{partner.referralPartnerId}</td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{partner.company}</td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{partner.city}, {partner.state}</td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{partner.businessType}</td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{partner.isConciergeRp ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{partner.activeStatus}</td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{partner.tier}</td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{partner.addedDate}</td>
                  <td className="px-3 py-2 text-[#3D654D] border-b border-[#E6EEE7]">{partner.regionalManager}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{partner.dealCount}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{partner.wonDeals}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{partner.conversionRate}%</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] font-semibold border-b border-[#E6EEE7]">{formatCurrency(partner.totalValue)}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{formatCurrency(partner.averageDealValue)}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{formatCurrency(partner.wonValue)}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{formatNumber(partner.totalAcres)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
