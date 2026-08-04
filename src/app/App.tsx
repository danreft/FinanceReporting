import { useState } from 'react';
import TabNavigation from './components/TabNavigation';
import FinanceSlicers, { type FinanceFilterValue } from './components/FinanceSlicers';
import {
  BalanceSheet,
  CashFlow,
  ExceptionReporting,
  ExecutiveSnapshot,
  IncomeStatement,
  RevenueRecognition,
} from './pages/FinancePages';

export default function App() {
  const [activeTab, setActiveTab] = useState('executiveSnapshot');
  const [financeFilters, setFinanceFilters] = useState<FinanceFilterValue>({
    dateRange: 'yearToDate',
    department: 'all',
    source: 'all',
  });

  const handleFinanceFilterChange = (filterName: keyof FinanceFilterValue, value: string) => {
    setFinanceFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'executiveSnapshot':
        return <ExecutiveSnapshot />;
      case 'incomeStatement':
        return <IncomeStatement />;
      case 'balanceSheet':
        return <BalanceSheet />;
      case 'cashFlow':
        return <CashFlow />;
      case 'revenueRecognition':
        return <RevenueRecognition />;
      case 'exceptionReporting':
        return <ExceptionReporting />;
      default:
        return <ExecutiveSnapshot />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#E6EEE7]">
      {/* Power BI Header */}
      <div className="app-chrome flex-shrink-0 bg-[#006637] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#7BBD5C] flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="11" width="4" height="11" />
              <rect x="8" y="6" width="4" height="16" />
              <rect x="14" y="2" width="4" height="20" />
              <rect x="20" y="8" width="4" height="14" />
            </svg>
          </div>
          <span className="font-semibold text-lg" style={{ fontFamily: 'Merriweather, serif' }}>
            Finance Reporting
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Last Refreshed: Apr 24, 2026, 8:15 AM
          </div>
          <div className="text-xs opacity-80" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Data Source: Finance Reporting Data Model
          </div>
        </div>
      </div>

      {/* Power BI implementation metadata: page navigator or buttons with page-navigation actions. */}
      <div className="app-chrome flex-shrink-0">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Power BI implementation metadata: global slicer pane using synchronized native slicers. */}
      <div className="flex flex-1 min-h-0">
        {/* Global Slicers Sidebar */}
        <div className="app-chrome">
          <FinanceSlicers filters={financeFilters} onFilterChange={handleFinanceFilterChange} />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
}
