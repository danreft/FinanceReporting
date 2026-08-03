import { useState } from 'react';
import type { MouseEvent } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import usStatesTopology from '../data/us-states-10m.json';

interface USPartnerMapProps {
  partnerLocations: Array<{
    referralPartnerId: string;
    referralPartnerName: string;
    name: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    lat: number;
    lng: number;
    totalDealValue: number;
    dealValue: number;
    dealCount: number;
    acres: number;
    averageDealValue: number;
    isConciergeRp: boolean;
    activeStatus: string;
  }>;
}

export default function USPartnerMap({ partnerLocations }: USPartnerMapProps) {
  const [bubbleSizeBy, setBubbleSizeBy] = useState<'dealValue' | 'dealCount' | 'acres'>('dealValue');
  const [rpTypeFilter, setRpTypeFilter] = useState<'all' | 'concierge' | 'standard'>('all');
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

  const filteredLocations = partnerLocations.filter((location) => {
    if (rpTypeFilter === 'concierge') return location.isConciergeRp;
    if (rpTypeFilter === 'standard') return !location.isConciergeRp;
    return true;
  });
  const conciergeCount = partnerLocations.filter((location) => location.isConciergeRp).length;
  const standardCount = partnerLocations.length - conciergeCount;

  const getMarkerSize = (location: typeof partnerLocations[0]) => {
    const list = filteredLocations.length ? filteredLocations : partnerLocations;
    const value = location[bubbleSizeBy];
    if (!list.length || value <= 0) return 4;
    const max = Math.max(...list.map(l => l[bubbleSizeBy]));
    const min = Math.min(...list.map(l => l[bubbleSizeBy]));
    if (max === min) return 8;

    const normalized = (value - min) / (max - min);
    return 4 + normalized * 14; // Size range: 4 to 18
  };

  const metricLabels = {
    dealValue: 'Deal Value',
    dealCount: 'Deal Count',
    acres: 'Acres',
  };

  const formatSelectedMetric = (location: typeof partnerLocations[0]) => {
    const value = location[bubbleSizeBy];
    if (bubbleSizeBy === 'dealValue') return `$${value.toLocaleString()}`;
    if (bubbleSizeBy === 'acres') return value.toLocaleString();
    return value.toLocaleString();
  };

  const handleMarkerMouseMove = (event: MouseEvent<SVGCircleElement>, location: typeof partnerLocations[0]) => {
    const typeLabel = location.isConciergeRp ? 'Concierge RP' : 'Standard RP';
    setTooltip({
      x: event.clientX + 14,
      y: event.clientY + 14,
      content: `${location.referralPartnerName}\n${typeLabel}\n${location.city}, ${location.state}\n${metricLabels[bubbleSizeBy]}: ${formatSelectedMetric(location)}\nDeal Count: ${location.dealCount.toLocaleString()}\nTotal Deal Value: $${location.totalDealValue.toLocaleString()}\nAcres: ${location.acres.toLocaleString()}`,
    });
  };

  const handleMarkerMouseLeave = () => {
    setTooltip(null);
  };

  const getPartnerTypeFill = (location: typeof partnerLocations[0]) => {
    return location.isConciergeRp ? '#006637' : '#56708F';
  };

  const getPartnerTypeStroke = (location: typeof partnerLocations[0]) => {
    return location.isConciergeRp ? '#234E2A' : '#56708F';
  };

  return (
    <div className="bg-white border border-[#CFD5D0] p-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-3 gap-3">
        <div>
          <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>
            U.S. Referral Partner Location Map
          </div>
          <div className="text-xs text-[#3D654D] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Source: DimReferralPartner, FactDeals | Bubble size = selected metric, bubble color = Concierge RP vs Standard RP
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setBubbleSizeBy('dealValue')}
            className={`px-2 py-1 text-xs rounded ${
              bubbleSizeBy === 'dealValue'
                ? 'bg-[#006637] text-white'
                : 'bg-[#E6EEE7] text-[#3D654D] hover:bg-[#CFD5D0]'
            }`}
            style={{ fontFamily: 'Source Sans 3, sans-serif' }}
          >
            Deal Value
          </button>
          <button
            onClick={() => setBubbleSizeBy('dealCount')}
            className={`px-2 py-1 text-xs rounded ${
              bubbleSizeBy === 'dealCount'
                ? 'bg-[#006637] text-white'
                : 'bg-[#E6EEE7] text-[#3D654D] hover:bg-[#CFD5D0]'
            }`}
            style={{ fontFamily: 'Source Sans 3, sans-serif' }}
          >
            Deal Count
          </button>
          <button
            onClick={() => setBubbleSizeBy('acres')}
            className={`px-2 py-1 text-xs rounded ${
              bubbleSizeBy === 'acres'
                ? 'bg-[#006637] text-white'
                : 'bg-[#E6EEE7] text-[#3D654D] hover:bg-[#CFD5D0]'
            }`}
            style={{ fontFamily: 'Source Sans 3, sans-serif' }}
          >
            Acres
          </button>
          <button
            onClick={() => setRpTypeFilter('all')}
            className={`px-2 py-1 text-xs rounded ${
              rpTypeFilter === 'all'
                ? 'bg-[#006637] text-white'
                : 'bg-[#E6EEE7] text-[#3D654D] hover:bg-[#CFD5D0]'
            }`}
            style={{ fontFamily: 'Source Sans 3, sans-serif' }}
          >
            All RPs
          </button>
          <button
            onClick={() => setRpTypeFilter('concierge')}
            className={`px-2 py-1 text-xs rounded ${
              rpTypeFilter === 'concierge'
                ? 'bg-[#006637] text-white'
                : 'bg-[#E6EEE7] text-[#3D654D] hover:bg-[#CFD5D0]'
            }`}
            style={{ fontFamily: 'Source Sans 3, sans-serif' }}
          >
            Concierge RPs
          </button>
          <button
            onClick={() => setRpTypeFilter('standard')}
            className={`px-2 py-1 text-xs rounded ${
              rpTypeFilter === 'standard'
                ? 'bg-[#006637] text-white'
                : 'bg-[#E6EEE7] text-[#3D654D] hover:bg-[#CFD5D0]'
            }`}
            style={{ fontFamily: 'Source Sans 3, sans-serif' }}
          >
            Standard RPs
          </button>
        </div>
      </div>
      <div className="text-xs text-[#3D654D] mb-3" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        Showing {filteredLocations.length} of {partnerLocations.length} referral partners | Bubble size: {metricLabels[bubbleSizeBy]}
      </div>
      <div className="relative">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{
            scale: 900,
          }}
          width={800}
          height={320}
          style={{ width: '100%', height: '320px' }}
        >
          <ZoomableGroup center={[-96, 40]} zoom={1}>
            <Geographies geography={usStatesTopology}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#E6EEE7"
                    stroke="#CFD5D0"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#D9E4DA' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            {filteredLocations.map((location, index) => (
              <Marker key={index} coordinates={[location.lng, location.lat]}>
                <circle
                  r={getMarkerSize(location)}
                  fill={getPartnerTypeFill(location)}
                  stroke={getPartnerTypeStroke(location)}
                  strokeWidth={1}
                  fillOpacity={0.78}
                  style={{ cursor: 'pointer' }}
                  onMouseMove={(event) => handleMarkerMouseMove(event, location)}
                  onMouseLeave={handleMarkerMouseLeave}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
        {filteredLocations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75">
            <div className="border border-[#CFD5D0] bg-white px-4 py-3 text-center shadow-sm">
              <div className="text-sm font-semibold text-[#006637]" style={{ fontFamily: 'Merriweather, serif' }}>
                No referral partners to map
              </div>
              <div className="text-xs text-[#3D654D] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                Adjust the map type filter or global slicers.
              </div>
            </div>
          </div>
        )}
        {tooltip && (
          <div
            className="fixed bg-white border border-[#CFD5D0] p-3 shadow-md pointer-events-none z-20 max-w-[240px]"
            style={{
              fontFamily: 'Source Sans 3, sans-serif',
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            {tooltip.content.split('\n').map((line, i) => (
              <div key={i} className={i === 0 ? 'text-xs font-semibold text-[#006637]' : i === 1 ? 'text-xs text-[#3D654D]' : 'text-xs text-[#1A1A1A]'}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        <span className="font-semibold">Legend</span>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#006637] border border-[#234E2A]" />
          Concierge RP ({conciergeCount})
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#56708F] border border-[#56708F]" />
          Standard RP ({standardCount})
        </div>
        <div className="text-[#3D654D]">Size = {metricLabels[bubbleSizeBy]}</div>
      </div>
    </div>
  );
}
