import PowerBISlicer from './PowerBISlicer';
import TimeFrameSlicer, { type TimeFrameValue } from './TimeFrameSlicer';
import RpmSlicer, { type RpmFilterValue } from './RpmSlicer';

interface GlobalSlicersProps {
  filters: {
    timeFrame: TimeFrameValue;
    businessType: string;
    tier: string;
    dealStage: string;
    rpm: RpmFilterValue;
    dealValueRange: string;
    acresRange: string;
    stateRegion: string;
  };
  onFilterChange: (filterName: string, value: string | TimeFrameValue | RpmFilterValue) => void;
}

export default function GlobalSlicers({ filters, onFilterChange }: GlobalSlicersProps) {
  return (
    <div className="bg-[#F5F7F6] border-r border-[#CFD5D0] p-3 space-y-3 overflow-y-auto flex-shrink-0" style={{ width: '220px' }}>
      <div className="text-xs font-semibold text-[#006637] mb-3 uppercase tracking-wide" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        Filters
      </div>

      <TimeFrameSlicer
        value={filters.timeFrame}
        onChange={(value) => onFilterChange('timeFrame', value)}
      />

      <PowerBISlicer
        title="Business Type"
        value={filters.businessType}
        onChange={(value) => onFilterChange('businessType', value)}
        options={[
          { value: 'all', label: 'All' },
          { value: 'general', label: 'General Referral Source' },
          { value: 'individual', label: 'Individual / Small Business' },
          { value: 'corporation', label: 'Corporation' },
          { value: 'strategic', label: 'Strategic Partner' },
          { value: 'regional', label: 'Regional Affiliate' },
        ]}
      />

      <PowerBISlicer
        title="Tier"
        value={filters.tier}
        onChange={(value) => onFilterChange('tier', value)}
        options={[
          { value: 'all', label: 'All' },
          { value: 'rp', label: 'RP' },
          { value: 'rp+', label: 'RP+' },
        ]}
      />

      <PowerBISlicer
        title="Deal Stage"
        value={filters.dealStage}
        onChange={(value) => onFilterChange('dealStage', value)}
        options={[
          { value: 'all', label: 'All' },
          { value: 'contact_information', label: 'Contact Information' },
          { value: 'invitation_sent', label: 'Invitation Sent' },
          { value: 'rfs_submitted', label: 'RFS Submitted' },
          { value: 'agreement_sent', label: 'Agreement Sent' },
          { value: 'soil_data_collection', label: 'Soil Data Collection' },
          { value: 'analyst_team', label: 'Analyst Team' },
          { value: 'report_complete_not_paid', label: 'Report Complete | Not Paid' },
        ]}
      />

      <RpmSlicer
        value={filters.rpm}
        onChange={(value) => onFilterChange('rpm', value)}
      />

      <PowerBISlicer
        title="Deal Value Range"
        value={filters.dealValueRange}
        onChange={(value) => onFilterChange('dealValueRange', value)}
        options={[
          { value: 'all', label: 'All' },
          { value: '0-50k', label: '$0 - $50K' },
          { value: '50k-100k', label: '$50K - $100K' },
          { value: '100k-250k', label: '$100K - $250K' },
          { value: '250k+', label: '$250K+' },
        ]}
      />

      <PowerBISlicer
        title="Acres Range"
        value={filters.acresRange}
        onChange={(value) => onFilterChange('acresRange', value)}
        options={[
          { value: 'all', label: 'All' },
          { value: '0-1000', label: '0 - 1,000' },
          { value: '1000-2500', label: '1,000 - 2,500' },
          { value: '2500-5000', label: '2,500 - 5,000' },
          { value: '5000+', label: '5,000+' },
        ]}
      />

      <PowerBISlicer
        title="State / Region"
        value={filters.stateRegion}
        onChange={(value) => onFilterChange('stateRegion', value)}
        options={[
          { value: 'all', label: 'All' },
          { value: 'ia', label: 'Iowa' },
          { value: 'ne', label: 'Nebraska' },
          { value: 'mo', label: 'Missouri' },
          { value: 'sd', label: 'South Dakota' },
          { value: 'nd', label: 'North Dakota' },
          { value: 'mn', label: 'Minnesota' },
          { value: 'il', label: 'Illinois' },
          { value: 'in', label: 'Indiana' },
          { value: 'oh', label: 'Ohio' },
          { value: 'ks', label: 'Kansas' },
          { value: 'wi', label: 'Wisconsin' },
          { value: 'co', label: 'Colorado' },
          { value: 'tx', label: 'Texas' },
          { value: 'ca', label: 'California' },
        ]}
      />
    </div>
  );
}
