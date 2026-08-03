Update the existing Referral Partner Dashboard to a V3 “client demo ready” version.

Keep the current V2 structure and do not rebuild from scratch. Preserve the existing multi-page Power BI-style dashboard with these tabs:
- Executive Overview
- Partner Performance
- Deal Pipeline
- Commissions
- RP+ Network

The goal of V3 is to strengthen trust, tie-out logic, decision-making, and client readiness. This version should feel like something we can show to Boa Safra leadership, finance, sales, and operations.

Global design direction:
- Keep the clean Power BI lift-and-shift style.
- Keep the left-side slicer rail.
- Use professional enterprise dashboard styling.
- Prioritize readability, data density, and realistic operational usefulness.
- Avoid marketing-style visuals or oversized decorative graphics.
- Make the report feel embedded, practical, and client-ready.

Global slicer rail updates:
Ensure the left-side slicers include:
- Time Frame / Relative Date
- Business Type
- Tier: RP vs RP+
- Approval Status
- Deal Stage
- Pipeline
- Regional Manager
- Deal Value Range
- Acres Range

Add a small “Last Refreshed” label near the header:
- Last Refreshed: Apr 24, 2026, 8:15 AM
- Data Source: Pipedrive + Referral Partner Mapping

Add a persistent “Data Quality Notes” card to the slicer rail or page footer:
- RP+ mapping is partially complete
- Paid date is missing for 3 commission records
- 2 referral deals have manual referral code overrides

Page 1: Executive Overview

Improve this page so the numbers clearly tie out.

KPI cards:
- Active Referral Partners
- Approved RPs
- Pending RPs
- RP+ Partners
- Total Referred Deals
- Open Deals
- Won Referral Deals
- Lost Referral Deals
- Total Referred Deal Value
- Total Acres
- Conversion Rate
- Total Commission Earned
- Commission Paid
- Commission Outstanding

Add a “Data Integrity Check” card with the following rows:
- Total Deals = Open + Won + Lost: Passed
- Commission Earned = Won Deal Value x RP Rate: Passed
- Commission Outstanding = Earned - Paid: Passed
- RP+ Mapping Completeness: Needs Review
- Missing Paid Dates: 3 Records

Use status badges:
- Green badge for Passed
- Yellow badge for Needs Review
- Red badge for Missing / Issue

Add executive insight callouts:
- Best Performing RP by Won Deal Value
- Highest Conversion RP
- Largest Outstanding Commission
- RP+ Contribution to Total Won Value

Make the Executive Overview answer:
- How big is the referral partner program?
- How much revenue/value is coming from it?
- How much commission is owed?
- Are there any data quality issues?

Page 2: Partner Performance

Improve this page so it helps the client decide which partners are performing well and which need attention.

Add KPI cards:
- Top RP Won Deal Value
- Average Conversion Rate
- Inactive RPs
- RPs with Outstanding Commissions
- New RPs This Quarter

Add ranked visuals:
- Top 10 RPs by Won Deal Value
- Top 10 RPs by Deal Count
- Lowest Conversion RPs
- Inactive RPs by Days Since Last Deal

Add partner-level conversion visual:
- Conversion Rate by Partner
- Segment by Business Type if possible

Enhance partner table columns:
- Referral Partner Name
- Company / Organization
- Business Type
- Tier
- Approval Status
- RP Added Date
- Referral Code
- Referral Link
- Regional Manager
- Deal Count
- Open Deals
- Won Deals
- Lost Deals
- Conversion Rate
- Total Deal Value
- Won Deal Value
- Total Acres
- Commission Earned
- Commission Outstanding
- Last Referred Deal Date
- Data Quality Flag

Add conditional formatting:
- High conversion rate = green
- Low conversion rate = red
- Outstanding commission = yellow/orange
- Missing referral code or missing paid date = red warning icon
- Inactive partner = gray badge

Page 3: Deal Pipeline

Improve this page so it clearly shows pipeline health and deal movement.

Add KPI cards:
- Total Referred Deals
- Open Pipeline Value
- Won Deal Value
- Lost Deal Value
- Total Acres
- Average Deal Value
- Average Acres per Deal

Add visuals:
- Pipeline Funnel: Lead Submitted → Boa Safra Review → Agreement Sent → RFS Submitted → In Contracting → Won
- Deal Value by Stage
- Deal Count by Stage
- Acres by Stage
- Deals Added Over Time
- Stage Aging / Days in Current Stage
- Pipeline by Business Type

Add a deal-level detail table with:
- Deal Name
- Referral Partner
- Referral Code
- Pipeline
- Deal Stage
- Deal Added Date
- Last Change Date
- Days in Stage
- Deal Value
- Acres
- Status: Open / Won / Lost
- Commission Status
- Manual vs Automated Referral Code
- Data Quality Flag

Add visual flags:
- Deals stuck in stage more than 30 days
- Deals missing referral code
- Deals with manual referral override
- Deals with unusually high value

Page 4: Commissions

Improve this page for finance use.

KPI cards:
- Total Commission Earned
- Total Commission Paid
- Total Commission Outstanding
- Average Commission per Won Deal
- RPs with Outstanding Payments
- Missing Paid Date Records

Add visuals:
- Commission Earned vs Paid by Month
- Outstanding Commission by Referral Partner
- Commission by Business Type
- Payment Status Donut: Paid / Outstanding / Pending Review
- Commission Aging Buckets: 0-30, 31-60, 61-90, 90+ days
- Paid Date Completeness

Commission table columns:
- Referral Partner
- Company
- Deal Name
- Deal Value
- Won Date
- Rate
- Commission Earned
- Commission Paid
- Commission Outstanding
- RP Paid Date
- Days Outstanding
- Payment Status
- Data Quality Flag

Conditional formatting:
- Paid = green
- Outstanding = yellow/orange
- 90+ days outstanding = red
- Missing paid date = red warning icon
- Pending review = blue/gray

Add a finance callout:
- “Outstanding commission is calculated as Commission Earned minus Commission Paid.”
- “Commission Earned is calculated from Won Deal Value and Partner Rate.”

Page 5: RP+ Network

Improve this page so it answers whether RP+ is working.

KPI cards:
- Active RP+ Partners
- Downstream RPs Recruited
- Downstream Deals
- Downstream Won Deals
- Downstream Won Deal Value
- RP+ Contribution % of Total Won Value
- RP+ Commission / Split Value
- Incomplete RP+ Mappings

Add visuals:
- RP+ to Downstream RP relationship table or simple network-style visual
- Downstream Deal Value by RP+
- New Downstream RPs Over Time
- RP+ Split Rate by Recruiting Partner
- RP+ Contribution by Business Type
- RP+ Conversion Rate vs Standard RP Conversion Rate

RP+ relationship table columns:
- Recruiting RP+
- Downstream RP
- Downstream RP Company
- RP+ Date
- RP Added Date
- Split Rate
- Downstream Deal Count
- Downstream Won Deals
- Downstream Won Deal Value
- RP+ Commission Value
- Mapping Status
- Data Quality Flag

Add insight callouts:
- Top Recruiting RP+
- Highest Downstream Won Value
- RP+ Network Conversion Rate
- RP+ Data Completeness %

Add warning state:
- Show a yellow “RP+ Mapping Needs Review” alert if there are incomplete upstream/downstream mappings.

Mock data and tie-out rules:
Use realistic mock data and make sure values reconcile across pages.

Use these tie-out rules:
- Total Referred Deals = Open Deals + Won Deals + Lost Deals.
- Conversion Rate = Won Deals / Total Referred Deals.
- Total Referred Deal Value = sum of all deal values.
- Won Deal Value = sum of won deal values.
- Commission Earned = Won Deal Value x Referral Partner Rate.
- Commission Outstanding = Commission Earned - Commission Paid.
- RP+ Downstream Won Value should tie to RP+ Contribution %.
- Acres should appear in both the Executive Overview and Deal Pipeline.
- Partner-level deal totals should tie to the deal table.
- Commission page totals should tie to the Executive Overview commission cards.

Suggested realistic mock values:
- Active Referral Partners: 128
- Approved RPs: 114
- Pending RPs: 14
- RP+ Partners: 18
- Total Referred Deals: 342
- Open Deals: 197
- Won Deals: 89
- Lost Deals: 56
- Conversion Rate: 26.0%
- Total Referred Deal Value: $18.7M
- Won Deal Value: $6.4M
- Total Acres: 42,850
- Commission Earned: $512K
- Commission Paid: $394K
- Commission Outstanding: $118K
- RP+ Contribution to Won Value: 21%
- Incomplete RP+ Mappings: 4
- Missing Paid Dates: 3

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
- Won
- Lost

Use sample pipelines:
- Referral Partner Pipeline
- RFS Pipeline
- Contracting Pipeline

Final polish requirements:
- Add info icons/tooltips next to Conversion Rate, Commission Outstanding, RP+ Contribution %, and Data Integrity Check.
- Add sortable-looking table headers.
- Add subtle row highlighting for exception rows.
- Keep chart titles business-friendly and action-oriented.
- Avoid duplicate visuals that say the same thing.
- Ensure each page has one clear “what should I learn here?” takeaway.
- Make this feel like a polished client demo, not a rough prototype.