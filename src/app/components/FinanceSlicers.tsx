import PowerBISlicer from './PowerBISlicer';

export interface FinanceFilterValue {
  reportingPeriod: string;
  department: string;
  revenueSource: string;
  comparisonPeriod: string;
}

interface FinanceSlicersProps {
  filters: FinanceFilterValue;
  onFilterChange: (filterName: keyof FinanceFilterValue, value: string) => void;
}

export default function FinanceSlicers({ filters, onFilterChange }: FinanceSlicersProps) {
  return (
    <div className="bg-[#F5F7F6] border-r border-[#CFD5D0] p-3 space-y-3 overflow-y-auto flex-shrink-0" style={{ width: '220px' }}>
      <div className="text-xs font-semibold text-[#006637] mb-3 uppercase tracking-wide" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        Filters
      </div>

      <PowerBISlicer
        title="Reporting Period"
        value={filters.reportingPeriod}
        onChange={(value) => onFilterChange('reportingPeriod', value)}
        options={[
          { value: 'thisMonth', label: 'This Month' },
          { value: 'lastMonth', label: 'Last Month' },
          { value: 'thisQuarter', label: 'This Quarter' },
          { value: 'yearToDate', label: 'Year to Date' },
          { value: 'priorYear', label: 'Prior Year' },
          { value: 'custom', label: 'Custom' },
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
        title="Revenue Source"
        value={filters.revenueSource}
        onChange={(value) => onFilterChange('revenueSource', value)}
        options={[
          { value: 'all', label: 'All Revenue Sources' },
          { value: 'directSales', label: 'Direct Sales' },
          { value: 'referralPartner', label: 'Referral Partner' },
        ]}
      />

      <PowerBISlicer
        title="Comparison Period"
        value={filters.comparisonPeriod}
        onChange={(value) => onFilterChange('comparisonPeriod', value)}
        options={[
          { value: 'priorMonth', label: 'Prior Month' },
          { value: 'priorQuarter', label: 'Prior Quarter' },
          { value: 'priorYear', label: 'Prior Year' },
          { value: 'budget', label: 'Budget' },
        ]}
      />
    </div>
  );
}
