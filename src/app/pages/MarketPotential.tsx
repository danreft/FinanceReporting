import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import PowerBICard from '../components/PowerBICard';
import { AgriculturalMarketState } from '../data/mockDataV3Updated';
import usStatesTopology from '../data/us-states-10m.json';

interface MarketPotentialProps {
  data: {
    statePlanning: AgriculturalMarketState[];
  };
}

interface MarketPlanningRow extends AgriculturalMarketState {
  coveredAcres: number;
  avgAcresPerRp: number;
  targetRps: number;
  rpsNeededToAdd: number;
  estimatedFarmCount: number;
  farmsPerRpmTarget: number;
  bsaTamDollarValue: number;
  coverageStatus: string;
}

type MapMetric = 'tamDollarValue' | 'avgAcresPerRp';

const stateCoordinates: Record<string, [number, number]> = {
  AR: [-92.38, 34.75],
  CA: [-119.42, 36.78],
  CO: [-105.55, 39.0],
  IA: [-93.5, 42.07],
  ID: [-114.74, 44.24],
  IL: [-89.4, 40.0],
  IN: [-86.13, 40.27],
  KS: [-98.48, 38.5],
  MN: [-94.69, 46.28],
  MO: [-92.6, 38.45],
  MS: [-89.67, 32.74],
  MT: [-110.36, 46.88],
  ND: [-100.47, 47.55],
  NE: [-99.8, 41.5],
  OH: [-82.91, 40.42],
  OK: [-97.5, 35.55],
  SD: [-100.23, 44.36],
  TX: [-99.9, 31.15],
  WI: [-89.62, 44.55],
  WY: [-107.55, 43.0],
};

const formatNumber = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatShort = (value: number) => {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
  return `$${(value / 1000).toFixed(0)}K`;
};

const formatAcresShort = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return formatNumber(value);
};

const getHeatmapStyle = (value: number, maxValue: number, color: 'green' | 'gold', emphasis: 'standard' | 'strong' = 'standard') => {
  if (!maxValue || value <= 0) return {};
  const intensity = Math.max(0.12, Math.min(value / maxValue, 1));
  const base = emphasis === 'strong' ? 0.12 : 0.08;
  const range = emphasis === 'strong' ? 0.30 : 0.22;
  const green = `rgba(0, 102, 55, ${base + intensity * range})`;
  const gold = `rgba(120, 189, 60, ${base + intensity * range})`;
  return { backgroundColor: color === 'green' ? green : gold };
};

const getMapFill = (value: number, maxValue: number, metric: MapMetric) => {
  if (!maxValue || value <= 0) return '#EEF2EF';
  const intensity = Math.max(0.14, Math.min(value / maxValue, 1));
  if (metric === 'tamDollarValue') {
    return `rgba(120, 189, 60, ${0.18 + intensity * 0.68})`;
  }
  return `rgba(0, 102, 55, ${0.16 + intensity * 0.62})`;
};

const MarketTamMap = ({
  rows,
  selectedMetric,
  onSelectedMetricChange,
  maxTam,
  maxAvgAcresPerRp,
  maxRps,
}: {
  rows: MarketPlanningRow[];
  selectedMetric: MapMetric;
  onSelectedMetricChange: (metric: MapMetric) => void;
  maxTam: number;
  maxAvgAcresPerRp: number;
  maxRps: number;
}) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; row: MarketPlanningRow } | null>(null);
  const rowsByName = useMemo(
    () => rows.reduce<Record<string, MarketPlanningRow>>((lookup, row) => {
      lookup[row.stateName] = row;
      return lookup;
    }, {}),
    [rows],
  );

  const metricLabel = selectedMetric === 'tamDollarValue' ? 'Total TAM Dollar Value' : 'Average Acres per RP';
  const metricMax = selectedMetric === 'tamDollarValue' ? maxTam : maxAvgAcresPerRp;

  const getMetricValue = (row: MarketPlanningRow) =>
    selectedMetric === 'tamDollarValue' ? row.bsaTamDollarValue : row.avgAcresPerRp;

  const getBubbleSize = (row: MarketPlanningRow) => {
    if (row.currentRps <= 0 || maxRps <= 0) return 0;
    return 5 + (row.currentRps / maxRps) * 17;
  };

  const handleStateMouseMove = (event: MouseEvent<SVGPathElement>, row?: MarketPlanningRow) => {
    if (!row) return;
    setTooltip({ x: event.clientX + 14, y: event.clientY + 14, row });
  };

  const handleMarkerMouseMove = (event: MouseEvent<SVGCircleElement>, row: MarketPlanningRow) => {
    setTooltip({ x: event.clientX + 14, y: event.clientY + 14, row });
  };

  return (
    <div className="bg-white border border-[#CFD5D0] p-4">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-3 mb-3">
        <div>
          <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>
            Executive TAM Map: Market Opportunity vs RP Coverage
          </div>
          <div className="text-xs text-[#3D654D] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: Agricultural Reference Data, DimReferralPartner | State fill = selected TAM metric, bubble size = Current RP Count
          </div>
        </div>
        <div className="flex border border-[#9FAEA4] bg-white" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          <button
            onClick={() => onSelectedMetricChange('tamDollarValue')}
            className={`px-3 py-1.5 text-xs font-semibold ${
              selectedMetric === 'tamDollarValue' ? 'bg-[#006637] text-white' : 'bg-white text-[#3D654D] hover:bg-[#E6EEE7]'
            }`}
          >
            TAM Dollar Value
          </button>
          <button
            onClick={() => onSelectedMetricChange('avgAcresPerRp')}
            className={`px-3 py-1.5 text-xs font-semibold border-l border-[#9FAEA4] ${
              selectedMetric === 'avgAcresPerRp' ? 'bg-[#006637] text-white' : 'bg-white text-[#3D654D] hover:bg-[#E6EEE7]'
            }`}
          >
            Avg Acres per RP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-4">
        <div className="relative border border-[#E6EEE7] bg-[#F8FAF8]">
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 980 }}
            width={980}
            height={430}
            style={{ width: '100%', height: '430px' }}
          >
            <Geographies geography={usStatesTopology}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const row = rowsByName[geo.properties.name];
                  const value = row ? getMetricValue(row) : 0;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getMapFill(value, metricMax, selectedMetric)}
                      stroke="#FFFFFF"
                      strokeWidth={0.8}
                      onMouseMove={(event) => handleStateMouseMove(event, row)}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: row ? '#B8D9A5' : '#E2E8E3' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {rows.map((row) => {
              const coordinates = stateCoordinates[row.state];
              const radius = getBubbleSize(row);
              if (!coordinates || radius <= 0) return null;
              return (
                <Marker key={row.state} coordinates={coordinates}>
                  <circle
                    r={radius}
                    fill="#234E2A"
                    fillOpacity={0.72}
                    stroke="#FFFFFF"
                    strokeWidth={1.4}
                    style={{ cursor: 'pointer' }}
                    onMouseMove={(event) => handleMarkerMouseMove(event, row)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                </Marker>
              );
            })}
          </ComposableMap>

          {tooltip && (
            <div
              className="fixed bg-white border border-[#9FAEA4] p-3 shadow-md pointer-events-none z-20 w-[250px]"
              style={{ fontFamily: 'Source Sans 3, sans-serif', left: tooltip.x, top: tooltip.y }}
            >
              <div className="text-xs font-semibold text-[#006637] mb-1">{tooltip.row.stateName}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <span className="text-[#3D654D]">Current RP count</span>
                <span className="text-right text-[#1A1A1A] font-semibold">{formatNumber(tooltip.row.currentRps)}</span>
                <span className="text-[#3D654D]">Total TAM dollar value</span>
                <span className="text-right text-[#1A1A1A] font-semibold">{formatCurrency(tooltip.row.bsaTamDollarValue)}</span>
                <span className="text-[#3D654D]">Total agricultural acres</span>
                <span className="text-right text-[#1A1A1A] font-semibold">{formatNumber(tooltip.row.agriculturalAcres)}</span>
                <span className="text-[#3D654D]">Average acres per RP</span>
                <span className="text-right text-[#1A1A1A] font-semibold">
                  {tooltip.row.currentRps > 0 ? formatNumber(tooltip.row.avgAcresPerRp) : 'No RP Coverage'}
                </span>
                <span className="text-[#3D654D]">Coverage status</span>
                <span className="text-right text-[#1A1A1A] font-semibold">{tooltip.row.coverageStatus}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="border border-[#CFD5D0] p-3 bg-white">
            <div className="text-xs font-semibold text-[#006637] mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
              Map Legend
            </div>
            <div className="space-y-2 text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
              <div>
                <div className="font-semibold text-[#1A1A1A] mb-1">State color = {metricLabel}</div>
                <div className="h-3 w-full border border-[#CFD5D0] bg-gradient-to-r from-[#EEF2EF] via-[#B8D9A5] to-[#006637]" />
                <div className="flex justify-between mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#E6EEE7]">
                <div className="font-semibold text-[#1A1A1A] mb-2">Bubble size = RP count</div>
                <div className="flex items-end gap-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#234E2A] opacity-75 border border-white" />
                  <span className="h-4 w-4 rounded-full bg-[#234E2A] opacity-75 border border-white" />
                  <span className="h-6 w-6 rounded-full bg-[#234E2A] opacity-75 border border-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="border border-[#CFD5D0] p-3 bg-[#F8FAF8]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <div className="text-xs font-semibold text-[#1A1A1A] mb-2">Executive read</div>
            <div className="text-xs text-[#3D654D] leading-snug">
              Use the color layer to find high-TAM states, then compare bubble size to see whether RP coverage is proportional to the opportunity.
            </div>
          </div>
          <div className="border border-[#CFD5D0] p-3 bg-white" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <div className="text-xs font-semibold text-[#1A1A1A] mb-2">Power BI visual stack</div>
            <div className="text-xs text-[#3D654D] leading-snug">
              Shape map or filled map for state shading, bubble map layer for RP count, slicer/bookmark toggle for metric switching.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScenarioInput = ({
  label,
  value,
  onChange,
  prefix,
  helperText,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  helperText: string;
}) => (
  <div>
    <div className="text-xs font-semibold text-[#1A1A1A] mb-1.5" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
      {label}
    </div>
    <div className="flex items-center border border-[#9FAEA4] bg-white w-full max-w-[190px] hover:border-[#006637]">
      {prefix && <span className="px-2 text-sm text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{prefix}</span>}
      <input
        type="text"
        inputMode="numeric"
        value={formatNumber(value)}
        onChange={(event) => onChange(Math.max(Number(event.target.value.replace(/\D/g, '')) || 1, 1))}
        className="w-full px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#006637]"
        style={{ fontFamily: 'Source Sans 3, sans-serif' }}
      />
    </div>
    <div className="text-xs text-[#5F7467] mt-1.5 leading-snug" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
      {helperText}
    </div>
  </div>
);

export default function MarketPotential({ data }: MarketPotentialProps) {
  const [targetAcresPerRp, setTargetAcresPerRp] = useState(1000000);
  const [revenuePerAcre, setRevenuePerAcre] = useState(40);
  const [farmsPerRpmTarget, setFarmsPerRpmTarget] = useState(1600);
  const [selectedMapMetric, setSelectedMapMetric] = useState<MapMetric>('tamDollarValue');

  const rows = useMemo<MarketPlanningRow[]>(
    () =>
      data.statePlanning
        .map((state) => {
          const coveredAcres = state.currentRps > 0 ? state.agriculturalAcres : 0;
          const avgAcresPerRp = state.currentRps > 0 ? coveredAcres / state.currentRps : 0;
          const targetRps = state.agriculturalAcres / targetAcresPerRp;
          const rpsNeededToAdd = Math.max(targetRps - state.currentRps, 0);
          const estimatedFarmCount = state.agriculturalAcres / state.avgFarmSize;
          const coverageStatus = state.currentRps === 0
            ? 'No RP Coverage'
            : rpsNeededToAdd >= 5
              ? 'Undercovered'
              : 'Covered';

          return {
            ...state,
            coveredAcres,
            avgAcresPerRp,
            targetRps,
            rpsNeededToAdd,
            estimatedFarmCount,
            farmsPerRpmTarget: estimatedFarmCount / farmsPerRpmTarget,
            bsaTamDollarValue: state.agriculturalAcres * revenuePerAcre,
            coverageStatus,
          };
        })
        .sort((a, b) => b.rpsNeededToAdd - a.rpsNeededToAdd),
    [data.statePlanning, farmsPerRpmTarget, revenuePerAcre, targetAcresPerRp],
  );

  const totals = rows.reduce(
    (sum, row) => ({
      agriculturalAcres: sum.agriculturalAcres + row.agriculturalAcres,
      currentRps: sum.currentRps + row.currentRps,
      coveredAcres: sum.coveredAcres + row.coveredAcres,
      targetRps: sum.targetRps + row.targetRps,
      rpsNeededToAdd: sum.rpsNeededToAdd + row.rpsNeededToAdd,
      estimatedFarmCount: sum.estimatedFarmCount + row.estimatedFarmCount,
      farmsPerRpmTarget: sum.farmsPerRpmTarget + row.farmsPerRpmTarget,
      bsaTamDollarValue: sum.bsaTamDollarValue + row.bsaTamDollarValue,
    }),
    {
      agriculturalAcres: 0,
      currentRps: 0,
      coveredAcres: 0,
      targetRps: 0,
      rpsNeededToAdd: 0,
      estimatedFarmCount: 0,
      farmsPerRpmTarget: 0,
      bsaTamDollarValue: 0,
    },
  );

  const totalAvgAcresPerRp = totals.currentRps > 0 ? totals.coveredAcres / totals.currentRps : 0;
  const currentMarketCoveragePct = totals.agriculturalAcres > 0 ? (totals.coveredAcres / totals.agriculturalAcres) * 100 : 0;
  const statesWithoutCoverage = rows.filter((row) => row.currentRps === 0).length;
  const uncoveredTam = rows
    .filter((row) => row.currentRps === 0)
    .reduce((sum, row) => sum + row.bsaTamDollarValue, 0);
  const maxNeeded = Math.max(...rows.map((row) => row.rpsNeededToAdd), 0);
  const maxTam = Math.max(...rows.map((row) => row.bsaTamDollarValue), 0);
  const maxAvgAcresPerRp = Math.max(...rows.map((row) => row.avgAcresPerRp), 0);
  const maxRps = Math.max(...rows.map((row) => row.currentRps), 0);
  const topNeeded = rows.slice(0, 10);
  const topTam = [...rows].sort((a, b) => b.bsaTamDollarValue - a.bsaTamDollarValue).slice(0, 10);
  const topAvgAcresPerRp = [...rows]
    .filter((row) => row.currentRps > 0)
    .sort((a, b) => b.avgAcresPerRp - a.avgAcresPerRp)
    .slice(0, 10);

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>
          Market Potential / Agricultural TAM Planning
        </div>
        <div className="text-xs text-[#3D654D] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Source: Agricultural Reference Data, DimReferralPartner | Agricultural acres, current RP coverage, target RP counts, and implied RP gaps
        </div>
      </div>

      <div className="bg-white border border-[#CFD5D0] p-3">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-3">
          <div>
            <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>
              Planning Assumptions
            </div>
            <div className="text-xs text-[#3D654D] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
              Source: Planning Assumptions | Revenue per acre, target acres per RP, and farms per referral partner manager
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ScenarioInput
            label="Target Acres per Referral Partner"
            value={targetAcresPerRp}
            onChange={setTargetAcresPerRp}
            helperText="Used to calculate ideal referral partner coverage by state."
          />
          <ScenarioInput
            label="Estimated Revenue per Acre"
            value={revenuePerAcre}
            onChange={setRevenuePerAcre}
            prefix="$"
            helperText="Used to estimate total TAM dollar opportunity."
          />
          <ScenarioInput
            label="Farms per Referral Partner Manager"
            value={farmsPerRpmTarget}
            onChange={setFarmsPerRpmTarget}
            helperText="Used for referral partner manager capacity planning."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
        <PowerBICard title="Total TAM Dollar Value" value={formatShort(totals.bsaTamDollarValue)} subtitle="Agricultural acres x revenue per acre" />
        <PowerBICard title="Total RPs" value={formatNumber(totals.currentRps)} subtitle="Current active referral partners" />
        <PowerBICard title="Average Acres per RP" value={formatAcresShort(totalAvgAcresPerRp)} subtitle="Covered acres divided by active RPs" />
        <PowerBICard title="States Without RP Coverage" value={formatNumber(statesWithoutCoverage)} subtitle={`${formatShort(uncoveredTam)} uncovered TAM`} />
        <PowerBICard title="Current Market Coverage %" value={formatPercent(currentMarketCoveragePct)} subtitle="Acres in states with active RP coverage" />
        <PowerBICard title="RP Coverage Gap" value={formatNumber(totals.rpsNeededToAdd)} subtitle="Additional RPs to meet target coverage" />
      </div>

      <MarketTamMap
        rows={rows}
        selectedMetric={selectedMapMetric}
        onSelectedMetricChange={setSelectedMapMetric}
        maxTam={maxTam}
        maxAvgAcresPerRp={maxAvgAcresPerRp}
        maxRps={maxRps}
      />

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-3">
        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
            Top 10 States by TAM Dollar Value
          </div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: Agricultural Reference Data, Planning Assumptions | SUM(Agricultural Acres x Revenue per Acre) by State
          </div>
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={topTam} layout="vertical" margin={{ top: 5, right: 24, left: 28, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => formatShort(Number(value))} />
              <YAxis dataKey="state" type="category" width={36} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="bsaTamDollarValue" name="TAM Dollar Value" fill="#7BBD5C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
            Top 10 States by Avg Acres per RP
          </div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: Agricultural Reference Data, DimReferralPartner | Agricultural Acres / Current RP Count by State
          </div>
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={topAvgAcresPerRp} layout="vertical" margin={{ top: 5, right: 24, left: 28, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} tickFormatter={(value) => formatAcresShort(Number(value))} />
              <YAxis dataKey="state" type="category" width={36} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => `${formatNumber(value)} acres`} />
              <Bar dataKey="avgAcresPerRp" name="Avg Acres per RP" fill="#006637" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#CFD5D0] p-4">
          <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
            Top 10 States by RP Coverage Gap
          </div>
          <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: Agricultural Reference Data, Planning Assumptions, DimReferralPartner | Target RPs minus Current RPs by State
          </div>
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={topNeeded} layout="vertical" margin={{ top: 5, right: 24, left: 28, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CFD5D0" />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <YAxis dataKey="state" type="category" width={36} tick={{ fontSize: 10, fontFamily: 'Source Sans 3, sans-serif' }} />
              <Tooltip contentStyle={{ fontFamily: 'Source Sans 3, sans-serif' }} formatter={(value: number) => formatNumber(value)} />
              <Bar dataKey="rpsNeededToAdd" name="RP Coverage Gap" fill="#234E2A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>
              State-Level Planning Table
            </div>
            <div className="text-xs text-[#3D654D] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
              Source: Agricultural Reference Data, Planning Assumptions, DimReferralPartner | State TAM, RP coverage, coverage status, and calculated planning gap
            </div>
          </div>
          <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Total TAM: {formatCurrency(totals.bsaTamDollarValue)}
          </div>
        </div>

        <div className="overflow-auto border border-[#CFD5D0]">
          <table className="w-full border-collapse min-w-[1280px]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            <thead>
              <tr className="bg-[#E6EEE7] border-b border-[#CFD5D0]">
                <th className="text-left text-xs font-semibold text-[#3D654D] px-2 py-2">State</th>
                <th className="text-right text-xs font-semibold text-[#3D654D] px-2 py-2">Agricultural Acres</th>
                <th className="text-right text-xs font-semibold text-[#3D654D] px-2 py-2">Current RPs</th>
                <th className="text-left text-xs font-semibold text-[#3D654D] px-2 py-2">Coverage Status</th>
                <th className="text-right text-xs font-semibold text-[#3D654D] px-2 py-2">Acres with RP Coverage</th>
                <th className="text-right text-xs font-semibold text-[#3D654D] px-2 py-2">Avg Acres per RP</th>
                <th className="text-right text-xs font-semibold text-[#3D654D] px-2 py-2">Target RPs</th>
                <th className="text-right text-xs font-semibold text-[#234E2A] px-2 py-2">RP Coverage Gap</th>
                <th className="text-right text-xs font-semibold text-[#3D654D] px-2 py-2">Avg Farm Size</th>
                <th className="text-right text-xs font-semibold text-[#3D654D] px-2 py-2">Farms / RPM Target</th>
                <th className="text-right text-xs font-semibold text-[#234E2A] px-2 py-2">BSA TAM Dollar Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.state} className="border-b border-[#E6EEE7] hover:bg-[#F5F7F6]">
                  <td className="px-2 py-1.5 text-xs font-semibold text-[#1A1A1A]">{row.stateName}</td>
                  <td className="text-right text-xs text-[#1A1A1A] px-2 py-1.5">{formatNumber(row.agriculturalAcres)}</td>
                  <td className="text-right text-xs text-[#1A1A1A] px-2 py-1.5">{formatNumber(row.currentRps)}</td>
                  <td className="px-2 py-1.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${row.currentRps > 0 ? 'text-[#006637]' : 'text-[#A33C1B]'}`}>
                      <span className={`h-2 w-2 rounded-full ${row.currentRps > 0 ? 'bg-[#006637]' : 'bg-[#B8AAA6]'}`} />
                      {row.coverageStatus}
                    </span>
                  </td>
                  <td className="text-right text-xs text-[#1A1A1A] px-2 py-1.5">{formatNumber(row.coveredAcres)}</td>
                  <td
                    className="text-right text-xs text-[#1A1A1A] px-2 py-1.5"
                    style={getHeatmapStyle(row.avgAcresPerRp, maxAvgAcresPerRp, 'gold')}
                  >
                    {formatNumber(row.avgAcresPerRp)}
                  </td>
                  <td className="text-right text-xs text-[#1A1A1A] px-2 py-1.5">{formatNumber(row.targetRps)}</td>
                  <td
                    className="text-right text-xs font-bold text-[#1A1A1A] px-2 py-1.5"
                    style={getHeatmapStyle(row.rpsNeededToAdd, maxNeeded, 'green', 'strong')}
                  >
                    {formatNumber(row.rpsNeededToAdd)}
                  </td>
                  <td className="text-right text-xs text-[#1A1A1A] px-2 py-1.5">{formatNumber(row.avgFarmSize)}</td>
                  <td className="text-right text-xs text-[#1A1A1A] px-2 py-1.5">{formatNumber(row.farmsPerRpmTarget)}</td>
                  <td
                    className="text-right text-xs font-bold text-[#234E2A] px-2 py-1.5"
                    style={getHeatmapStyle(row.bsaTamDollarValue, maxTam, 'gold', 'strong')}
                  >
                    {formatCurrency(row.bsaTamDollarValue)}
                  </td>
                </tr>
              ))}
              <tr className="bg-[#E6EEE7] border-t border-[#CFD5D0]">
                <td className="px-2 py-2 text-xs font-semibold text-[#1A1A1A]">Total</td>
                <td className="text-right text-xs font-semibold text-[#1A1A1A] px-2 py-2">{formatNumber(totals.agriculturalAcres)}</td>
                <td className="text-right text-xs font-semibold text-[#1A1A1A] px-2 py-2">{formatNumber(totals.currentRps)}</td>
                <td className="px-2 py-2 text-xs font-semibold text-[#3D654D]">-</td>
                <td className="text-right text-xs font-semibold text-[#1A1A1A] px-2 py-2">{formatNumber(totals.coveredAcres)}</td>
                <td className="text-right text-xs font-semibold text-[#1A1A1A] px-2 py-2">{formatNumber(totalAvgAcresPerRp)}</td>
                <td className="text-right text-xs font-semibold text-[#1A1A1A] px-2 py-2">{formatNumber(totals.targetRps)}</td>
                <td className="text-right text-xs font-bold text-[#1A1A1A] px-2 py-2">{formatNumber(totals.rpsNeededToAdd)}</td>
                <td className="text-right text-xs font-semibold text-[#1A1A1A] px-2 py-2">-</td>
                <td className="text-right text-xs font-semibold text-[#1A1A1A] px-2 py-2">{formatNumber(totals.farmsPerRpmTarget)}</td>
                <td className="text-right text-xs font-bold text-[#234E2A] px-2 py-2">{formatCurrency(totals.bsaTamDollarValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
