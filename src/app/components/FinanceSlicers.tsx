import PowerBISlicer from './PowerBISlicer';

export type ReportingDateRange = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'yearToDate';

export interface FinanceFilterValue {
  dateRange: ReportingDateRange;
}

interface FinanceSlicersProps {
  filters: FinanceFilterValue;
  onFilterChange: (filterName: keyof FinanceFilterValue, value: FinanceFilterValue[keyof FinanceFilterValue]) => void;
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
        onChange={(value) => onFilterChange('dateRange', value as ReportingDateRange)}
        options={[
          { value: 'thisMonth', label: 'This Month' },
          { value: 'lastMonth', label: 'Last Month' },
          { value: 'thisQuarter', label: 'This Quarter' },
          { value: 'yearToDate', label: 'Year to Date' },
        ]}
      />

      <div className="bg-white border border-[#CFD5D0] p-3">
        <div className="text-xs font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Filter Pane
        </div>
        <div className="text-xs text-[#3D654D] leading-4" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Department, Source, Customer, RP/RPM, and other secondary filters are modeled as Power BI filter pane fields.
        </div>
      </div>
    </div>
  );
}
