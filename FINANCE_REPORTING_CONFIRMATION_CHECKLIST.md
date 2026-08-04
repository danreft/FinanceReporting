# Finance Reporting Confirmation Checklist

Use this document to confirm open business rules, data sources, calculations, and Power BI implementation decisions before production build. Items marked below are not approved until Finance or the named business owner provides an answer.

For each item, complete:

- Decision / Answer:
- Source System or Data Owner:
- Approver:
- Notes:

## 1. Data Sources

### 1.1 CRM and Operational Data

- Which CRM system is authoritative for deals, customers, acres, source, RP, RPM, and deal stage data?
- Which system is authoritative for operational stage dates?
- Which system is authoritative for Paid Account / full balance collected?
- What unique IDs are available to join CRM, DocuSign, operations, QuickBooks, AR/AP, and GL records?
- What is the expected refresh cadence?
- What historical data is available for January-June and prior-year comparisons?

### 1.2 DocuSign

- Which DocuSign status confirms an agreement is fully signed?
- Which DocuSign date should drive Booked Sales reporting period?
- Which DocuSign field links the agreement to the CRM deal or contract?

### 1.3 QuickBooks / GL / AR / AP

- Which QuickBooks tables or exports provide GL activity?
- Which tables or exports provide AR balances?
- Which tables or exports provide AP balances?
- Which tables or exports provide vendor expenses?
- Which tables or exports provide cash balances?
- Are financial statements cash-basis or accrual-basis?

## 2. Core Business Rules

- Is every Earned Revenue stage always exactly one-third of contract value?
- What rounding rules should be used for stage amounts?
- Is revenue recognized on stage date, period close, invoice date, GL posting date, or another date?
- How should missing stage dates be handled?
- How should stage dates changed after close be handled?
- How should repeated stage events be handled?
- How should backward stage movement be handled?
- How should reopened deals be handled?
- How should manual adjustments be handled?
- How should historical January-June activity be treated?

## 3. Booked Sales

Confirmed definition:
Booked Sales is total signed contract value, acres, and contract count for agreements fully signed through DocuSign during the selected period.

- What DocuSign completion status qualifies an agreement as fully signed?
- Which date field determines the selected period?
- Are amendments included?
- Are renewals included?
- Are change orders included?
- How do cancellations after signing affect Booked Sales?
- Is Booked Sales gross contract value or net of discounts/credits?
- What is the contract count rule?

## 4. Earned Revenue

Confirmed definition:
Earned Revenue is GAAP-compliant revenue recognized through Signed Agreement, Soil Data Collection Complete, and Report Complete.

- What source field identifies Signed Agreement completion?
- What source field identifies Soil Data Collection Complete?
- What source field identifies Report Complete?
- What is the final allocation method by stage?
- How are discounts handled?
- How are credits handled?
- How are refunds handled?
- How are cancellations handled?
- How are contract amendments handled?
- How are change orders handled?
- How are partial acreage changes handled?
- How are manual GL or revenue adjustments handled?
- Should operational Earned Revenue, GL Revenue, or reconciled values appear in financial reporting visuals?

## 5. Final Sales

Confirmed definition:
Final Sales are accounts where the complete customer balance has been collected and the deal has reached Paid Account.

- What field proves the complete customer balance was collected?
- What field proves the deal reached Paid Account?
- Which date drives Final Sales reporting period?
- Are partial payments always excluded?
- Are open invoices always excluded?
- Are AR balances always excluded?
- How do refunds or credits after payment affect Final Sales?
- How should Final Sales support RP and internal incentive qualification without calculating payouts in the mockup?

## 6. Source Categories

Confirmed source categories:

- All Sources
- RP-Sourced
- Direct-Sourced

- What source field should be used?
- What values map to RP-Sourced?
- What values map to Direct-Sourced?
- Does Direct-Sourced mean no RP, no RPM, or an explicit direct source value?
- How are source changes after signing handled?
- Does source apply to Booked Sales, Earned Revenue, Final Sales, or all three?

## 7. RP and RPM Analysis

Bruce requested basic visibility into cost and revenue associated with individual RPs, RPMs, and the RP program as a whole.

- What field identifies the Referral Partner?
- What field identifies the RPM?
- Does every RP-Sourced deal have both RP and RPM?
- What is the expense allocation method for an RP?
- What is the expense allocation method for an RPM?
- Are expenses cash-basis or accrual-basis?
- Which source provides RP/RPM expenses?
- Should the analysis use Earned Revenue, Final Sales, or both?
- Are associated acres booked acres, recognized acres, or final-sales acres?
- What are the incentive qualification rules?
- Are incentive payout calculations excluded permanently or only excluded from the current mockup phase?

## 8. Financial Statements

- What is the approved QuickBooks chart-of-accounts hierarchy?
- What is the Income Statement account mapping?
- What is the Balance Sheet account mapping?
- What is the Cash Flow account mapping?
- What is the department mapping for expenses?
- What is the vendor mapping for Top 10 Vendors?
- What is the customer mapping for Top 10 Customers?
- What is the period-close calendar?
- What are the locked-period rules?
- How are manual journal entries handled?
- Are intercompany or non-operating items relevant?

## 9. Cash Flow and Basic Cash Outlook

- What is the source of current cash?
- What is the source of expected customer collections?
- What is the source of expected near-term payments?
- What does “near-term” mean?
- Is Basic Cash Outlook cash-basis only?
- Are payroll, vendor, debt service, and other payments included?
- Is the Free Cash Flow formula approved?
- Should cash outlook be tied only to AR/AP or include additional known cash events?

## 10. AR and AP

- What is the source of AR balances?
- What is the source of AP balances?
- What defines overdue AR?
- What defines near-term AP?
- Are aging buckets needed on any drillthrough or detail page?
- Should AR/AP reconcile to Balance Sheet totals?
- Are disputed invoices included?

## 11. Revenue Recognition Reconciliation

- What key matches operational or CRM Earned Revenue to General-Ledger Revenue?
- Is reconciliation deal-level, contract-level, customer-level, or period-level?
- Is there an acceptable variance tolerance?
- How are timing differences handled?
- How are manual GL adjustments handled?
- How are unmatched records classified?
- Are reconciliation result labels approved?

## 12. Exception Reporting

Confirmed exception types:

- Backward Stage Movement
- Repeated Revenue Stage Event
- Missing Stage Date
- Revenue Recognition Date Reset
- CRM or Operational-to-General-Ledger Mismatch
- Historical-Period Change
- Other Out-of-Pattern Transaction

- What is the final definition of each exception type?
- What source fields identify each exception?
- Is Revenue Difference always calculable?
- How is Revenue Difference calculated?
- When are acres relevant?
- Which field defines the Reporting Period?
- What source system values should be shown?
- What fields should appear on read-only drillthrough detail?
- Should exception lifecycle metadata exist outside Power BI?

## 13. Comparison Logic

- What defines current period?
- What defines prior period?
- What are the month-over-month calculation rules?
- What are the year-over-year calculation rules?
- What are the YTD calculation rules?
- What are the prior-YTD calculation rules?
- Is reporting based on calendar year, fiscal year, or custom reporting periods?

## 14. Power BI Implementation

- What is the final dataset architecture?
- What fact tables are required?
- What dimension tables are required?
- What are the measure naming conventions?
- Are there row-level security requirements?
- What drillthrough pages are required?
- What paginated reports are required?
- Who can use Export Data?
- What PDF/export formatting is required?
- What is the refresh schedule?
- What data quality checks are required before refresh?
- Who approves DAX measures?
- Who approves account mappings?
- Who approves Finance validation assumptions?

## 15. Approval Summary

Complete this section after all answers are provided.

- Finance approver:
- Operations approver:
- Sales / RP program approver:
- Data / systems owner:
- Power BI implementation owner:
- Date approved:
- Remaining open items:
