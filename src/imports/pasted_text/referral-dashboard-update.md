Update the existing Referral Partner Dashboard mockup based on the latest client feedback.

Do not rebuild from scratch. Keep the current Power BI lift-and-shift style, multi-tab dashboard structure, clean enterprise layout, left-side slicer rail, and realistic mock data. The goal is to revise the dashboard so it better reflects what the Referral Partner team actually finds valuable.

Primary client feedback to address:
1. Remove anything related to commissions.
2. Remove anything related to approved RPs.
3. Remove approval status filtering and approval status fields.
4. Add a U.S. map of referral partner locations.
5. Add a chart showing RP deals in the soils pipeline entering Paid Accounts by quarter.
6. Add lower-performing partner visibility on the Partner Performance page.

Global changes:
- Remove the Commissions tab entirely.
- Remove all commission-related KPI cards, charts, tables, columns, callouts, formulas, references, tooltips, and data quality flags from every page.
- Remove Commission Earned, Commission Paid, Commission Outstanding, Average Commission per Won Deal, Payment Status, Paid Date, Missing Paid Date, Days Outstanding, and any related language.
- Remove the Approval Status slicer from the left-side filter rail.
- Remove approval status from all tables and visuals.
- On the Executive Overview page, change “Approved RPs” to “Active RPs.”
- Keep “Pending RPs” as a KPI.
- Remove “Approved” as a partner status concept throughout the dashboard.
- Keep the dashboard focused on partner activity, deal performance, pipeline conversion, geographic coverage, RP+ performance, acres, and lower-performing partners.

Updated tab structure:
- Executive Overview
- Partner Performance
- Deal Pipeline
- RP+ Network

Global slicer rail:
Keep these slicers:
- Time Frame / Relative Date
- Business Type
- Tier: RP vs RP+
- Deal Stage
- Pipeline
- Regional Manager
- Deal Value Range
- Acres Range
- State / Region

Remove this slicer:
- Approval Status

Page 1: Executive Overview

Update KPI cards to include:
- Active Referral Partners
- Pending Referral Partners
- RP+ Partners
- Total Referred Deals
- Open Deals
- Won Referral Deals
- Lost Referral Deals
- Total Referred Deal Value
- Won Deal Value
- Total Acres
- Conversion Rate
- Deals Entered Paid Accounts This Quarter

Remove:
- Approved RPs
- Any commission-related KPI cards
- Any commission-related data integrity checks

Add or keep visuals:
- Referred Deal Value by Month
- Deals by Stage
- New RP Acquisition Over Time
- Top 5 Referral Partners by Won Deal Value
- U.S. Referral Partner Location Map
- RP Deals Entering Paid Accounts by Quarter

U.S. Referral Partner Location Map requirements:
- Show a U.S. map with dots/bubbles representing referral partner locations.
- Bubble size should be controlled by a metric, such as total deal value, deal count, or acres.
- Include a small selector or legend showing “Bubble size by: Deal Value / Deal Count / Acres.”
- Use realistic mock locations across the U.S.
- Include state labels or hover-style location detail if possible.
- Make the map useful for understanding partner coverage and where value is coming from geographically.

RP Deals Entering Paid Accounts by Quarter:
- Add a bar or line chart showing the number of RP deals in the soils pipeline that entered Paid Accounts by quarter.
- Suggested placement: Executive Overview or Deal Pipeline tab.
- Use title: “RP Deals Entering Paid Accounts by Quarter”
- Include quarters on the x-axis, such as Q1 2025, Q2 2025, Q3 2025, Q4 2025, Q1 2026.
- Include deal count as the primary measure.
- Optional secondary metric: acres or deal value.

Data Integrity Check updates:
Keep a lighter data quality card, but remove commission checks.
Rows should include:
- Total Deals = Open + Won + Lost: Passed
- Conversion Rate = Won Deals / Total Referred Deals: Passed
- Referral Code Mapping Completeness: Needs Review
- RP+ Mapping Completeness: Needs Review
- Manual Referral Code Overrides: 2 Records

Page 2: Partner Performance

Update this page to show both high-performing and lower-performing partners.

KPI cards:
- Top RP Won Deal Value
- Average Conversion Rate
- Partners with 0 Deals
- Low Revenue Partners
- Inactive RPs
- New RPs This Quarter

Remove:
- RPs with Outstanding Commissions
- Commission Earned
- Commission Outstanding
- Approval Status / Status

High-performing visuals:
- Top 10 RPs by Won Deal Value
- Top 10 RPs by Deal Count
- Conversion Rate by Partner
- Average Deal Value by Business Type

Lower-performing partner visuals:
Add a new section titled “Lower Performing Partners”
Include:
- Partners with 0 Deals
- Partners with Low Revenue Generated
- Partners with Low Conversion Rate
- Inactive Partners by Days Since Last Deal

Suggested visuals:
- Horizontal bar chart: “Lowest Revenue Partners”
- Table: “Partners Needing Attention”
- Scatter plot: “Deal Count vs Deal Value by Partner” where low performers are visible in the bottom-left
- Optional segmentation by business type or regional manager

Partner detail table columns:
- Referral Partner Name
- Company / Organization
- Business Type
- Tier
- RP Added Date
- Referral Code
- Referral Link
- City
- State
- Regional Manager
- Deal Count
- Open Deals
- Won Deals
- Lost Deals
- Conversion Rate
- Total Deal Value
- Won Deal Value
- Total Acres
- Last Referred Deal Date
- Performance Segment
- Data Quality Flag

Remove from partner table:
- Approval Status
- Status
- Commission Earned
- Commission Outstanding
- Payment Status
- Paid Date

Performance Segment values:
- High Performer
- Moderate Performer
- Low Revenue
- Zero Deals
- Inactive

Conditional formatting:
- High performers = green badge
- Moderate performers = neutral badge
- Low revenue = yellow/orange badge
- Zero deals = red badge
- Inactive = gray badge
- Missing referral code = red warning icon

Page 3: Deal Pipeline

Keep pipeline health and stage movement as the main purpose of this page.

KPI cards:
- Total Referred Deals
- Open Pipeline Value
- Won Deal Value
- Lost Deal Value
- Total Acres
- Average Deal Value
- Average Acres per Deal
- Deals Entered Paid Accounts This Quarter

Visuals:
- Pipeline Funnel: Lead Submitted → Boa Safra Review → Agreement Sent → RFS Submitted → In Contracting → Paid Accounts / Won
- Deal Value by Stage
- Deal Count by Stage
- Acres by Stage
- Deals Added Over Time
- Stage Aging / Days in Current Stage
- Pipeline by Business Type
- RP Deals Entering Paid Accounts by Quarter

RP Deals Entering Paid Accounts by Quarter:
- This visual can live here if it does not fit on Executive Overview.
- It should clearly show RP deal flow into Paid Accounts over time.
- Use a quarterly trend chart or clustered column chart.
- Add optional breakdown by business type or regional manager.

Deal detail table columns:
- Deal Name
- Referral Partner
- Referral Code
- Pipeline
- Deal Stage
- Deal Added Date
- Last Change Date
- Date Entered Paid Accounts
- Days in Stage
- Deal Value
- Acres
- Status: Open / Won / Lost / Paid Account
- Manual vs Automated Referral Code
- Data Quality Flag

Remove from deal table:
- Commission Status
- Any commission-related fields

Visual flags:
- Deals stuck in stage more than 30 days
- Deals missing referral code
- Deals with manual referral override
- Deals with unusually high value
- Deals recently entered Paid Accounts

Page 4: RP+ Network

Keep this page, but remove any commission or split-value language that sounds financial.

KPI cards:
- Active RP+ Partners
- Downstream RPs Recruited
- Downstream Deals
- Downstream Won Deals
- Downstream Won Deal Value
- RP+ Contribution % of Total Won Value
- Incomplete RP+ Mappings

Remove:
- RP+ Commission / Split Value
- Commission-related split calculations

Visuals:
- RP+ to Downstream RP relationship table or simple network-style visual
- Downstream Deal Value by RP+
- New Downstream RPs Over Time
- RP+ Contribution by Business Type
- RP+ Conversion Rate vs Standard RP Conversion Rate
- Downstream Acres by RP+

RP+ relationship table columns:
- Recruiting RP+
- Downstream RP
- Downstream RP Company
- RP+ Date
- RP Added Date
- Downstream Deal Count
- Downstream Won Deals
- Downstream Won Deal Value
- Downstream Acres
- Mapping Status
- Data Quality Flag

Remove from RP+ table:
- Split Rate if it is only used for commission
- RP+ Commission Value
- Any commission or payout references

Add insight callouts:
- Top Recruiting RP+
- Highest Downstream Won Value
- RP+ Network Conversion Rate
- RP+ Data Completeness %
- Downstream Acres Contribution

Map mock data requirements:
Add geographic fields to partner mock data:
- City
- State
- Latitude
- Longitude
- Region

Use realistic sample locations:
- Des Moines, IA
- Omaha, NE
- Kansas City, MO
- Sioux Falls, SD
- Fargo, ND
- Minneapolis, MN
- Springfield, IL
- Indianapolis, IN
- Columbus, OH
- Lincoln, NE
- Wichita, KS
- Madison, WI
- Peoria, IL
- Cedar Rapids, IA
- St. Louis, MO

Map bubble size options:
- Total Deal Value
- Deal Count
- Total Acres

Mock data and tie-out rules:
Use realistic mock data and make sure values reconcile across pages.

Suggested updated mock values:
- Active Referral Partners: 128
- Pending Referral Partners: 14
- RP+ Partners: 18
- Total Referred Deals: 342
- Open Deals: 197
- Won Deals: 89
- Lost Deals: 56
- Conversion Rate: 26.0%
- Total Referred Deal Value: $18.7M
- Won Deal Value: $6.4M
- Total Acres: 42,850
- Deals Entered Paid Accounts This Quarter: 31
- Partners with 0 Deals: 12
- Low Revenue Partners: 18
- Inactive RPs: 22
- RP+ Contribution to Won Value: 21%
- Incomplete RP+ Mappings: 4
- Manual Referral Code Overrides: 2

Tie-out rules:
- Total Referred Deals = Open Deals + Won Deals + Lost Deals.
- Conversion Rate = Won Deals / Total Referred Deals.
- Total Referred Deal Value = sum of all deal values.
- Won Deal Value = sum of won deal values.
- Total Acres = sum of deal acres.
- Deals Entered Paid Accounts by Quarter should tie to the Paid Accounts count.
- Partner-level deal totals should tie to the deal table.
- RP+ downstream values should tie to downstream partner/deal data.
- Map bubble size should tie to selected metric: deal value, deal count, or acres.

Use sample partner names:
- Prairie Ridge Advisors
- Miller Land Group
- AgPath Consulting
- Greenline Partners
- Midwest Farm Strategies
- HarvestPoint Advisors
- Stone Creek Ag
- Northstar Rural Partners
- FieldBridge Consulting
- CountyLine Ag Services
- Great Plains Referral Group
- Heartland Ag Partners
- Riverbend Rural Advisors
- Corn Belt Consulting
- Legacy Land Advisors

Use sample business types:
- General Referral Source
- Individual / Small Business
- Corporation
- Strategic Partner
- Regional Affiliate

Use sample stages:
- Lead Submitted
- Boa Safra Review
- Agreement Sent
- RFS Submitted
- In Contracting
- Paid Accounts
- Won
- Lost

Use sample pipelines:
- Referral Partner Pipeline
- Soils Pipeline
- RFS Pipeline
- Contracting Pipeline

Final polish requirements:
- Keep the report executive-friendly but operationally useful.
- Remove all commission references completely.
- Make the map visually prominent but not oversized.
- Make lower-performing partners easy to identify.
- Add tooltips/info icons for Conversion Rate, Paid Accounts, RP+ Contribution %, and Data Quality Notes.
- Keep chart titles business-friendly and action-oriented.
- Avoid duplicate visuals that say the same thing.
- Ensure every page has one clear takeaway.
- Maintain the Power BI-style layout so it can be rebuilt as a .pbix.