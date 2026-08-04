import PowerBISlicer from './PowerBISlicer';

export interface FinanceFilterValue {
  dateRange: string;
  department: string;
  source: string;
}

interface FinanceSlicersProps {
  filters: FinanceFilterValue;
  onFilterChange: (filterName: keyof FinanceFilterValue, value: string) => void;
}

export default function FinanceSlicers({ filters, onFilterChange }: FinanceSlicersProps) {
  return (
    <div className="bg-[#F5F7F6] border-r border-[#CFD5D0] p-3 space-y-3 overflow-hidden flex-shrink-0" style={{ width: '220px' }}>
      <div className="text-xs font-semibold text-[#006637] mb-3 uppercase tracking-wide" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        Filters
      </div>

      <PowerBISlicer
        title="Reporting Period"
        value={filters.dateRange}
        onChange={(value) => onFilterChange('dateRange', value)}
        options={[
          { value: 'thisMonth', label: 'This Month' },
          { value: 'lastMonth', label: 'Last Month' },
          { value: 'thisQuarter', label: 'This Quarter' },
          { value: 'yearToDate', label: 'Year to Date' },
          { value: 'priorYear', label: 'Prior Year' },
        ]}
      />

      <PowerBISlicer
        title="Department"
        value={filters.department}
        onChange={(value) => onFilterChange('department', value)}
        options={[
          { value: 'all', label: 'All Departments' },
          { value: 'sales', label: 'Sales' },
          { value: 'rpNetwork', label: 'Referral Partner Network' },
          { value: 'soilOperations', label: 'Soil Operations' },
          { value: 'reporting', label: 'Reporting' },
          { value: 'ga', label: 'General and Administrative' },
        ]}
      />

      <PowerBISlicer
        title="Source"
        value={filters.source}
        onChange={(value) => onFilterChange('source', value)}
        options={[
          { value: 'all', label: 'All Sources' },
          { value: 'directSourced', label: 'Direct-Sourced' },
          { value: 'rpSourced', label: 'RP-Sourced' },
        ]}
      />
    </div>
  );
}
