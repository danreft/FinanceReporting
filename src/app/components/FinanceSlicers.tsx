export type ReportingDateRange =
  | 'currentMonth'
  | 'previousMonth'
  | 'currentQuarter'
  | 'previousQuarter'
  | 'yearToDate'
  | 'previousYearToDate'
  | 'currentFiscalYear'
  | 'previousFiscalYear'
  | 'rolling12Months'
  | 'custom';

export type RevenueSource = 'allSources' | 'rpSourced' | 'directSourced';

export interface FinanceFilterValue {
  reportingPeriod: ReportingDateRange;
  revenueSource: RevenueSource;
  customStart: string;
  customEnd: string;
}

interface FinanceSlicersProps {
  filters: FinanceFilterValue;
  onFilterChange: (filterName: keyof FinanceFilterValue, value: FinanceFilterValue[keyof FinanceFilterValue]) => void;
}

const reportingPeriodOptions: { value: ReportingDateRange; label: string }[] = [
  { value: 'currentMonth', label: 'Current Month' },
  { value: 'previousMonth', label: 'Previous Month' },
  { value: 'currentQuarter', label: 'Current Quarter' },
  { value: 'previousQuarter', label: 'Previous Quarter' },
  { value: 'yearToDate', label: 'Year to Date (YTD)' },
  { value: 'previousYearToDate', label: 'Previous Year to Date' },
  { value: 'currentFiscalYear', label: 'Current Fiscal Year' },
  { value: 'previousFiscalYear', label: 'Previous Fiscal Year' },
  { value: 'rolling12Months', label: 'Rolling 12 Months' },
  { value: 'custom', label: 'Custom' },
];

const revenueSourceOptions: { value: RevenueSource; label: string }[] = [
  { value: 'allSources', label: 'All Sources' },
  { value: 'rpSourced', label: 'RP-Sourced' },
  { value: 'directSourced', label: 'Direct-Sourced' },
];

const selectClass = 'h-8 w-full border border-[#B8C4BC] bg-white px-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#7BBD5C]';
const inputClass = 'h-7 w-full border border-[#B8C4BC] bg-white px-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#006637]';
const labelStyle = { fontFamily: 'Source Sans 3, sans-serif' } as const;

export default function FinanceSlicers({ filters, onFilterChange }: FinanceSlicersProps) {
  return (
    <div className="h-full w-[240px] flex-shrink-0 space-y-4 overflow-auto border-r border-[#CFD5D0] bg-[#F5F7F6] p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-[#006637]" style={labelStyle}>
        Filters
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#3D654D]" style={labelStyle}>
          Reporting Period
        </label>
        <select
          value={filters.reportingPeriod}
          onChange={(event) => onFilterChange('reportingPeriod', event.target.value as ReportingDateRange)}
          className={selectClass}
          style={labelStyle}
        >
          {reportingPeriodOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        {filters.reportingPeriod === 'custom' && (
          <div className="mt-2 border border-[#B8C4BC] bg-white p-2 shadow-sm">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#3D654D]" style={labelStyle}>
              Between
            </div>
            <div className="grid gap-2">
              <div className="min-w-0">
                <div className="mb-1 text-[11px] text-[#3D654D]" style={labelStyle}>Start date</div>
                <input
                  type="date"
                  value={filters.customStart}
                  onChange={(event) => onFilterChange('customStart', event.target.value)}
                  className={inputClass}
                  style={labelStyle}
                />
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-[11px] text-[#3D654D]" style={labelStyle}>End date</div>
                <input
                  type="date"
                  value={filters.customEnd}
                  onChange={(event) => onFilterChange('customEnd', event.target.value)}
                  className={inputClass}
                  style={labelStyle}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#3D654D]" style={labelStyle}>
          Revenue Source
        </label>
        <select
          value={filters.revenueSource}
          onChange={(event) => onFilterChange('revenueSource', event.target.value as RevenueSource)}
          className={selectClass}
          style={labelStyle}
        >
          {revenueSourceOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
