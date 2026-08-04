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
- Support date or reporting-period selection.
- Support source analysis using All Sources, RP-Sourced, and Direct-Sourced.
- Include chart and table views where explicitly needed for the approved report.
- Support PDF-compatible presentation output and standard Power BI Export Data where appropriate.
- Keep primary pages compatible with a Power BI 16:9 report canvas.
- Move oversized detail tables to drillthrough pages, dedicated detail pages, or paginated report candidates.
- Keep Exception Reporting read-only. The report must not imply exceptions can be resolved, assigned, or edited in Power BI.

### Executive Snapshot

- Show Booked Sales, Earned Revenue, Final Sales, Free Cash Flow, Accounts Receivable, and Accounts Payable.
- Show Revenue and Expense Trend.
- Show Basic Cash Outlook.
- Show AR and AP Relationship.
- Show Top 10 Customers and Top 10 Vendors.
- Show Booked Sales, Earned Revenue, and Final Sales comparison using dollars, acres, and contract count.

### Income Statement

- Show Total Revenue, Total Expenses, Operating Income, and Net Income.
- Show a matrix-compatible Income Statement structure.
- Show revenue by All Sources, RP-Sourced, and Direct-Sourced.
- Show expenses by department.
- Provide minimal RP and RPM financial analysis through a supporting drillthrough view.

### Balance Sheet

- Show Total Assets, Total Liabilities, Total Equity, and Cash Balance.
- Show a matrix-compatible Balance Sheet structure.
- Show AR and AP relationship.
- Show prior-period comparison.
- Include a small Assets = Liabilities + Equity validation statement.

### Cash Flow

- Show Operating Cash Flow, Investing Cash Flow, Financing Cash Flow, Free Cash Flow, and Ending Cash.
- Show a matrix-compatible Cash Flow Statement structure.
- Show Basic Cash Outlook.
- Show Free Cash Flow trend and period comparison.

### Revenue Recognition

- Show Total Earned Revenue.
- Show Earned Revenue for Signed Agreement, Soil Data Collection Complete, and Report Complete.
- Show Recognized Acres and Recognized Contracts.
- Show Earned Revenue by stage and period.
- Support dollars, acres, and contract count views.
- Show current-period versus prior-period comparison.
- Reconcile Operational or CRM Earned Revenue to General-Ledger Revenue and variance.
- Provide detailed audit information through drillthrough or paginated report output.

### Exception Reporting

- Track only these exception types:
  - Backward Stage Movement
  - Repeated Revenue Stage Event
  - Missing Stage Date
  - Revenue Recognition Date Reset
  - CRM or Operational-to-General-Ledger Mismatch
  - Historical-Period Change
  - Other Out-of-Pattern Transaction
- Show Open Exceptions, Deals Moved Backward, Missing Stage Dates, General-Ledger Mismatches, and Historical-Period Changes.
- Provide read-only exception detail through drillthrough or Export Data.

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

## 3. Mockup Assumptions Requiring Finance Validation

These items are not approved requirements. They must be validated by Finance before Power BI DAX, accounting treatment, or production data rules are finalized.

- Whether every recognition stage is always exactly one-third.
- Rounding rules.
- Discounts.
- Change orders.
- Cancellations.
- Refunds.
- Credits.
- Contract amendments.
- Partial acreage changes.
- Reopened deals.
- Manual adjustments.
- Historical January-June treatment.
- Expense allocation to RPs and RPMs.
- Incentive qualification and payout calculations.
- QuickBooks account hierarchy.
- Materiality thresholds.
- Period-close rules.

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

## 5. Power BI Implementation Notes

- Use native Power BI pages for the six primary report pages.
- Use a fixed 16:9 report canvas for desktop presentation.
- Use native slicers, matrices, table visuals, chart visuals, field parameters, bookmarks, report-page tooltips, and drillthrough pages.
- Use paginated reports for formal financial statement packages and wide audit/detail outputs.
- Keep oversized audit tables off the primary report pages.
- Keep RP and RPM analysis as a simple read-only drillthrough or supporting detail view.
- Use standard Power BI Export Data and Export to PDF workflows.
- Do not implement writeback, assignment, resolution, or approval behavior in Power BI.
- Do not implement accounting logic for unresolved assumptions until Finance approves the final business rules.
