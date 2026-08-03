import { useMemo, useState } from 'react';
import TabNavigation from './components/TabNavigation';
import GlobalSlicers from './components/GlobalSlicers';
import FinanceSlicers, { type FinanceFilterValue } from './components/FinanceSlicers';
import type { TimeFrameValue } from './components/TimeFrameSlicer';
import type { RpmFilterValue } from './components/RpmSlicer';
import ExecutiveOverview from './pages/ExecutiveOverview';
import RPOverview from './pages/RPOverview';
import NonRPOverview from './pages/NonRPOverview';
import PartnerPerformance from './pages/PartnerPerformance';
import DealPipeline from './pages/DealPipeline';
import RPPlusNetwork from './pages/RPPlusNetwork';
import RPMPerformance from './pages/RPMPerformance';
import MarketPotential from './pages/MarketPotential';
import DataIntegrity from './pages/DataIntegrity';
import { generateMockDataV3Updated } from './data/mockDataV3Updated';
import {
  BalanceSheet,
  CashFlow,
  ExceptionsReconciliation,
  FinanceOverview,
  IncomeStatement,
  RevenueRecognition,
  RPFinancials,
  SalesLifecycle,
} from './pages/FinancePages';

// Use V3 Updated Mock Data (Geography-Enabled)

export default function App() {
  const [activeTab, setActiveTab] = useState('executive');
  const [filters, setFilters] = useState<{ timeFrame: TimeFrameValue; rpm: RpmFilterValue; [key: string]: any }>({
    timeFrame: { selectedMonths: [], useCustom: false },
    businessType: 'all',
    tier: 'all',
    dealStage: 'all',
    rpm: { rpm: 'all', associate: 'all' },
    dealValueRange: 'all',
    acresRange: 'all',
    stateRegion: 'all',
  });
  const [financeFilters, setFinanceFilters] = useState<FinanceFilterValue>({
    reportingPeriod: 'yearToDate',
    department: 'all',
    revenueSource: 'all',
    comparisonPeriod: 'priorYear',
  });

  const mockData = useMemo(() => generateMockDataV3Updated(filters), [filters]);
  const financeTabs = [
    'financeOverview',
    'incomeStatement',
    'revenueRecognition',
    'salesLifecycle',
    'balanceSheet',
    'cashFlow',
    'rpFinancials',
    'exceptionsReconciliation',
  ];
  const isFinanceTab = financeTabs.includes(activeTab);

  const handleFilterChange = (filterName: string, value: string | TimeFrameValue | RpmFilterValue) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };
  const handleFinanceFilterChange = (filterName: keyof FinanceFilterValue, value: string) => {
    setFinanceFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'executive':
        return <ExecutiveOverview data={mockData.executive} />;
      case 'rpOverview':
        return <RPOverview data={mockData.rpOverview} />;
      case 'nonRpOverview':
        return <NonRPOverview data={mockData.nonRpOverview} />;
      case 'partners':
        return <PartnerPerformance data={mockData.partners} />;
      case 'pipeline':
        return <DealPipeline data={mockData.pipeline} />;
      case 'rpplus':
        return <RPPlusNetwork data={mockData.rpPlus} />;
      case 'rpmPerformance':
        return <RPMPerformance data={mockData.rpmPerformance} />;
      case 'marketPotential':
        return <MarketPotential data={mockData.marketPotential} />;
      case 'dataIntegrity':
        return <DataIntegrity data={mockData.executive} />;
      case 'financeOverview':
        return <FinanceOverview />;
      case 'incomeStatement':
        return <IncomeStatement />;
      case 'revenueRecognition':
        return <RevenueRecognition />;
      case 'salesLifecycle':
        return <SalesLifecycle />;
      case 'balanceSheet':
        return <BalanceSheet />;
      case 'cashFlow':
        return <CashFlow />;
      case 'rpFinancials':
        return <RPFinancials />;
      case 'exceptionsReconciliation':
        return <ExceptionsReconciliation />;
      default:
        return <ExecutiveOverview data={mockData.executive} />;
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
            Referral Partner Performance
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Last Refreshed: Apr 24, 2026, 8:15 AM
          </div>
          <div className="text-xs opacity-80" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Data Source: Pipedrive + Referral Partner Mapping
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
        {isFinanceTab ? (
          <FinanceSlicers filters={financeFilters} onFilterChange={handleFinanceFilterChange} />
        ) : (
          <GlobalSlicers filters={filters} onFilterChange={handleFilterChange} />
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
}
