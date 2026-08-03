import { useState } from 'react';
import type { MouseEvent } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import usStatesTopology from '../data/us-states-10m.json';
import { rpmRegionByState } from '../data/mockDataV3Updated';

interface RPMTerritoryMapProps {
  stateDealValues?: Array<{ state: string; value: number }>;
}

const rpmColors: Record<string, string> = {
  'Clayton Mason': '#2F7641',
  'Dave Stamp': '#D9739F',
  'James St. Peter': '#A33C1B',
  'Max Davis': '#8B5A2B',
  'Nicolas Post': '#5BC0DE',
  'Reagan Gross': '#305C9E',
};

// Bridges the full state names used by the map topology (geo.properties.name)
// to the USPS abbreviations used by rpmRegionByState and the partner records.
const abbrByFullName: Record<string, string> = {
  Washington: 'WA', Oregon: 'OR', California: 'CA', Nevada: 'NV', Idaho: 'ID', Utah: 'UT', Arizona: 'AZ',
  Montana: 'MT', Wyoming: 'WY', 'North Dakota': 'ND', 'South Dakota': 'SD', Colorado: 'CO',
  Minnesota: 'MN', Iowa: 'IA', Nebraska: 'NE', Kansas: 'KS', Missouri: 'MO', Wisconsin: 'WI', Illinois: 'IL', Michigan: 'MI',
  'New Mexico': 'NM', Texas: 'TX', Oklahoma: 'OK', Louisiana: 'LA', Mississippi: 'MS',
  Arkansas: 'AR', Tennessee: 'TN', Kentucky: 'KY', Alabama: 'AL', Georgia: 'GA', Florida: 'FL',
  'South Carolina': 'SC', 'North Carolina': 'NC',
  Indiana: 'IN', Ohio: 'OH', 'West Virginia': 'WV', Virginia: 'VA', Pennsylvania: 'PA', 'New York': 'NY',
  'New Jersey': 'NJ', Delaware: 'DE', Maryland: 'MD', Connecticut: 'CT', 'Rhode Island': 'RI',
  Massachusetts: 'MA', Vermont: 'VT', 'New Hampshire': 'NH', Maine: 'ME', 'District of Columbia': 'DC',
};

const formatCurrency = (value: number) => `$${Number(value ?? 0).toLocaleString()}`;

export default function RPMTerritoryMap({ stateDealValues = [] }: RPMTerritoryMapProps) {
  const [tooltip, setTooltip] = useState<{ content: { label: string; value: string }[]; x: number; y: number } | null>(null);

  const valueByState = stateDealValues.reduce<Record<string, number>>((lookup, row) => {
    lookup[row.state] = row.value;
    return lookup;
  }, {});

  const handleStateMouseMove = (event: MouseEvent<SVGPathElement>, stateName: string) => {
    const abbr = abbrByFullName[stateName];
    const assignment = abbr ? rpmRegionByState[abbr] : undefined;
    if (!assignment) return;

    const stateValue = valueByState[abbr] ?? 0;
    const regionValue = Object.entries(rpmRegionByState)
      .filter(([, info]) => info.region === assignment.region)
      .reduce((sum, [stateAbbr]) => sum + (valueByState[stateAbbr] ?? 0), 0);

    setTooltip({
      x: event.clientX + 14,
      y: event.clientY + 14,
      content: [
        { label: stateName, value: formatCurrency(stateValue) },
        { label: `${assignment.region} Region`, value: formatCurrency(regionValue) },
        { label: 'RPM', value: assignment.rpm },
      ],
    });
  };

  return (
    <div className="bg-white border border-[#CFD5D0] p-4">
      <div className="text-sm font-semibold text-[#006637] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
        Deal Value by State, Region, &amp; RPM
      </div>
      <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        Source: FactDeals, DimReferralPartner | State fill = designated RPM territory
      </div>
      <div className="relative">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 900 }}
          width={800}
          height={320}
          style={{ width: '100%', height: '320px' }}
        >
          <Geographies geography={usStatesTopology}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name;
                const abbr = abbrByFullName[stateName];
                const assignment = abbr ? rpmRegionByState[abbr] : undefined;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={assignment ? rpmColors[assignment.rpm] : '#EEF2EF'}
                    fillOpacity={0.85}
                    stroke="#FFFFFF"
                    strokeWidth={0.8}
                    onMouseMove={(event) => handleStateMouseMove(event, stateName)}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fillOpacity: 1 },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {tooltip && (
          <div
            className="fixed bg-white border border-[#9FAEA4] p-3 shadow-md pointer-events-none z-20 w-[210px]"
            style={{ fontFamily: 'Source Sans 3, sans-serif', left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.content.map((row, index) => (
              <div key={index} className={`flex items-center justify-between gap-3 ${index > 0 ? 'mt-1.5' : ''}`}>
                <span className={index === 0 ? 'text-xs font-semibold text-[#006637]' : 'text-xs text-[#3D654D]'}>{row.label}</span>
                <span className="text-xs font-semibold text-[#1A1A1A]">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        <span className="font-semibold">Legend</span>
        {Object.entries(rpmColors).map(([name, color]) => (
          <div key={name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
