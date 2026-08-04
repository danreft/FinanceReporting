export type PowerBIReplicabilityStatus =
  | 'Fully Replicable'
  | 'Replicable with Bookmarks'
  | 'Replicable with Drillthrough'
  | 'Paginated Report Recommended'
  | 'Custom Visual Assessment Needed'
  | 'Redesign Required';

export interface PowerBIImplementationMetadata {
  page: string;
  element: string;
  recommendedVisual: string;
  implementationApproach: string;
  requiredMeasures: string[];
  expectedInteraction: string;
  knownLimitation: string;
  replicabilityStatus: PowerBIReplicabilityStatus;
}

// Internal Power BI implementation metadata for every visible mockup element family.
// This file is intentionally not rendered in the dashboards.
export const powerBIImplementationMetadata: PowerBIImplementationMetadata[] = [
  {
    page: 'All Dashboards',
    element: 'Primary navigation',
    recommendedVisual: 'Power BI page navigator or buttons with page-navigation actions',
    implementationApproach: 'Six fixed report pages using the same visual theme and button states.',
    requiredMeasures: [],
    expectedInteraction: 'Page navigation action',
    knownLimitation: 'Browser tab state is only a prototype stand-in for Power BI page navigation.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'All Dashboards',
    element: 'Global and page slicers',
    recommendedVisual: 'Native slicers',
    implementationApproach: 'Dropdown, list, date, relative-date, and field-parameter slicers with synchronized date and org filters.',
    requiredMeasures: [],
    expectedInteraction: 'Native slicer filtering and sync slicers',
    knownLimitation: 'Prototype state demonstrates slicer selections but the Power BI model will provide filtering.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Executive Snapshot',
    element: 'KPI row',
    recommendedVisual: 'Card or KPI visuals',
    implementationApproach: 'Separate card/KPI visuals for each executive metric with variance and status conditional formatting.',
    requiredMeasures: ['Booked Sales', 'Booked Acres', 'Booked Contracts', 'Earned Revenue', 'Earned Acres', 'Final Sales', 'Free Cash Flow', 'AR Balance', 'AP Balance'],
    expectedInteraction: 'Slicer cross-filtering and report-page tooltips',
    knownLimitation: 'Six-card row is dense on a 1280 x 720 canvas and may need mobile layout tuning.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Executive Snapshot',
    element: 'Revenue and expense trend, basic cash outlook, AR/AP relationship, top 10 bookmark table, process metric comparison',
    recommendedVisual: 'Native column chart, table visuals, and bookmark toggle',
    implementationApproach: 'Use clustered columns, native tables, a Customers/Vendors bookmark toggle, and a Dollars/Acres/Contracts field parameter.',
    requiredMeasures: ['Earned Revenue', 'Prior Earned Revenue', 'Expenses', 'Prior Expenses', 'Cash Outlook Amount', 'Total AR', 'Total AP', 'Overdue AR', 'Near-Term AP', 'Selected Business Metric'],
    expectedInteraction: 'Field parameter and standard cross-filtering',
    knownLimitation: 'Top 10 detail can use a bookmark toggle or supporting detail page to preserve the 16:9 canvas.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Income Statement',
    element: 'Financial statement matrix',
    recommendedVisual: 'Matrix visual',
    implementationApproach: 'Illustrative Revenue, Expenses, Operating Income, Other Income/Expense, and Net Income rows with current/prior/YTD columns, negative parentheses, conditional variance formatting, and RP/RPM analysis moved to supporting drillthrough.',
    requiredMeasures: ['Current Period Amount', 'Prior Period Amount', 'Dollar Variance', 'Percent Variance', 'YTD Amount', 'Prior YTD Amount', 'RP/RPM Earned Revenue', 'RP/RPM Expenses', 'RP/RPM Difference', 'RP/RPM Final Sales', 'RP/RPM Acres'],
    expectedInteraction: 'Matrix expand/collapse and slicer filtering',
    knownLimitation: 'Illustrative financial statement structure pending QuickBooks account mapping. RP/RPM analysis is illustrative pending Finance approval of expense allocation and incentive rules.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Balance Sheet',
    element: 'Balance sheet matrix and balance validation',
    recommendedVisual: 'Matrix visual plus card/status visual',
    implementationApproach: 'Illustrative Assets, Liabilities, and Equity hierarchy with current/prior/variance columns, AR/AP relationship table, and a small balance-validation statement.',
    requiredMeasures: ['Total Assets', 'Total Liabilities', 'Total Equity', 'Cash Balance', 'AR Balance', 'AP Balance'],
    expectedInteraction: 'Matrix expand/collapse and conditional formatting',
    knownLimitation: 'Illustrative financial statement structure pending QuickBooks account mapping.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Cash Flow',
    element: 'Cash flow statement, basic outlook, and free cash flow trend',
    recommendedVisual: 'Matrix, table visual, and line chart',
    implementationApproach: 'Statement rows in matrix with basic cash outlook and a single free cash flow trend through native visuals.',
    requiredMeasures: ['Beginning Cash', 'Operating Cash Flow', 'Investing Cash Flow', 'Financing Cash Flow', 'Free Cash Flow', 'Ending Cash'],
    expectedInteraction: 'Slicers and native visual interactions',
    knownLimitation: 'Illustrative financial statement structure pending QuickBooks account mapping; a formal cash-flow package is a paginated report candidate.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Revenue Recognition',
    element: 'Earned Revenue audit visuals',
    recommendedVisual: 'Cards, stacked column chart, table/matrix, chart/table bookmark toggle, and drillthrough pages',
    implementationApproach: 'Use exactly Signed Agreement, Soil Data Collection Complete, and Report Complete stages. Stage and monthly period visuals use native charts and tables; contract detail maps to drillthrough or paginated detail outside the main page.',
    requiredMeasures: ['Total Earned Revenue', 'Signed Agreement Earned Revenue', 'Soil Data Collection Complete Earned Revenue', 'Report Complete Earned Revenue', 'Recognized Acres', 'Recognized Contracts', 'Operational or CRM Earned Revenue', 'General-Ledger Revenue', 'Reconciliation Variance'],
    expectedInteraction: 'Report-page tooltips, conditional formatting, and drillthrough',
    knownLimitation: 'The one-third allocation is a mockup assumption based on the meeting description. Final DAX and accounting treatment must be approved by Finance. Discounts, change orders, refunds, credits, cancellations, partial acreage changes, reopened accounts, and manual adjustments are open implementation rules, not mockup calculations.',
    replicabilityStatus: 'Replicable with Drillthrough',
  },
  {
    page: 'Exception Reporting',
    element: 'Read-only exception monitoring and detail table',
    recommendedVisual: 'Cards, slicers, bar chart, and table visual',
    implementationApproach: 'Read-only analysis for Bruce-approved exception types with Reporting Period, Exception Type, Customer, and optional Source System slicers.',
    requiredMeasures: ['Open Exceptions', 'Deals Moved Backward', 'Missing Stage Dates', 'General-Ledger Mismatches', 'Historical-Period Changes', 'Revenue Difference where calculable'],
    expectedInteraction: 'Native slicers, read-only drillthrough to exception detail, Export Data, and Export to PDF',
    knownLimitation: 'The report must not imply exceptions can be resolved, assigned, or edited in Power BI.',
    replicabilityStatus: 'Replicable with Drillthrough',
  },
];
