# Power BI Implementation Guide

This mockup validates Finance Reporting requirements before implementation in Microsoft Power BI. The target build should use native Power BI visuals, slicers, field parameters, bookmarks, drillthrough pages, report-page tooltips, conditional formatting, and paginated reports where a standard report page is too dense.

## Global Report Standards

- Canvas: 16:9 report pages, approximately 1280 x 720.
- Theme: green finance theme using Power BI theme colors, white visual backgrounds, subtle borders, consistent title text, and Source Sans-style body text where available.
- Navigation: Power BI page navigator or button navigation for exactly six pages: Executive Snapshot, Income Statement, Balance Sheet, Cash Flow, Revenue Recognition, Exception Reporting.
- Export handling: use standard Power BI service export, print, and drillthrough/detail capabilities outside the report header chrome.
- Synchronized slicers: Date Range, Month, Quarter, Year, Department, Revenue Source, Referral Partner, Salesperson, and Comparison Period should sync where the page supports the field.
- Field parameter: Dollars, Acres, and Contracts should be implemented as a Power BI field parameter or disconnected metric selector table.
- Detail records: large audit and exception tables should use drillthrough pages or paginated reports instead of web drawers or custom modals.

## Dashboard Specifications

### Executive Snapshot

- Page purpose: CFO overview of Book Sales, Earned Revenue, Final Sales, cash, AR, AP, customer, and vendor position.
- Required slicers: date range, month, quarter, year, department, revenue source, referral partner, salesperson, comparison period.
- Synchronized slicers: all required slicers.
- KPI visuals: Book Sales, Earned Revenue, Final Sales, Free Cash Flow, Accounts Receivable, Accounts Payable.
- Chart types: clustered column chart for Revenue and Expense Trend; column/bar chart for Cash Flow Outlook; clustered bar chart for AR/AP Aging; column chart with field parameter for Book Sales/Earned Revenue/Final Sales comparison.
- Table requirements: Top 10 Customers and Top 10 Vendors as native table visuals.
- Drillthrough pages: customer detail, vendor detail, process metric detail.
- Tooltip pages: KPI definition tooltip and trend variance tooltip.
- Bookmarks: optional presentation view bookmark.
- Field parameters: Dollars, Acres, Contracts for process metric comparison.
- Conditional formatting: KPI status and variance color/status labels.
- Export requirements: presentation-friendly PDF view plus Export data for visible tables.
- Paginated report candidates: full customer/vendor detail exports.
- Custom visual requirements: none.
- Known limitations: a six-card KPI row is dense and may need a dedicated mobile layout.
- Required measures: Book Sales, Book Acres, Book Contracts, Earned Revenue, Earned Acres, Earned Contracts, Final Sales, Final Acres, Final Contracts, Free Cash Flow, AR Balance, AP Balance.
- Likely source systems: CRM/contracts, revenue recognition model, general ledger, AR/AP subledgers.

### Income Statement

- Page purpose: finance-oriented profit and loss statement.
- Required slicers: date, period, department, revenue source, revenue view, expense view.
- Synchronized slicers: date, period, department, revenue source.
- KPI visuals: Total Revenue, Total Expenses, Operating Income, Net Income, Gross Margin, Operating Margin.
- Chart types: line charts for rolling 12-month revenue, expenses, and net income; bar chart for expense slice; pie/donut visual may be replaced by bar chart if legend density grows.
- Table or matrix requirements: matrix visual with account hierarchy, expandable rows, subtotals, current/prior/variance/YTD columns, aligned currency, negative parentheses.
- Drillthrough pages: account detail and transaction detail.
- Tooltip pages: account variance tooltip.
- Bookmarks: optional revenue/expense view presets.
- Field parameters: revenue and expense slicing can use field parameters or disconnected selector tables.
- Conditional formatting: favorable/unfavorable variance, subtotal emphasis, negative number formatting.
- Export requirements: finance-statement print layout and Export data.
- Paginated report candidates: board-ready income statement package and full transaction detail.
- Custom visual requirements: none.
- Known limitations: precise financial-statement pagination is better handled by Power BI Paginated Reports.
- Required measures: Current Period Amount, Prior Period Amount, Dollar Variance, Percent Variance, YTD Amount, Prior YTD Amount, Gross Margin, Operating Margin.
- Likely source systems: general ledger, chart of accounts, department dimension, revenue source dimension.

### Balance Sheet

- Page purpose: financial position statement with AR/AP relationship and balance validation.
- Required slicers: date/period, department where applicable.
- Synchronized slicers: date, period, department.
- KPI visuals: Total Assets, Total Liabilities, Total Equity, Working Capital, Current Ratio, Cash Balance.
- Chart types: line chart for assets/liabilities/equity over time; line chart for working capital; clustered bar chart for AR/AP aging.
- Table or matrix requirements: matrix visual with Assets, Liabilities, and Equity hierarchy, expandable levels, current/prior/variance columns.
- Drillthrough pages: account balance detail, AR aging detail, AP aging detail.
- Tooltip pages: balance check tooltip and account variance tooltip.
- Bookmarks: optional balance validation state.
- Field parameters: not required for standard accounting lines.
- Conditional formatting: variance indicators and balance check status.
- Export requirements: finance-statement print layout and Export data.
- Paginated report candidates: formal monthly balance sheet packet.
- Custom visual requirements: none.
- Known limitations: production balancing requires governed account mapping.
- Required measures: Total Assets, Total Liabilities, Total Equity, Balance Difference, Working Capital, Current Ratio, Cash Balance, AR Balance, AP Balance.
- Likely source systems: general ledger, AR subledger, AP subledger, bank/cash ledger.

### Cash Flow

- Page purpose: cash flow statement, cash outlook, actual/forecast variance, and trend review.
- Required slicers: date, month, quarter, year, department, cash-flow category.
- Synchronized slicers: date, month, quarter, year, department.
- KPI visuals: Beginning Cash, Operating Cash Flow, Investing Cash Flow, Financing Cash Flow, Free Cash Flow, Ending Cash.
- Chart types: line charts for operating cash flow, free cash flow, and ending cash; clustered column chart or waterfall chart for operating/investing/financing cash movement; bar chart for cash outlook.
- Table or matrix requirements: cash flow statement as matrix grouped by Operating, Investing, and Financing Activities.
- Drillthrough pages: cash-flow category detail and forecast assumption detail.
- Tooltip pages: actual vs forecast variance tooltip.
- Bookmarks: optional actual/forecast view.
- Field parameters: not required for standard cash lines.
- Conditional formatting: variance status and negative cash flow parentheses.
- Export requirements: finance-statement print layout and Export data.
- Paginated report candidates: formal cash-flow package and forecast detail.
- Custom visual requirements: none.
- Known limitations: forecast assumptions may require a separate detail/report page.
- Required measures: Beginning Cash, Operating Cash Flow, Investing Cash Flow, Financing Cash Flow, Free Cash Flow, Net Change in Cash, Ending Cash, Forecast Amount, Variance Percent.
- Likely source systems: general ledger, cash ledger, AP/payroll forecast, AR collections forecast.

### Revenue Recognition

- Page purpose: primary audit-focused Earned Revenue report emphasizing confidence, traceability, and reconciliation.
- Required slicers: recognition period, stage, customer, department, salesperson, referral partner, reconciliation status, metric.
- Synchronized slicers: recognition period/date, department, salesperson, referral partner, reconciliation status where applicable.
- KPI visuals: Total Earned Revenue, Stage 1 Earned Revenue, Stage 2 Earned Revenue, Stage 3 Earned Revenue, Recognized Acres, Recognized Contracts.
- Chart types: stacked column chart for Earned Revenue by Stage and Period; clustered column chart for operational vs general-ledger reconciliation.
- Table or matrix requirements: stage summary table, period comparison table, reconciliation summary table, audit indicator table, and detailed audit table.
- Drillthrough pages: contract/project detail and reconciliation detail.
- Tooltip pages: stage event tooltip and reconciliation status tooltip.
- Bookmarks: chart/table toggle should be implemented with bookmarks or controlled visual visibility.
- Field parameters: Dollars, Acres, Contracts for stage/period visuals.
- Conditional formatting: reconciliation status, audit indicator status, variance status.
- Export requirements: Export data for audit tables; PDF for overview; paginated report for full audit detail.
- Paginated report candidates: detailed audit table with stage dates, amounts, GL values, and reconciliation status.
- Custom visual requirements: none.
- Known limitations: full audit detail is too wide for the main canvas and should use drillthrough or paginated output.
- Required measures: Total Earned Revenue, Stage 1 Earned Revenue, Stage 2 Earned Revenue, Stage 3 Earned Revenue, Recognized Acres, Recognized Contracts, GL Revenue, Reconciliation Variance, Unmatched Records.
- Likely source systems: CRM/contracts, operational stage system, revenue recognition model, general ledger.

### Exception Reporting

- Page purpose: read-only finance and revenue-recognition controls report for exceptions that could change reported financial results.
- Required slicers: severity, status, exception type, detected date, impact metric, owner where available.
- Synchronized slicers: detected date, department/revenue context where available.
- KPI visuals: Total Open Exceptions, Critical Exceptions, Revenue at Risk, Deals Moved Backward, Missing Stage Dates, GL Mismatches.
- Chart types: bar chart for exceptions by severity; bar chart for impact by exception type.
- Table or matrix requirements: read-only exception detail table with status, owner, source system, and resolution notes.
- Drillthrough pages: exception detail page and source-system record link.
- Tooltip pages: severity definition and revenue impact tooltip.
- Bookmarks: resolved/unresolved view bookmark or status slicer selection.
- Field parameters: Dollars, Acres, Contracts for impact analysis.
- Conditional formatting: severity, status, revenue impact, aging or detected-date urgency.
- Export requirements: Export data includes active filters and status; PDF captures current analytical view.
- Paginated report candidates: full exception register with resolution history.
- Custom visual requirements: none.
- Known limitations: Power BI should not edit status, owner, severity, notes, or resolution information directly.
- Required measures: Open Exceptions, Critical Exceptions, Revenue at Risk, Acres at Risk, Deals Moved Backward, Missing Stage Dates, GL Mismatches, Exception Count.
- Likely source systems: CRM, operational workflow/stage system, revenue recognition model, general ledger, source-system case/detail links.

## Visual Inventory

| Mockup Page | Mockup Element | Business Purpose | Recommended Power BI Visual | Native or Custom | Required Interaction | Required Measure | Implementation Notes | Replicability Status |
|---|---|---|---|---|---|---|---|---|
| All | Page navigation | Move between six dashboards | Page navigator/buttons | Native | Page navigation | None | Match tab labels exactly | Fully Replicable |
| All | Global slicers | Shared finance filtering | Slicers | Native | Sync slicers | Date, department, source filters | Sync common slicers across pages | Fully Replicable |
| Executive Snapshot | KPI row | Executive finance summary | Card/KPI visuals | Native | Tooltip and slicers | Book Sales, Earned Revenue, Final Sales, FCF, AR, AP | Conditional formatting for status | Fully Replicable |
| Executive Snapshot | Revenue and Expense Trend | Period-over-period view | Clustered column chart | Native | Cross-filtering | Earned Revenue, Expenses, Prior Period | Include variance tooltip | Fully Replicable |
| Executive Snapshot | Cash Flow Outlook | Near-term cash projection | Column chart | Native | Tooltip | Beginning Cash, Inflows, Outflows, Ending Cash | Waterfall can be used if preferred | Fully Replicable |
| Executive Snapshot | AR/AP Summary and Aging | Working capital status | Bar chart/table | Native | Cross-filtering | AR Balance, AP Balance, Overdue AR, Upcoming AP | Aging buckets as dimension | Fully Replicable |
| Executive Snapshot | Top Customers/Vendors | Concentration review | Table visual | Native | Drillthrough | Sales/Revenue, Expense, Percent of Total | Full list can be detail page | Fully Replicable |
| Executive Snapshot | Book Sales/Earned Revenue/Final Sales comparison | Process-stage comparison | Column chart with field parameter | Native | Field parameter | Selected Metric | Dollars, Acres, Contracts selector | Fully Replicable |
| Income Statement | KPI cards | P&L summary | Card/KPI visuals | Native | Tooltip | Revenue, Expenses, Income, Margins | Favorable/unfavorable variance | Fully Replicable |
| Income Statement | Income Statement table | Financial statement | Matrix visual | Native | Expand/collapse | Current, Prior, Variance, YTD | Use account hierarchy and subtotals | Fully Replicable |
| Income Statement | Revenue/expense slicers | Slice statement lines | Slicers/field parameters | Native | Slicer filtering | Revenue Source, Expense Category | Could be disconnected selector tables | Fully Replicable |
| Income Statement | Rolling trends | 12-month trends | Line charts | Native | Cross-filtering | Revenue, Expenses, Net Income | Three visuals or small multiples | Fully Replicable |
| Balance Sheet | KPI cards | Financial position summary | Card/KPI visuals | Native | Tooltip | Assets, Liabilities, Equity, Working Capital, Current Ratio, Cash | Balance status formatting | Fully Replicable |
| Balance Sheet | Balance Sheet table | Statement of financial position | Matrix visual | Native | Expand/collapse | Current, Prior, Variance | Use financial statement hierarchy | Fully Replicable |
| Balance Sheet | AR/AP relationship | Working-capital impact | Table and bar chart | Native | Drillthrough | AR, AP, Overdue, Upcoming | AR/AP detail pages recommended | Fully Replicable |
| Balance Sheet | Balance trends | Position over time | Line charts | Native | Cross-filtering | Assets, Liabilities, Equity, Working Capital | Native line charts | Fully Replicable |
| Balance Sheet | Balance check | Validate Assets = Liabilities + Equity | Card/status visual | Native | Tooltip | Balance Difference | Conditional formatting | Fully Replicable |
| Cash Flow | KPI cards | Cash flow summary | Card/KPI visuals | Native | Tooltip | Beginning Cash, OCF, ICF, FCF, Ending Cash | Negative parentheses | Fully Replicable |
| Cash Flow | Statement table | Cash flow statement | Matrix visual | Native | Expand/collapse | Actual Amount | Operating/investing/financing hierarchy | Fully Replicable |
| Cash Flow | Outlook and variance | Forecast review | Table, bar, line, waterfall charts | Native | Tooltip/cross-filter | Forecast, Actual, Variance | Forecast assumptions detail page | Fully Replicable |
| Revenue Recognition | KPI cards | Earned Revenue audit summary | Card/KPI visuals | Native | Tooltip | Stage Earned Revenue, Acres, Contracts | Stage definitions in tooltips | Fully Replicable |
| Revenue Recognition | Stage/period toggle | Chart or table audit view | Bookmark-controlled visuals | Native | Bookmark buttons | Selected Metric by Stage | Do not use web-only toggle in Power BI | Replicable with Bookmarks |
| Revenue Recognition | Stage summary | Stage distribution | Table/matrix | Native | Cross-filtering | Revenue, Acres, Contracts, Percent of Total | Conditional formatting by stage/status | Fully Replicable |
| Revenue Recognition | Reconciliation visuals | Compare operational and GL amounts | Clustered column chart/table | Native | Drillthrough | Operational Earned Revenue, GL Revenue, Variance | Deal-level drillthrough | Replicable with Drillthrough |
| Revenue Recognition | Detailed audit table | Traceability by contract | Paginated report/table | Native | Drillthrough/export | Stage Dates, Stage Amounts, GL Amount | Too wide for main page | Paginated Report Recommended |
| Exception Reporting | KPI cards | Control exception summary | Card/KPI visuals | Native | Tooltip | Exception Count, Revenue at Risk, GL Mismatch Count | Status/severity formatting | Fully Replicable |
| Exception Reporting | Severity and type visuals | Analyze exception population | Bar charts | Native | Field parameter/cross-filtering | Exception Count, Selected Impact Metric | Native bar charts | Fully Replicable |
| Exception Reporting | Exception detail table | Read-only exception register | Table visual | Native | Drillthrough | Exception fields and impact measures | No editable workflow controls | Replicable with Drillthrough |
| Exception Reporting | Full exception register | Audit/control export | Paginated report | Native | Export/detail report | Exception history and resolution notes | Useful for wide and historical output | Paginated Report Recommended |

## Remaining Implementation Risks

- Exact financial statement formatting and multi-page board packages are better served by Power BI Paginated Reports.
- The Revenue Recognition audit table and full exception register are intentionally marked as paginated/detail candidates because they exceed a comfortable 16:9 dashboard canvas.
- The mockup demonstrates field-parameter outcomes with prototype state; the Power BI build should implement them through field parameters or disconnected selector tables.
- Source-system links for exception remediation must be provided by the production data model; Power BI should remain read-only for exception workflow fields.
