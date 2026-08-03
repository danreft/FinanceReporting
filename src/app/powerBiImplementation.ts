export type PowerBIReplicabilityStatus =
  | 'Fully Replicable'
  | 'Replicable with Bookmarks'
  | 'Replicable with Drillthrough'
  | 'Paginated Report Recommended'
  | 'Custom Visual Review Required'
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
    requiredMeasures: ['Book Sales', 'Book Acres', 'Book Contracts', 'Earned Revenue', 'Earned Acres', 'Final Sales', 'Free Cash Flow', 'AR Balance', 'AP Balance'],
    expectedInteraction: 'Slicer cross-filtering and report-page tooltips',
    knownLimitation: 'Six-card row is dense on a 1280 x 720 canvas and may need mobile layout tuning.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Executive Snapshot',
    element: 'Revenue/expense trend, cash outlook, AR/AP aging, top customer/vendor tables, process metric comparison',
    recommendedVisual: 'Native column/bar charts and table visuals',
    implementationApproach: 'Use clustered columns, simple bar charts, native tables, and a Dollars/Acres/Contracts field parameter.',
    requiredMeasures: ['Earned Revenue', 'Prior Earned Revenue', 'Expenses', 'Prior Expenses', 'Cash Outlook Amount', 'AR Aging', 'AP Aging', 'Selected Business Metric'],
    expectedInteraction: 'Field parameter and standard cross-filtering',
    knownLimitation: 'Top 10 detail can remain on page; full customer/vendor exports should use detail pages or paginated reports.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Income Statement',
    element: 'Financial statement matrix',
    recommendedVisual: 'Matrix visual',
    implementationApproach: 'Hierarchical account rows, expand/collapse, subtotals, current/prior/YTD columns, negative parentheses, and conditional variance formatting.',
    requiredMeasures: ['Current Period Amount', 'Prior Period Amount', 'Dollar Variance', 'Percent Variance', 'YTD Amount', 'Prior YTD Amount'],
    expectedInteraction: 'Matrix expand/collapse and slicer filtering',
    knownLimitation: 'Highly formatted external financial statements should be produced as paginated reports.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Balance Sheet',
    element: 'Balance sheet matrix and balance validation',
    recommendedVisual: 'Matrix visual plus card/status visual',
    implementationApproach: 'Assets, liabilities, and equity hierarchy with current/prior/variance columns and balance-check measure.',
    requiredMeasures: ['Total Assets', 'Total Liabilities', 'Total Equity', 'Balance Check Difference', 'Working Capital', 'Current Ratio'],
    expectedInteraction: 'Matrix expand/collapse and conditional formatting',
    knownLimitation: 'The mock data balances exactly; production model requires account mapping governance.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Cash Flow',
    element: 'Cash flow statement, outlook, trend, and variance visuals',
    recommendedVisual: 'Matrix, line chart, clustered column chart, and waterfall chart',
    implementationApproach: 'Statement rows in matrix; trend and forecast variance through native line/column visuals.',
    requiredMeasures: ['Beginning Cash', 'Operating Cash Flow', 'Investing Cash Flow', 'Financing Cash Flow', 'Free Cash Flow', 'Ending Cash', 'Forecast Amount', 'Variance Percent'],
    expectedInteraction: 'Slicers and native visual interactions',
    knownLimitation: 'A formal multi-page cash-flow package is a paginated report candidate.',
    replicabilityStatus: 'Fully Replicable',
  },
  {
    page: 'Revenue Recognition',
    element: 'Earned Revenue audit visuals',
    recommendedVisual: 'Cards, stacked column chart, table/matrix, buttons with bookmark interaction, and drillthrough pages',
    implementationApproach: 'Stage and period visuals use native charts; chart/table toggle maps to bookmarks; contract detail maps to drillthrough or paginated detail.',
    requiredMeasures: ['Total Earned Revenue', 'Stage 1 Earned Revenue', 'Stage 2 Earned Revenue', 'Stage 3 Earned Revenue', 'Recognized Acres', 'Recognized Contracts', 'GL Revenue', 'Reconciliation Variance'],
    expectedInteraction: 'Bookmarks, report-page tooltips, conditional formatting, and drillthrough',
    knownLimitation: 'The full audit table is too wide for a main 16:9 canvas and should use drillthrough or paginated report output.',
    replicabilityStatus: 'Replicable with Drillthrough',
  },
  {
    page: 'Exception Reporting',
    element: 'Exception controls and detail table',
    recommendedVisual: 'Cards, slicers, bar charts, table visual, drillthrough detail page',
    implementationApproach: 'Read-only exception analysis with status/owner/severity slicers and drillthrough to exception record details.',
    requiredMeasures: ['Open Exceptions', 'Critical Exceptions', 'Revenue at Risk', 'Deals Moved Backward', 'Missing Stage Dates', 'GL Mismatches', 'Selected Impact Metric'],
    expectedInteraction: 'Slicers, field parameter, drillthrough, and source-system links',
    knownLimitation: 'Power BI should not edit exception status, owner, severity, or notes directly.',
    replicabilityStatus: 'Replicable with Drillthrough',
  },
];
