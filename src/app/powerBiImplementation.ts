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
// This file is intentionally not rendered in the report pages.
export const powerBIImplementationMetadata: PowerBIImplementationMetadata[] = [
  {
    page: 'All Pages',
    element: 'Primary navigation',
    recommendedVisual: 'Power BI page navigator or buttons with page-navigation actions',
    implementationApproach: 'Six fixed report pages using the same visual theme and button states.',
    requiredMeasures: [],
    expectedInteraction: 'Page navigation action',
    knownLimitation: 'Browser tab state is only a prototype stand-in for Power BI page navigation.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'All Pages',
    element: 'Shared header slicers and filter pane',
    recommendedVisual: 'Native dropdown slicers, synced slicers, bookmarks, a conditional Between Date slicer, and Power BI filter pane fields',
    implementationApproach: 'Keep Reporting Period and Revenue Source in the shared header on every page. Use a standard Between Date slicer shown beneath Reporting Period only when Custom is selected. Place secondary Department, Customer, RP/RPM, account, and source-system filters in the Power BI filter pane.',
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
    element: 'Earned Revenue and expense trend, illustrative basic cash outlook, AR/AP relationship, top 10 bookmark table, process metric comparison',
    recommendedVisual: 'Native column chart, table visuals, and bookmark toggle',
    implementationApproach: 'Use clustered columns, native tables, a Customers/Vendors bookmark toggle, and a tabular Booked Sales/Earned Revenue/Final Sales comparison showing dollars, acres, and contract count together.',
    requiredMeasures: ['Earned Revenue', 'Prior Earned Revenue', 'Expenses', 'Prior Expenses', 'Cash Outlook Amount', 'Total AR', 'Total AP', 'AR over 90 days', 'Near-Term AP', 'Selected Business Metric'],
    expectedInteraction: 'Standard cross-filtering and bookmark toggle where used',
    knownLimitation: 'Top 10 detail can use a bookmark toggle or supporting detail page to preserve the 16:9 canvas.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Income Statement',
    element: 'Financial statement matrix',
    recommendedVisual: 'Matrix visual',
    implementationApproach: 'Illustrative Revenue, Expenses, Operating Income, Other Income/Expense, and Net Income rows with current/prior/YTD columns, negative parentheses, conditional variance formatting, and source labels pending Finance confirmation.',
    requiredMeasures: ['Current Period Amount', 'Prior Period Amount', 'Dollar Variance', 'Percent Variance', 'YTD Amount', 'Prior YTD Amount'],
    expectedInteraction: 'Matrix expand/collapse and slicer filtering',
    knownLimitation: 'Illustrative financial statement structure pending QuickBooks account mapping. RP/RPM analysis is future phase pending scope confirmation and is not calculated in this mockup.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Balance Sheet',
    element: 'Balance sheet matrix and balance validation',
    recommendedVisual: 'Card visuals, matrix visual, compact table visual, and simple status indicator',
    implementationApproach: 'Illustrative Assets, Liabilities, and Equity hierarchy with current/prior/variance columns, compact AR/AP relationship table, and a prominent Assets = Liabilities + Equity status indicator.',
    requiredMeasures: ['Total Assets', 'Total Liabilities', 'Total Equity', 'Cash Balance', 'AR Balance', 'AP Balance'],
    expectedInteraction: 'Matrix expand/collapse and conditional formatting',
    knownLimitation: 'Illustrative account hierarchy pending final QuickBooks mapping. No transaction-level drillthrough, balance sheet ratios, or charts are included in this mockup page.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Cash Flow',
    element: 'Cash flow statement, basic outlook, and free cash flow trend',
    recommendedVisual: 'Matrix, table visual, and line chart',
    implementationApproach: 'Three primary cards for Ending Cash, Net Change in Cash, and Free Cash Flow. Operating, investing, and financing activities remain in the statement matrix. Basic Cash Outlook stays illustrative and no additional forecasting categories are introduced.',
    requiredMeasures: ['Beginning Cash', 'Operating Cash Flow', 'Investing Cash Flow', 'Financing Cash Flow', 'Net Change in Cash', 'Free Cash Flow', 'Ending Cash'],
    expectedInteraction: 'Slicers and native visual interactions',
    knownLimitation: 'Illustrative financial statement structure pending QuickBooks account mapping. Free Cash Flow definition pending Finance confirmation; do not imply the current formula is approved.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Revenue Recognition',
    element: 'Earned Revenue audit visuals',
    recommendedVisual: 'Cards, table/matrix visuals, native slicers, filter pane fields, and drillthrough pages',
    implementationApproach: 'Use exactly Stage 1 — Signed Agreement, Stage 2 — Soil Data Collection Complete, and Stage 3 — Report Complete. Monthly stage reporting can use a chart/table selector; customer, source, and reconciliation result remain Power BI filter-pane fields. Contract detail maps to drillthrough or paginated detail outside the main page.',
    requiredMeasures: ['Total Earned Revenue', 'Stage 1 Earned Revenue', 'Stage 2 Earned Revenue', 'Stage 3 Earned Revenue', 'Recognized Acres', 'CRM Earned Revenue', 'General Ledger Earned Revenue', 'Reconciliation Variance'],
    expectedInteraction: 'Report-page tooltips, conditional formatting, and drillthrough',
    knownLimitation: 'The one-third allocation is a mockup assumption based on the meeting description. Final DAX, accounting treatment, and stage-acre definition must be approved by Finance. Discounts, change orders, refunds, credits, cancellations, partial acreage changes, reopened accounts, and manual adjustments are open implementation rules, not mockup calculations.',
    replicabilityStatus: 'Replicable with Drillthrough',
  },
  {
    page: 'Exception Reporting',
    element: 'Read-only exception monitoring and detail table',
    recommendedVisual: 'Cards, slicer, summary table, detail table, filter pane fields, and read-only drillthrough table',
    implementationApproach: 'Read-only analysis for Deals Moved Backward, Missing Stage Dates, General Ledger Mismatches, and Historical Period Changes. The shared header provides Reporting Period and Revenue Source; Exception Type remains visible on the page. Customer and Source System remain filter pane fields.',
    requiredMeasures: ['Open Exceptions', 'Deals Moved Backward', 'Missing Stage Dates', 'General-Ledger Mismatches', 'Historical-Period Changes', 'Potential Financial Impact pending definition'],
    expectedInteraction: 'Native slicers, read-only drillthrough to exception detail, Export Data, and Export to PDF',
    knownLimitation: 'Potential Financial Impact calculation definition is pending. The report must not imply exceptions can be resolved, assigned, noted, statused, or edited in Power BI. Proactive alerts may require Power Automate, Fabric, or data-pipeline monitoring outside the report.',
    replicabilityStatus: 'Replicable with Drillthrough',
  },
];
