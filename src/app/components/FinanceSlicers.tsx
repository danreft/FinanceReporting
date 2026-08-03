import PowerBISlicer from './PowerBISlicer';

export interface FinanceFilterValue {
  dateRange: string;
  month: string;
  quarter: string;
  year: string;
  department: string;
  revenueSource: string;
  referralPartner: string;
  salesperson: string;
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
        title="Date Range"
        value={filters.dateRange}
        onChange={(value) => onFilterChange('dateRange', value)}
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
        title="Month"
        value={filters.month}
        onChange={(value) => onFilterChange('month', value)}
        options={[
          { value: 'all', label: 'All Months' },
          { value: 'jan', label: 'January' },
          { value: 'feb', label: 'February' },
          { value: 'mar', label: 'March' },
          { value: 'apr', label: 'April' },
          { value: 'may', label: 'May' },
          { value: 'jun', label: 'June' },
        ]}
      />

      <PowerBISlicer
        title="Quarter"
        value={filters.quarter}
        onChange={(value) => onFilterChange('quarter', value)}
        options={[
          { value: 'all', label: 'All Quarters' },
          { value: 'q1', label: 'Q1' },
          { value: 'q2', label: 'Q2' },
          { value: 'q3', label: 'Q3' },
          { value: 'q4', label: 'Q4' },
        ]}
      />

      <PowerBISlicer
        title="Year"
        value={filters.year}
        onChange={(value) => onFilterChange('year', value)}
        options={[
          { value: '2026', label: '2026' },
          { value: '2025', label: '2025' },
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
        title="Referral Partner"
        value={filters.referralPartner}
        onChange={(value) => onFilterChange('referralPartner', value)}
        options={[
          { value: 'all', label: 'All Referral Partners' },
          { value: 'prairieGrowth', label: 'Prairie Growth Advisors' },
          { value: 'harvestRidge', label: 'Harvest Ridge Partners' },
          { value: 'dakotaLand', label: 'Dakota Land Network' },
          { value: 'none', label: 'None' },
        ]}
      />

      <PowerBISlicer
        title="Salesperson"
        value={filters.salesperson}
        onChange={(value) => onFilterChange('salesperson', value)}
        options={[
          { value: 'all', label: 'All Salespeople' },
          { value: 'sarahKeller', label: 'Sarah Keller' },
          { value: 'marcusLee', label: 'Marcus Lee' },
          { value: 'ninaPatel', label: 'Nina Patel' },
          { value: 'direct', label: 'Direct' },
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
