interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'executive', label: 'Executive Overview' },
  { id: 'rpOverview', label: 'RP Overview' },
  { id: 'nonRpOverview', label: 'Non-RP Overview' },
  { id: 'partners', label: 'Partner Performance' },
  { id: 'pipeline', label: 'Deal Pipeline' },
  { id: 'rpplus', label: 'RP+ Network' },
  { id: 'rpmPerformance', label: 'RPM Performance' },
  { id: 'marketPotential', label: 'Market Potential' },
  { id: 'dataIntegrity', label: 'Data Integrity' },
  { id: 'financeOverview', label: 'Finance Overview' },
  { id: 'incomeStatement', label: 'Income Statement' },
  { id: 'revenueRecognition', label: 'Revenue Recognition' },
  { id: 'salesLifecycle', label: 'Sales Lifecycle' },
  { id: 'balanceSheet', label: 'Balance Sheet' },
  { id: 'cashFlow', label: 'Cash Flow' },
  { id: 'rpFinancials', label: 'RP Financials' },
  { id: 'exceptionsReconciliation', label: 'Exceptions' },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white border-b border-[#CFD5D0] px-6">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm leading-[18px] font-semibold transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-[#006637] border-[#006637] bg-[#E6EEE7]'
                : 'text-[#3D654D] border-transparent hover:bg-[#F5F7F6]'
            }`}
            style={{ fontFamily: 'Source Sans 3, sans-serif' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
