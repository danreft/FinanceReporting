Update this Referral Partner Dashboard to a V2 version that more fully aligns with the Referral Partner Reporting requirements.

Keep the existing Power BI lift-and-shift style: clean enterprise dashboard, card-based KPI layout, slicer rail, muted professional colors, readable tables, and realistic mock data. Do not make it look like a marketing website. It should feel like an embedded Power BI report used by Boa Safra leadership, finance, sales, and operations.

Primary goal:
Expand the dashboard from a high-level referral partner summary into a complete reporting solution that covers:
1. Referral Partner performance
2. Deal pipeline and stage distribution
3. Conversion performance
4. Commission activity
5. RP+ recruiting/downstream partner performance

Create a multi-page dashboard experience with tabs across the top:
- Executive Overview
- Partner Performance
- Deal Pipeline
- Commissions
- RP+ Network

Global slicer panel:
Keep a left-side slicer rail across all pages with:
- Time Frame / Relative Date
- Business Type
- Tier: RP vs RP+
- Approval Status
- Deal Stage
- Pipeline
- Regional Manager
- Deal Value Range
- Acres Range

Page 1: Executive Overview
Include KPI cards:
- Active Referral Partners
- Approved RPs
- Pending RPs
- RP+ Partners
- Total Referred Deals
- Won Referral Deals
- Total Referred Deal Value
- Conversion Rate
- Total Commission Earned
- Commission Paid
- Commission Outstanding

Add visuals:
- Referred Deal Value by Month
- Deals by Stage
- New RP Acquisition Over Time
- Top 5 Referral Partners by Won Deal Value
- Small callout card for data gaps / RP+ program maturity

Page 2: Partner Performance
Show partner-level performance.
Include:
- Top Referral Partners by Deal Count
- Top Referral Partners by Deal Value
- Conversion Rate by Partner
- Average Deal Value by Business Type
- Partner detail table

Partner table columns:
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
- Won Deals
- Conversion Rate
- Total Deal Value
- Commission Earned
- Commission Outstanding

Page 3: Deal Pipeline
Show pipeline health and stage distribution.
Include:
- Deals by Stage funnel or stacked bar
- Deal Value by Stage
- Deals by Pipeline
- Acres by Stage
- Referred Deals Added Over Time
- Deal detail table

Deal table columns:
- Deal Name
- Referral Partner
- Referral Code
- Pipeline
- Deal Stage
- Deal Added Date
- Last Change Date
- Deal Value
- Acres
- Status: Open / Won / Lost
- Commission Status

Page 4: Commissions
This is a critical missing requirement. Add a dedicated commission tracking page.
Include KPI cards:
- Total Commission Earned
- Total Commission Paid
- Total Commission Outstanding
- Average Commission per Won Deal
- RPs with Outstanding Payments

Add visuals:
- Commission Earned vs Paid by Month
- Outstanding Commission by Referral Partner
- Commission by Business Type
- Payment Status Donut: Paid / Outstanding / Pending Review

Commission table columns:
- Referral Partner
- Company
- Deal Name
- Deal Value
- Rate
- Commission Earned
- Commission Paid
- Commission Outstanding
- RP Paid Date
- Payment Status

Page 5: RP+ Network
Create a page specifically for RP+ performance and upstream/downstream partner relationships.
Include KPI cards:
- Active RP+ Partners
- Downstream RPs Recruited
- Downstream Deals
- Downstream Won Deal Value
- RP+ Commission / Split Value

Add visuals:
- RP+ to Downstream RP relationship table or network-style visual
- Downstream Deal Value by RP+
- New Downstream RPs Over Time
- RP+ Split Rate by Recruiting Partner

RP+ relationship table columns:
- Recruiting RP+
- Downstream RP
- RP+ Date
- RP Added Date
- Split Rate
- Downstream Deal Count
- Downstream Won Deals
- Downstream Deal Value
- RP+ Commission Value

Mock data requirements:
Use realistic mock data that ties out across visuals. Make sure totals reconcile:
- Total Referred Deals should equal the sum of open, won, and lost deals.
- Total Referred Deal Value should equal the sum of deal values shown in the detail table.
- Won Referral Deals should tie to the conversion rate.
- Commission Earned should be calculated from won deal value times partner rate.
- Commission Outstanding should equal Commission Earned minus Commission Paid.
- RP+ downstream deal values should tie to the RP+ page totals.

Use sample business types:
- General Referral Source
- Individual / Small Business
- Corporation
- Strategic Partner
- Regional Affiliate

Use sample tiers:
- RP
- RP+

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

UX improvements:
- Add a small “Data Quality Notes” card where RP+ data gaps can be surfaced.
- Add hover-style helper text or info icons on complex metrics like Conversion Rate, Commission Outstanding, and RP+ Split Value.
- Make tables dense and Power BI-like, with sortable-looking column headers.
- Use conditional formatting in tables:
  - Green for paid commissions
  - Yellow/orange for outstanding
  - Red for missing RP+ mapping or missing paid date
- Keep the design executive-friendly but detailed enough for finance and operations.

Visual style:
- Keep the existing layout direction.
- Use professional Power BI-style cards and charts.
- Avoid oversized decorative graphics.
- Prioritize readability, alignment, and data density.
- Keep everything realistic and client-ready.