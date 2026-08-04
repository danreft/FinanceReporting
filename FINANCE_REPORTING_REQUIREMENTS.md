# Finance Reporting Requirements

This document separates confirmed Finance Reporting requirements from mockup assumptions that require Finance validation. Do not treat assumptions as approved accounting rules or implementation requirements.

## 1. Confirmed Requirements

- Build exactly six primary report pages:
  - Executive Snapshot
  - Income Statement
  - Balance Sheet
  - Cash Flow
  - Revenue Recognition
  - Exception Reporting
- Support a shared Reporting Period selection using Current Month, Previous Month, Current Quarter, Previous Quarter, Year to Date (YTD), Previous Year to Date, Current Fiscal Year, Previous Fiscal Year, Rolling 12 Months, and Custom.
- Support Custom reporting-period selection with a standard Between Date slicer shown only when Custom is selected.
- Support source analysis using a shared Revenue Source selector with All Sources, RP-Sourced, and Direct-Sourced.
- Include chart and table views where explicitly needed for the approved report.
- Support PDF-compatible presentation output and standard Power BI Export Data where appropriate.
- Keep primary pages compatible with a Power BI 16:9 report canvas.
- Move oversized detail tables to drillthrough pages, dedicated detail pages, or paginated report candidates.
- Keep Exception Reporting read-only. The report must not imply exceptions can be resolved, assigned, or edited in Power BI.

### Executive Snapshot

- Show Booked Sales, Earned Revenue, Final Sales, Free Cash Flow, Accounts Receivable, and Accounts Payable.
- Show Earned Revenue and Expense Trend.
- Show Basic Cash Outlook.
- Show AR and AP Relationship.
- Show Top 10 Customers and Top 10 Vendors.
- Show Booked Sales, Earned Revenue, and Final Sales comparison using dollars, acres, and contract count.

### Income Statement

- Show Total Revenue, Total Expenses, Operating Income, and Net Income.
- Show a matrix-compatible Income Statement structure.
- Show Earned Revenue by All Sources, RP-Sourced, and Direct-Sourced, pending Finance confirmation of source labels.
- Show expenses by department.
- Defer RP and RPM analysis unless scope is confirmed.

### Balance Sheet

- Show Total Assets, Total Liabilities, Total Equity, and Cash Balance.
- Show a matrix-compatible Balance Sheet structure.
- Show AR and AP relationship.
- Show prior-period comparison.
- Include a small Assets = Liabilities + Equity validation statement.

### Cash Flow

- Show Ending Cash, Net Change in Cash, and Free Cash Flow.
- Show a matrix-compatible Cash Flow Statement structure.
- Show Basic Cash Outlook as illustrative.
- Show Free Cash Flow trend and period comparison.

### Revenue Recognition

- Show Total Earned Revenue.
- Show Stage 1 Earned Revenue, Stage 2 Earned Revenue, and Stage 3 Earned Revenue.
- Show Recognized Acres.
- Show Earned Revenue by stage and period.
- Support dollars and acres views.
- Reconcile Operational or CRM Earned Revenue to General-Ledger Revenue and variance.
- Provide detailed audit information through drillthrough or paginated report output.

### Exception Reporting

- Track only these exception types:
  - Backward Stage Movement
  - Missing Stage Date
  - CRM or Operational-to-General-Ledger Mismatch
  - Historical-Period Change
- Show Open Exceptions, Deals Moved Backward, Missing Stage Dates, General-Ledger Mismatches, and Historical-Period Changes.
- Show a compact exception summary table and read-only exception detail table.
- Provide read-only exception detail through drillthrough, paginated report, or Export Data.

## 2. Confirmed Business Definitions

### Booked Sales

Total signed contract value, acres, and contract count for agreements fully signed through DocuSign during the selected period.

### Earned Revenue

GAAP-compliant revenue recognized through:

- Signed Agreement
- Soil Data Collection Complete
- Report Complete

### Final Sales

Accounts where the complete customer balance has been collected and the deal has reached Paid Account.

### Source Categories

- All Sources
- RP-Sourced
- Direct-Sourced

## 3. Pending Finance Confirmation

1. What event officially establishes Booked Sales:
   - RFS Submitted
   - Fully signed agreement in DocuSign
   - Another CRM stage
2. What date should be used for Booked Sales reporting?
3. Confirm the three Earned Revenue triggers:
   - Signed Agreement
   - Soil Data Collection Complete
   - Report Complete
4. Confirm whether each Earned Revenue stage always equals one-third of the approved contract value.
5. Confirm which contract value is used:
   - Original
   - Discounted
   - Current adjusted value
6. Confirm how acres should be calculated across Revenue Recognition stages.
7. Confirm the event and date that officially establish Final Sales.
8. Confirm how backward stage movement or corrected stage dates should affect closed reporting periods.
9. Confirm the General Ledger account or account group used for Earned Revenue reconciliation.
10. Confirm which exception types are required in the initial release.
11. Confirm whether RP/RPM profitability is part of the initial release or a future phase.
12. Confirm whether cash forecasting is part of the initial release or a future phase.

## 4. Items Explicitly Excluded From the Mockups

- Editable exception workflow.
- Exception severity model.
- Owner assignment.
- Resolution notes.
- Complex cash forecasting.
- Unapproved financial ratios.
- Incentive payout calculations.
- Sales quotas.
- Complex RP scoring.
- Writeback from Power BI.
- Any accounting rule not stated in the meeting.
- Proactive alerting as a native Power BI report capability.

## 5. Power BI Implementation Notes

- Use native Power BI pages for the six primary report pages.
- Use a fixed 16:9 report canvas for desktop presentation.
- Use native slicers, matrices, table visuals, chart visuals, field parameters, bookmarks, report-page tooltips, and drillthrough pages.
- Use paginated reports for formal financial statement packages and wide audit/detail outputs.
- Keep oversized audit tables off the primary report pages.
- Keep RP and RPM analysis deferred unless scope is confirmed.
- Use standard Power BI Export Data and Export to PDF workflows.
- Do not implement writeback, assignment, resolution, or approval behavior in Power BI.
- Do not implement accounting logic for unresolved assumptions until Finance approves the final business rules.
- Use Power Automate, Fabric, or data-pipeline monitoring for proactive alerting if required outside the Power BI report.
