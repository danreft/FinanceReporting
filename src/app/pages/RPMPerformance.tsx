import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import RPMTerritoryMap from '../components/RPMTerritoryMap';

interface RPMPerformanceProps {
  data: any;
}

const formatCurrency = (value: number) => `$${Number(value ?? 0).toLocaleString()}`;
const formatNumber = (value: number) => Number(value ?? 0).toLocaleString();

export default function RPMPerformance({ data }: RPMPerformanceProps) {
  const {
    topRPMByAcres,
    topRPMByDealValue,
    topRPMByDeals,
    dealDistributionByValueBucket = [],
    stateDealValues = [],
    rpmTeamTable = [],
  } = data ?? {};

  return (
    <div className="p-4 space-y-4">

      {/* Top RPMs */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-3" style={{ fontFamily: 'Merriweather, serif' }}>
            Top RPMs
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#E6EEE7] p-3 rounded">
              <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Top RPM by Acres</div>
              <div className="text-lg font-semibold text-[#006637] mt-1" style={{ fontFamily: 'Merriweather, serif' }}>
                {topRPMByAcres?.name}
              </div>
              <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                {topRPMByAcres?.stat}
              </div>
            </div>

            <div className="bg-[#E6EEE7] p-3 rounded">
              <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Top RPM by Deal Value</div>
              <div className="text-lg font-semibold text-[#006637] mt-1" style={{ fontFamily: 'Merriweather, serif' }}>
                {topRPMByDealValue?.name}
              </div>
              <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                {topRPMByDealValue?.stat}
              </div>
            </div>

            <div className="bg-[#E6EEE7] p-3 rounded">
              <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Top RPM by Deals</div>
              <div className="text-lg font-semibold text-[#006637] mt-1" style={{ fontFamily: 'Merriweather, serif' }}>
                {topRPMByDeals?.name}
              </div>
              <div className="text-xs text-[#1A1A1A] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                {topRPMByDeals?.stat}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RPM Territory Map + Deal Distribution by Value Bucket */}
      <div className="grid grid-cols-2 gap-3">
        <RPMTerritoryMap stateDealValues={stateDealValues} />

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>Deal Distribution by Value Bucket</div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: FactDeals | COUNT(DealID) by DealValueBucket
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dealDistributionByValueBucket} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis dataKey="bucket" type="category" width={110} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} />
              <Bar dataKey="deals" name="Deals" fill="#358540" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RPM / Associate RPM Team Table */}
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>RPM Team Performance</div>
        <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Source: DimReferralPartner, FactDeals | Total Acres, Deal Value, and Total Deals by RPM and Associate RPM
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <thead className="bg-[#E6EEE7] sticky top-0">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">RPM / Associate RPM</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Total Acres</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Deal Value</th>
                <th className="text-right px-3 py-2 font-semibold text-[#006637] border-b border-[#CFD5D0]">Total Deals</th>
              </tr>
            </thead>
            <tbody>
              {rpmTeamTable.map((row: any, index: number) => (
                <tr
                  key={`${row.level}-${row.name}-${index}`}
                  className={
                    row.level === 'total'
                      ? 'bg-[#E6EEE7] border-t-2 border-[#006637]'
                      : row.level === 'rpm'
                        ? 'bg-[#F5F7F6]'
                        : 'bg-white'
                  }
                >
                  <td
                    className={`px-3 py-2 border-b border-[#E6EEE7] ${row.level === 'associate' ? 'pl-8 text-[#1A1A1A]' : 'font-semibold text-[#1A1A1A]'}`}
                  >
                    {row.name}
                  </td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{formatNumber(row.acres)}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{formatCurrency(row.dealValue)}</td>
                  <td className="px-3 py-2 text-right text-[#1A1A1A] border-b border-[#E6EEE7]">{formatNumber(row.deals)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
