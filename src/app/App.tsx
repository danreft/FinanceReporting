import { useState } from 'react';
import TabNavigation from './components/TabNavigation';
import FinanceSlicers, { type FinanceFilterValue } from './components/FinanceSlicers';
import {
  BalanceSheet,
  CashFlow,
  ExceptionsReconciliation,
  FinanceOverview,
  IncomeStatement,
  RevenueRecognition,
  ReferralPartnerFinancialPerformance,
  SalesOverview,
} from './pages/FinancePages';

export default function App() {
  const [activeTab, setActiveTab] = useState('financeOverview');
  const [financeFilters, setFinanceFilters] = useState<FinanceFilterValue>({
    reportingPeriod: 'yearToDate',
    department: 'all',
    revenueSource: 'all',
    comparisonPeriod: 'priorYear',
  });

  const handleFinanceFilterChange = (filterName: keyof FinanceFilterValue, value: string) => {
    setFinanceFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'financeOverview':
        return <FinanceOverview />;
      case 'salesOverview':
        return <SalesOverview />;
      case 'revenueRecognition':
        return <RevenueRecognition />;
      case 'incomeStatement':
        return <IncomeStatement />;
      case 'balanceSheet':
        return <BalanceSheet />;
      case 'cashFlow':
        return <CashFlow />;
      case 'referralPartnerFinancialPerformance':
        return <ReferralPartnerFinancialPerformance />;
      case 'exceptionsReconciliation':
        return <ExceptionsReconciliation />;
      default:
        return <FinanceOverview />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#E6EEE7]">
      {/* Power BI Header */}
      <div className="flex-shrink-0 bg-[#006637] text-white px-6 py-3 flex items-center justify-between">
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

      {/* Tab Navigation */}
      <div className="flex-shrink-0">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Global Slicers Sidebar */}
        <FinanceSlicers filters={financeFilters} onFilterChange={handleFinanceFilterChange} />

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
}
