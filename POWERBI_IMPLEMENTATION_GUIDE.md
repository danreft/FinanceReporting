# Power BI Implementation Guide

This mockup validates Finance Reporting requirements before implementation in Microsoft Power BI. The target build should use native Power BI visuals, slicers, field parameters, bookmarks, drillthrough pages, report-page tooltips, conditional formatting, and paginated reports where a standard report page is too dense.

For requirements authority and validation status, see `FINANCE_REPORTING_REQUIREMENTS.md`. Mockup assumptions listed there are not approved accounting requirements.

## Global Report Standards

- Canvas: 16:9 report pages, approximately 1280 x 720.
- Theme: green finance theme using Power BI theme colors, white visual backgrounds, subtle borders, consistent title text, and Source Sans-style body text where available.
- Desktop layout: each primary page uses a fixed 16:9 report canvas and should not rely on vertical webpage scrolling.
- Navigation: Power BI page navigator or button navigation for exactly six pages: Executive Snapshot, Income Statement, Balance Sheet, Cash Flow, Revenue Recognition, Exception Reporting.
- Export handling: use standard Power BI service export, print, and drillthrough/detail capabilities outside the report header chrome.
- Synchronized slicers: Date Range, Month, Quarter, Year, Department, Source, RP or RPM, Exception Type, Customer, and Revenue Recognition Stage should sync where the page supports the field.
- Field parameter: Dollars, Acres, and Contracts should be implemented as a Power BI field parameter or disconnected metric selector table.
- Detail records: large audit and exception tables should use drillthrough pages or paginated reports instead of web drawers or custom modals.

## Confirmed Business Definitions

- Booked Sales: total signed contract value, associated acres, and contract count for agreements fully signed through DocuSign during the selected reporting period.
- Earned Revenue: GAAP-compliant revenue recognized through exactly three operational stages: Signed Agreement, Soil Data Collection Complete, and Report Complete.
- Final Sales: value of accounts for which the full customer balance has been collected and the deal has reached Paid Account. Final Sales supports Referral Partner incentive qualification and internal sales incentive qualification.
- Source terminology: use All Sources, RP-Sourced, and Direct-Sourced for source categories.

## Assumptions Requiring Finance Validation

The mockups include illustrative values only where needed to demonstrate reporting structure. Finance must validate recognition allocation, rounding, discounts, change orders, cancellations, refunds, credits, contract amendments, partial acreage changes, reopened deals, manual adjustments, historical January-June treatment, RP/RPM expense allocation, incentive qualification and payout calculations, QuickBooks account hierarchy, materiality thresholds, and period-close rules before implementation.

## Dashboard Specifications

### Executive Snapshot

- Page purpose: CFO overview of Booked Sales, Earned Revenue, Final Sales, cash, AR, AP, customer, and vendor position.
- Required slicers: reporting period, department, source.
- Synchronized slicers: all required slicers.
- KPI visuals: Booked Sales, Earned Revenue, Final Sales, Free Cash Flow, Accounts Receivable, Accounts Payable.
- Chart types: clustered column chart for Revenue and Expense Trend; tables for Basic Cash Outlook and AR/AP Relationship; column chart with field parameter for Booked Sales/Earned Revenue/Final Sales comparison.
- Table requirements: Top 10 Customers and Top 10 Vendors as native table visuals, with a bookmark toggle or supporting detail page if both do not fit the main canvas.
- Drillthrough pages: optional customer or vendor detail only when needed to support the top 10 views.
- Tooltip pages: KPI definition tooltip and trend variance tooltip.
- Bookmarks: optional Top 10 Customers/Vendors toggle and presentation view bookmark.
- Field parameters: Dollars, Acres, Contracts for process metric comparison.
- Conditional formatting: KPI variance color labels.
- Export requirements: presentation-friendly PDF view plus Export data for visible tables.
- Paginated report candidates: full customer/vendor detail exports.
- Custom visual requirements: none.
- Known limitations: values are illustrative mock data for requirements validation.
- Required measures: Booked Sales, Booked Acres, Booked Contracts, Earned Revenue, Earned Acres, Earned Contracts, Final Sales, Final Acres, Final Contracts, Free Cash Flow, AR Balance, AP Balance.
- Likely source systems: CRM/contracts, revenue recognition model, general ledger, AR/AP subledgers.

### Income Statement

- Page purpose: finance-oriented profit and loss statement.
- Required slicers: date, period, department, source.
- Synchronized slicers: date and period where applicable; department and source can come from the shared report slicers.
- KPI visuals: Total Revenue, Total Expenses, Operating Income, Net Income.
- Chart types: line chart for year-over-year Earned Revenue and expenses; bar chart for expenses by department.
- Table or matrix requirements: matrix visual with Revenue, Expenses, Operating Income, Other Income/Expense, and Net Income rows; aligned currency, negative parentheses, current/prior/variance/YTD columns.
- RP/RPM analysis: supporting drillthrough labeled RP and RPM Financial Analysis with RP or RPM name, Earned Revenue, Expenses, Earned Revenue less Expenses, Associated Final Sales, and Associated Acres. Values are illustrative pending Finance approval of expense allocation and incentive rules.
- Drillthrough pages: account detail and transaction detail.
- Tooltip pages: account variance tooltip.
- Bookmarks: optional presentation view bookmark.
- Field parameters: not required for the simplified mockup.
- Conditional formatting: favorable/unfavorable variance, subtotal emphasis, negative number formatting.
- Export requirements: finance-statement print layout and Export data.
- Paginated report candidates: board-ready income statement package and full transaction detail.
- Custom visual requirements: none.
- Known limitations: illustrative financial statement structure pending QuickBooks account mapping.
- Required measures: Current Period Amount, Prior Period Amount, Dollar Variance, Percent Variance, YTD Amount, Prior YTD Amount.
- Likely source systems: general ledger, chart of accounts, department dimension, source dimension.

### Balance Sheet

- Page purpose: financial position statement with AR/AP relationship and balance validation.
- Required slicers: date/period where applicable.
- Synchronized slicers: date and period where applicable.
- KPI visuals: Total Assets, Total Liabilities, Total Equity, Cash Balance.
- Chart types: none beyond matrix/table visuals in the simplified mockup.
- Table or matrix requirements: matrix visual with Assets, Liabilities, and Equity hierarchy, expandable levels, current/prior/variance columns.
- Drillthrough pages: account balance detail where supported by the Power BI model.
- Tooltip pages: balance check tooltip and account variance tooltip.
- Bookmarks: optional balance validation state.
- Field parameters: not required for standard accounting lines.
- Conditional formatting: variance indicators.
- Export requirements: finance-statement print layout and Export data.
- Paginated report candidates: formal monthly balance sheet packet.
- Custom visual requirements: none.
- Known limitations: illustrative financial statement structure pending QuickBooks account mapping.
- Required measures: Total Assets, Total Liabilities, Total Equity, Cash Balance, AR Balance, AP Balance.
- Likely source systems: general ledger, AR subledger, AP subledger, bank/cash ledger.

### Cash Flow

- Page purpose: cash flow statement, free cash flow, basic cash outlook, and period comparison.
- Required slicers: date.
- Synchronized slicers: date.
- KPI visuals: Operating Cash Flow, Investing Cash Flow, Financing Cash Flow, Free Cash Flow, Ending Cash.
- Chart types: line chart for free cash flow trend.
- Table or matrix requirements: cash flow statement as matrix grouped by Operating, Investing, and Financing Activities.
- Drillthrough pages: cash-flow detail where supported by the Power BI model.
- Tooltip pages: cash-flow line detail tooltip.
- Bookmarks: optional presentation view bookmark.
- Field parameters: not required for standard cash lines.
- Conditional formatting: negative cash flow parentheses.
- Export requirements: finance-statement print layout and Export data.
- Paginated report candidates: formal cash-flow package.
- Custom visual requirements: none.
- Known limitations: illustrative financial statement structure pending QuickBooks account mapping; cash outlook remains a basic summary.
- Required measures: Beginning Cash, Operating Cash Flow, Investing Cash Flow, Financing Cash Flow, Free Cash Flow, Net Change in Cash, Ending Cash.
- Likely source systems: general ledger, cash ledger, AR subledger, AP subledger.

### Revenue Recognition

- Page purpose: Earned Revenue reporting for the three approved stages: Signed Agreement, Soil Data Collection Complete, and Report Complete.
- Business definition: Earned Revenue is GAAP-compliant revenue recognized when each applicable stage is completed.
- Required slicers: Recognition Period, Recognition Stage, Customer, Source, Reconciliation Result.
- Synchronized slicers: recognition period/date, customer, source, and reconciliation result where applicable.
- KPI visuals: Total Earned Revenue, Signed Agreement Earned Revenue, Soil Data Collection Complete Earned Revenue, Report Complete Earned Revenue, Recognized Acres, Recognized Contracts.
- Chart types: stacked column chart for Earned Revenue by stage and monthly period; clustered column chart for Operational or CRM Earned Revenue versus General-Ledger Revenue.
- Table or matrix requirements: stage summary table, period comparison table, reconciliation summary table, and audit indicator table on the primary page.
- Detail audit fields: contract or deal, customer, total contract value, acres, stage dates, stage amounts, Total Earned Revenue, General-Ledger amount, and reconciliation result.
- Audit indicators: Missing stage date, Backward stage movement, Repeated stage event, General-Ledger mismatch, Historical-period change.
- Tooltip pages: stage event tooltip and reconciliation tooltip.
- Bookmarks: chart/table view can be implemented with bookmarks or visual visibility.
- Field parameters: Dollars, Acres, Contract Count for stage/period visuals.
- Conditional formatting: reconciliation variance and audit indicator emphasis.
- Export requirements: Export data for audit tables; PDF for overview; paginated report for full audit detail.
- Paginated report candidates: detailed audit table with stage dates, stage amounts, total Earned Revenue, GL amount, and reconciliation result.
- Custom visual requirements: none.
- Known limitations: the one-third allocation is a mockup assumption based on the meeting description. Final DAX and accounting treatment must be approved by Finance. Do not invent logic for discounts, change orders, refunds, credits, cancellations, partial acreage changes, reopened accounts, or manual adjustments; those conditions are open implementation rules, not mockup calculations.
- Required measures: Total Earned Revenue, Signed Agreement Earned Revenue, Soil Data Collection Complete Earned Revenue, Report Complete Earned Revenue, Recognized Acres, Recognized Contracts, Operational or CRM Earned Revenue, General-Ledger Revenue, Reconciliation Variance.
- Likely source systems: CRM/contracts, operational stage system, revenue recognition model, general ledger.

### Exception Reporting

- Page purpose: read-only monitoring of revenue recognition and financial data exceptions.
- Required exception types: Backward Stage Movement, Repeated Revenue Stage Event, Missing Stage Date, Revenue Recognition Date Reset, CRM or Operational-to-General-Ledger Mismatch, Historical-Period Change, Other Out-of-Pattern Transaction.
- Required slicers: Reporting Period, Exception Type, Customer. Source System is optional.
- Synchronized slicers: reporting period, exception type, customer, and source system where applicable.
- KPI visuals: Open Exceptions, Deals Moved Backward, Missing Stage Dates, General-Ledger Mismatches, Historical-Period Changes.
- Chart types: bar chart for direct summed Revenue Difference by exception type where calculable.
- Table or matrix requirements: exception detail fields move to read-only drillthrough or Export Data, not the primary report page.
- Drillthrough pages: read-only exception detail page where supported by the model.
- Tooltip pages: exception definition and revenue-difference tooltip.
- Bookmarks: optional presentation view bookmark.
- Field parameters: not required for the simplified mockup.
- Conditional formatting: detected-date and revenue-difference emphasis only.
- Export requirements: Export Data includes active filters; Export to PDF captures current analytical view.
- Paginated report candidates: exception detail export.
- Custom visual requirements: none.
- Known limitations: the report must not imply exceptions can be resolved, assigned, or edited in Power BI.
- Required measures: Open Exceptions, Deals Moved Backward, Missing Stage Dates, General-Ledger Mismatches, Historical-Period Changes, Revenue Difference where calculable.
- Likely source systems: CRM, operational stage system, revenue recognition model, general ledger, source-system detail links.

## Visual Inventory

| Mockup Page | Mockup Element | Business Purpose | Recommended Power BI Visual | Native or Custom | Required Interaction | Required Measure | Implementation Notes | Replicability Status |
|---|---|---|---|---|---|---|---|---|
| All | Page navigation | Move between six dashboards | Page navigator/buttons | Native | Page navigation | None | Match tab labels exactly | Fully Replicable |
| All | Global slicers | Shared finance filtering | Slicers | Native | Sync slicers | Date, department, source filters | Sync common slicers across pages | Fully Replicable |
| Executive Snapshot | KPI row | Executive finance summary | Card/KPI visuals | Native | Tooltip and slicers | Booked Sales, Earned Revenue, Final Sales, FCF, AR, AP | Conditional variance formatting | Fully Replicable |
| Executive Snapshot | Revenue and Expense Trend | Period-over-period view | Clustered column chart | Native | Cross-filtering | Earned Revenue, Expenses, Prior Period | Include variance tooltip | Fully Replicable |
| Executive Snapshot | Basic Cash Outlook | Near-term cash projection | Table visual | Native | Tooltip | Current Cash, Expected Customer Collections, Expected Near-Term Payments, Projected Cash | No forecast model or assumption controls | Fully Replicable |
| Executive Snapshot | AR/AP Relationship | AR/AP relationship | Table visual | Native | Cross-filtering | Total AR, Total AP, Overdue AR, Near-Term AP | Summary relationship only | Fully Replicable |
| Executive Snapshot | Top Customers/Vendors | Concentration review | Table visual | Native | Bookmark toggle or drillthrough | Amount, Percent of Total | Full list can be detail page | Fully Replicable |
| Executive Snapshot | Booked Sales/Earned Revenue/Final Sales comparison | Process-stage comparison | Column chart with field parameter | Native | Field parameter | Selected Metric | Dollars, Acres, Contracts selector | Fully Replicable |
| Income Statement | KPI cards | P&L summary | Card/KPI visuals | Native | Tooltip | Revenue, Expenses, Income | Favorable/unfavorable variance | Fully Replicable |
| Income Statement | Income Statement table | Financial statement | Matrix visual | Native | Expand/collapse | Current, Prior, Variance, YTD | Use account hierarchy and subtotals | Fully Replicable |
| Income Statement | Revenue by source | Source analysis | Table visual | Native | Cross-filtering | All Sources, RP-Sourced, Direct-Sourced | Uses approved source labels | Fully Replicable |
| Income Statement | Revenue/expense comparison | Year-over-year comparison | Line chart | Native | Cross-filtering | Revenue, Expenses | Native line chart | Fully Replicable |
| Income Statement | Expenses by department | Department expense analysis | Bar chart | Native | Cross-filtering | Department expenses | Native bar chart | Fully Replicable |
| Income Statement | RP and RPM Financial Analysis | Basic partner/program financial visibility | Drillthrough table | Native | Drillthrough | RP or RPM name, Earned Revenue, Expenses, Difference, Final Sales, Acres | Illustrative pending Finance approval of expense allocation and incentive rules | Replicable with Drillthrough |
| Balance Sheet | KPI cards | Financial position summary | Card/KPI visuals | Native | Tooltip | Assets, Liabilities, Equity, Cash | Variance formatting | Fully Replicable |
| Balance Sheet | Balance Sheet table | Statement of financial position | Matrix visual | Native | Expand/collapse | Current, Prior, Variance | Use financial statement hierarchy | Fully Replicable |
| Balance Sheet | AR/AP relationship | Receivable and payable relationship | Table visual | Native | Cross-filtering | AR, AP, Overdue AR, Near-Term AP | Summary relationship only | Fully Replicable |
| Balance Sheet | Balance validation | Validate Assets = Liabilities + Equity | Text statement | Native | None | Balance validation | Informational statement only | Fully Replicable |
| Cash Flow | KPI cards | Cash flow summary | Card/KPI visuals | Native | Tooltip | Operating Cash Flow, Investing Cash Flow, Financing Cash Flow, FCF, Ending Cash | Negative parentheses | Fully Replicable |
| Cash Flow | Statement table | Cash flow statement | Matrix visual | Native | Expand/collapse | Actual Amount | Operating/investing/financing hierarchy | Fully Replicable |
| Cash Flow | Basic outlook | Cash planning summary | Table visual | Native | Tooltip/cross-filter | Cash Outlook | No detailed cash modeling | Fully Replicable |
| Cash Flow | Free cash flow trend | Period comparison | Line chart | Native | Cross-filtering | Free Cash Flow | Single trend visual | Fully Replicable |
| Revenue Recognition | KPI cards | Earned Revenue audit summary | Card/KPI visuals | Native | Tooltip | Total Earned Revenue, Signed Agreement Earned Revenue, Soil Data Collection Complete Earned Revenue, Report Complete Earned Revenue, Recognized Acres, Recognized Contracts | Stage amounts illustrative pending Finance validation | Fully Replicable |
| Revenue Recognition | Stage and period summary | Monthly stage distribution | Chart/table visual | Native | Chart/table bookmark and cross-filtering | Dollars, Acres, Contract Count | Uses only the three approved stages | Fully Replicable |
| Revenue Recognition | Reconciliation visuals | Compare operational and GL amounts | Clustered column chart/table | Native | Drillthrough | Operational or CRM Earned Revenue, General-Ledger Revenue, Variance | Deal-level drillthrough | Replicable with Drillthrough |
| Revenue Recognition | Detailed audit table | Traceability by contract | Drillthrough or paginated report | Native | Drillthrough/export | Contract/deal, customer, total contract value, acres, stage dates, stage amounts, total Earned Revenue, GL amount, reconciliation result | Moved off primary page | Paginated Report Recommended |
| Exception Reporting | KPI cards | Exception monitoring summary | Card/KPI visuals | Native | Tooltip | Open Exceptions, Deals Moved Backward, Missing Stage Dates, General-Ledger Mismatches, Historical-Period Changes | Read-only summary | Fully Replicable |
| Exception Reporting | Exception type visual | Direct revenue-difference summary | Bar chart | Native | Cross-filtering | Revenue Difference where calculable | No risk threshold or severity logic | Fully Replicable |
| Exception Reporting | Exception detail table | Read-only exception register | Drillthrough table | Native | Export Data and read-only drillthrough | Exception Type, Deal or Project, Customer, Affected Stage, Affected Period, Revenue Difference, Acres, Source System, Detected Date, Description | Moved off primary page; no assignment, resolution, workflow status, or writeback controls | Replicable with Drillthrough |

## Remaining Implementation Risks

- Exact financial statement formatting and multi-page board packages are better served by Power BI Paginated Reports.
- The Revenue Recognition audit table and full exception register are intentionally marked as paginated/detail candidates because they exceed a comfortable 16:9 dashboard canvas.
- Field-parameter outcomes should remain limited to approved Dollars, Acres, and Contracts views.
- Source-system remediation behavior must stay outside the Finance Reporting mockup.
