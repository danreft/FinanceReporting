// V3 Updated Mock Data - Referral Partner performance and TAM model

type ActiveStatus = 'Active' | 'Pending' | 'Inactive';

export interface ReferralPartnerRecord {
  referralPartnerId: string;
  referralPartnerName: string;
  isConciergeRp: boolean;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  dealCount: number;
  totalDealValue: number;
  acres: number;
  averageDealValue: number;
  activeStatus: ActiveStatus;
  company: string;
  businessType: string;
  tier: 'RP' | 'RP+';
  addedDate: string;
  referralCode: string | null;
  referralLink: string | null;
  regionalManager: string;
  associateRpm?: string;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  wonValue: number;
  lastDealDate: string | null;
  performanceSegment: string;
  dataQualityFlag: string | null;
}

type ReferralPartnerInput = Omit<ReferralPartnerRecord, 'averageDealValue'>;

export interface AgriculturalMarketState {
  state: string;
  stateName: string;
  region: string;
  agriculturalAcres: number;
  avgFarmSize: number;
  currentRps: number;
}

export interface TimeFrameFilterValue {
  selectedMonths?: string[];
  useCustom?: boolean;
  customStart?: string;
  customEnd?: string;
}

export interface RpmFilterValue {
  rpm: string;
  associate?: string;
}

export interface DashboardFilters {
  timeFrame?: TimeFrameFilterValue;
  businessType?: string;
  tier?: string;
  dealStage?: string;
  rpm?: RpmFilterValue;
  dealValueRange?: string;
  acresRange?: string;
  stateRegion?: string;
}

const currencyShort = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(value >= 10000000 ? 1 : 2)}M`;
  return `$${(value / 1000).toFixed(0)}K`;
};

const wholeNumber = (value: number) => Math.round(value).toLocaleString();
const percent = (value: number) => `${value.toFixed(1)}%`;

const calculateAverageDealValue = (totalDealValue: number, dealCount: number) =>
  dealCount > 0 ? totalDealValue / dealCount : 0;

const withCalculatedAverage = (partner: ReferralPartnerInput): ReferralPartnerRecord => ({
  ...partner,
  averageDealValue: calculateAverageDealValue(partner.totalDealValue, partner.dealCount),
});

const sumBy = <T,>(rows: T[], selector: (row: T) => number) =>
  rows.reduce((sum, row) => sum + selector(row), 0);

const sortDesc = <T,>(rows: T[], selector: (row: T) => number) =>
  [...rows].sort((a, b) => selector(b) - selector(a));

const take = <T,>(rows: T[], count: number) => rows.slice(0, count);

const rpAgreementTypeByBusinessType: Record<string, string> = {
  Corporation: 'Corporation',
  'Individual / Small Business': 'Individual/Small Business',
  'General Referral Source': 'Referral Source',
  'Strategic Partner': 'Discount',
  'Regional Affiliate': 'Discount',
};

const incentivePayoutRateByAgreementType: Record<string, number> = {
  Corporation: 0.06,
  'Individual/Small Business': 0.1,
  Discount: 0.15,
  'Referral Source': 0.08,
};

const getRpAgreementType = (businessType: string) => rpAgreementTypeByBusinessType[businessType] ?? 'Referral Source';

const filterValueMap: Record<string, string> = {
  general: 'General Referral Source',
  individual: 'Individual / Small Business',
  corporation: 'Corporation',
  strategic: 'Strategic Partner',
  regional: 'Regional Affiliate',
  clayton_mason: 'Clayton Mason',
  dave_stamp: 'Dave Stamp',
  james_st_peter: 'James St. Peter',
  max_davis: 'Max Davis',
  nicolas_post: 'Nicolas Post',
  reagan_gross: 'Reagan Gross',
  emily_ross: 'Emily Ross',
  brian_coyle: 'Brian Coyle',
  megan_price: 'Megan Price',
  tyler_combs: 'Tyler Combs',
  rachel_nguyen: 'Rachel Nguyen',
  derek_holt: 'Derek Holt',
  sophia_turner: 'Sophia Turner',
  jacob_reyes: 'Jacob Reyes',
  hannah_kim: 'Hannah Kim',
  marcus_bell: 'Marcus Bell',
  olivia_grant: 'Olivia Grant',
  ethan_walsh: 'Ethan Walsh',
};

// RPM territory assignment by state (USPS abbreviation), matching the six-region
// map shown on the RPM Performance tab. Also used to keep each partner's
// `regionalManager` consistent with the state they're based in.
export const rpmRegionByState: Record<string, { rpm: string; region: string }> = {
  WA: { rpm: 'Max Davis', region: 'West' },
  OR: { rpm: 'Max Davis', region: 'West' },
  CA: { rpm: 'Max Davis', region: 'West' },
  NV: { rpm: 'Max Davis', region: 'West' },
  ID: { rpm: 'Max Davis', region: 'West' },
  UT: { rpm: 'Max Davis', region: 'West' },
  AZ: { rpm: 'Max Davis', region: 'West' },

  MT: { rpm: 'Nicolas Post', region: 'Mountain / Plains' },
  WY: { rpm: 'Nicolas Post', region: 'Mountain / Plains' },
  ND: { rpm: 'Nicolas Post', region: 'Mountain / Plains' },
  SD: { rpm: 'Nicolas Post', region: 'Mountain / Plains' },
  CO: { rpm: 'Nicolas Post', region: 'Mountain / Plains' },

  MN: { rpm: 'Dave Stamp', region: 'Upper Midwest' },
  IA: { rpm: 'Dave Stamp', region: 'Upper Midwest' },
  NE: { rpm: 'Dave Stamp', region: 'Upper Midwest' },
  KS: { rpm: 'Dave Stamp', region: 'Upper Midwest' },
  MO: { rpm: 'Dave Stamp', region: 'Upper Midwest' },
  WI: { rpm: 'Dave Stamp', region: 'Upper Midwest' },
  IL: { rpm: 'Dave Stamp', region: 'Upper Midwest' },
  MI: { rpm: 'Dave Stamp', region: 'Upper Midwest' },

  NM: { rpm: 'James St. Peter', region: 'South Central' },
  TX: { rpm: 'James St. Peter', region: 'South Central' },
  OK: { rpm: 'James St. Peter', region: 'South Central' },
  LA: { rpm: 'James St. Peter', region: 'South Central' },
  AR: { rpm: 'James St. Peter', region: 'South Central' },

  MS: { rpm: 'Clayton Mason', region: 'Southeast' },
  TN: { rpm: 'Clayton Mason', region: 'Southeast' },
  KY: { rpm: 'Clayton Mason', region: 'Southeast' },
  AL: { rpm: 'Clayton Mason', region: 'Southeast' },
  GA: { rpm: 'Clayton Mason', region: 'Southeast' },
  FL: { rpm: 'Clayton Mason', region: 'Southeast' },
  SC: { rpm: 'Clayton Mason', region: 'Southeast' },
  NC: { rpm: 'Clayton Mason', region: 'Southeast' },

  IN: { rpm: 'Reagan Gross', region: 'Northeast' },
  OH: { rpm: 'Reagan Gross', region: 'Northeast' },
  WV: { rpm: 'Reagan Gross', region: 'Northeast' },
  VA: { rpm: 'Reagan Gross', region: 'Northeast' },
  PA: { rpm: 'Reagan Gross', region: 'Northeast' },
  NY: { rpm: 'Reagan Gross', region: 'Northeast' },
  NJ: { rpm: 'Reagan Gross', region: 'Northeast' },
  DE: { rpm: 'Reagan Gross', region: 'Northeast' },
  MD: { rpm: 'Reagan Gross', region: 'Northeast' },
  CT: { rpm: 'Reagan Gross', region: 'Northeast' },
  RI: { rpm: 'Reagan Gross', region: 'Northeast' },
  MA: { rpm: 'Reagan Gross', region: 'Northeast' },
  VT: { rpm: 'Reagan Gross', region: 'Northeast' },
  NH: { rpm: 'Reagan Gross', region: 'Northeast' },
  ME: { rpm: 'Reagan Gross', region: 'Northeast' },
  DC: { rpm: 'Reagan Gross', region: 'Northeast' },
};

// Two Associate RPMs report to each RPM. There's no per-partner association data,
// so each Associate's book of business is modeled as a fixed split of their RPM's totals.
export const associateRpmsByRpm: Record<string, [string, string]> = {
  'Clayton Mason': ['Emily Ross', 'Brian Coyle'],
  'Dave Stamp': ['Megan Price', 'Tyler Combs'],
  'James St. Peter': ['Rachel Nguyen', 'Derek Holt'],
  'Max Davis': ['Sophia Turner', 'Jacob Reyes'],
  'Nicolas Post': ['Hannah Kim', 'Marcus Bell'],
  'Reagan Gross': ['Olivia Grant', 'Ethan Walsh'],
};
const rpmPayoutRate = 0.03;

const matchesTimeFrame = (addedDate: string, timeFrame?: TimeFrameFilterValue): boolean => {
  const selectedMonths = timeFrame?.selectedMonths ?? [];
  const hasCustom = Boolean(timeFrame?.useCustom && timeFrame?.customStart && timeFrame?.customEnd);

  if (selectedMonths.length === 0 && !hasCustom) return true;

  if (selectedMonths.includes(addedDate.slice(0, 7))) return true;

  if (hasCustom && addedDate >= timeFrame!.customStart! && addedDate <= timeFrame!.customEnd!) return true;

  return false;
};

const filterReferralPartners = (partners: ReferralPartnerRecord[], filters: DashboardFilters = {}) => {
  return partners.filter((partner) => {
    if (!matchesTimeFrame(partner.addedDate, filters.timeFrame)) {
      return false;
    }

    if (filters.businessType && filters.businessType !== 'all' && partner.businessType !== filterValueMap[filters.businessType]) {
      return false;
    }

    if (filters.tier && filters.tier !== 'all' && partner.tier.toLowerCase() !== filters.tier) {
      return false;
    }

    if (filters.rpm?.rpm && filters.rpm.rpm !== 'all' && partner.regionalManager !== filterValueMap[filters.rpm.rpm]) {
      return false;
    }

    if (filters.rpm?.associate && filters.rpm.associate !== 'all' && partner.associateRpm !== filterValueMap[filters.rpm.associate]) {
      return false;
    }

    if (filters.stateRegion && filters.stateRegion !== 'all' && partner.state.toLowerCase() !== filters.stateRegion) {
      return false;
    }

    if (filters.dealValueRange && filters.dealValueRange !== 'all') {
      const value = partner.totalDealValue;
      if (filters.dealValueRange === '0-50k' && value > 50000) return false;
      if (filters.dealValueRange === '50k-100k' && (value < 50000 || value > 100000)) return false;
      if (filters.dealValueRange === '100k-250k' && (value < 100000 || value > 250000)) return false;
      if (filters.dealValueRange === '250k+' && value < 250000) return false;
    }

    if (filters.acresRange && filters.acresRange !== 'all') {
      const acres = partner.acres;
      if (filters.acresRange === '0-1000' && acres > 1000) return false;
      if (filters.acresRange === '1000-2500' && (acres < 1000 || acres > 2500)) return false;
      if (filters.acresRange === '2500-5000' && (acres < 2500 || acres > 5000)) return false;
      if (filters.acresRange === '5000+' && acres < 5000) return false;
    }

    return true;
  });
};

const distributeByWeight = (total: number, weights: number[]) => {
  const exactValues = weights.map((weight) => total * weight);
  const floors = exactValues.map(Math.floor);
  let remainder = total - sumBy(floors, (value) => value);

  return floors.map((value, index) => {
    if (index === floors.length - 1) return value + remainder;
    const roundedUp = Math.round(exactValues[index]) > value && remainder > 0;
    if (!roundedUp) return value;
    remainder -= 1;
    return value + 1;
  });
};

const getMarketPotentialByState = (partners: ReferralPartnerRecord[]) => {
  const stateNames: Record<string, { stateName: string; region: string }> = {
    CA: { stateName: 'California', region: 'West' },
    CO: { stateName: 'Colorado', region: 'Mountain West' },
    IA: { stateName: 'Iowa', region: 'Midwest' },
    IL: { stateName: 'Illinois', region: 'Midwest' },
    IN: { stateName: 'Indiana', region: 'Midwest' },
    KS: { stateName: 'Kansas', region: 'Great Plains' },
    MN: { stateName: 'Minnesota', region: 'Upper Midwest' },
    MO: { stateName: 'Missouri', region: 'Midwest' },
    ND: { stateName: 'North Dakota', region: 'Great Plains' },
    NE: { stateName: 'Nebraska', region: 'Great Plains' },
    OH: { stateName: 'Ohio', region: 'Midwest' },
    SD: { stateName: 'South Dakota', region: 'Great Plains' },
    TX: { stateName: 'Texas', region: 'South Central' },
    WI: { stateName: 'Wisconsin', region: 'Upper Midwest' },
  };

  const grouped = partners.reduce<Record<string, ReferralPartnerRecord[]>>((groups, partner) => {
    groups[partner.state] = groups[partner.state] ?? [];
    groups[partner.state].push(partner);
    return groups;
  }, {});

  return Object.entries(grouped).map(([state, statePartners]) => {
    const rpCount = statePartners.length;
    const totalDealValue = sumBy(statePartners, (partner) => partner.totalDealValue);
    const dealCount = sumBy(statePartners, (partner) => partner.dealCount);
    const avgDealValuePerRp = calculateAverageDealValue(totalDealValue, dealCount);
    const marketPotential = rpCount * avgDealValuePerRp;

    return {
      state,
      stateName: stateNames[state]?.stateName ?? state,
      region: stateNames[state]?.region ?? 'Other',
      rpCount,
      dealCount,
      totalDealValue,
      avgDealValuePerRp,
      marketPotential,
    };
  });
};

const agricultureReferenceData = [
  { state: 'TX', stateName: 'Texas', region: 'South Central', agriculturalAcres: 126500000, avgFarmSize: 545 },
  { state: 'MT', stateName: 'Montana', region: 'Mountain West', agriculturalAcres: 58000000, avgFarmSize: 2213 },
  { state: 'KS', stateName: 'Kansas', region: 'Great Plains', agriculturalAcres: 45700000, avgFarmSize: 781 },
  { state: 'NE', stateName: 'Nebraska', region: 'Great Plains', agriculturalAcres: 44300000, avgFarmSize: 997 },
  { state: 'SD', stateName: 'South Dakota', region: 'Great Plains', agriculturalAcres: 43100000, avgFarmSize: 1395 },
  { state: 'ND', stateName: 'North Dakota', region: 'Great Plains', agriculturalAcres: 39000000, avgFarmSize: 1506 },
  { state: 'IA', stateName: 'Iowa', region: 'Midwest', agriculturalAcres: 30500000, avgFarmSize: 359 },
  { state: 'MO', stateName: 'Missouri', region: 'Midwest', agriculturalAcres: 27500000, avgFarmSize: 291 },
  { state: 'IL', stateName: 'Illinois', region: 'Midwest', agriculturalAcres: 26800000, avgFarmSize: 383 },
  { state: 'MN', stateName: 'Minnesota', region: 'Upper Midwest', agriculturalAcres: 25500000, avgFarmSize: 371 },
  { state: 'CO', stateName: 'Colorado', region: 'Mountain West', agriculturalAcres: 31800000, avgFarmSize: 817 },
  { state: 'CA', stateName: 'California', region: 'West', agriculturalAcres: 24400000, avgFarmSize: 348 },
  { state: 'WI', stateName: 'Wisconsin', region: 'Upper Midwest', agriculturalAcres: 14300000, avgFarmSize: 221 },
  { state: 'IN', stateName: 'Indiana', region: 'Midwest', agriculturalAcres: 14800000, avgFarmSize: 264 },
  { state: 'OH', stateName: 'Ohio', region: 'Midwest', agriculturalAcres: 13700000, avgFarmSize: 188 },
  { state: 'AR', stateName: 'Arkansas', region: 'South Central', agriculturalAcres: 13700000, avgFarmSize: 308 },
  { state: 'OK', stateName: 'Oklahoma', region: 'South Central', agriculturalAcres: 34000000, avgFarmSize: 469 },
  { state: 'WY', stateName: 'Wyoming', region: 'Mountain West', agriculturalAcres: 29000000, avgFarmSize: 2581 },
  { state: 'ID', stateName: 'Idaho', region: 'Mountain West', agriculturalAcres: 11300000, avgFarmSize: 467 },
  { state: 'MS', stateName: 'Mississippi', region: 'Southeast', agriculturalAcres: 10300000, avgFarmSize: 286 },
];

const getAgriculturalMarketStates = (partners: ReferralPartnerRecord[]): AgriculturalMarketState[] => {
  const currentRpsByState = partners.filter((partner) => partner.activeStatus === 'Active').reduce<Record<string, number>>((counts, partner) => {
    counts[partner.state] = (counts[partner.state] ?? 0) + 1;
    return counts;
  }, {});

  return agricultureReferenceData.map((state) => ({
    ...state,
    currentRps: currentRpsByState[state.state] ?? 0,
  }));
};

export const generateMockDataV3Updated = (filters: DashboardFilters = {}) => {
  const associateAssignmentCounters: Record<string, number> = {};
  const allReferralPartners = [
    {
      referralPartnerId: 'RP-001',
      referralPartnerName: 'Prairie Ridge Advisors',
      isConciergeRp: true,
      city: 'Des Moines',
      state: 'IA',
      latitude: 41.5868,
      longitude: -93.625,
      dealCount: 38,
      totalDealValue: 2180000,
      acres: 5420,
      activeStatus: 'Active',
      company: 'Prairie Ridge Consulting LLC',
      businessType: 'Corporation',
      tier: 'RP+',
      addedDate: '2025-08-15',
      referralCode: 'PRAIRIE2025',
      referralLink: 'boasafra.com/ref/PRAIRIE2025',
      regionalManager: 'Sarah Chen',
      openDeals: 14,
      wonDeals: 18,
      lostDeals: 6,
      wonValue: 845000,
      lastDealDate: '2026-04-18',
      performanceSegment: 'High Performer',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-002',
      referralPartnerName: 'Miller Land Group',
      isConciergeRp: true,
      city: 'Omaha',
      state: 'NE',
      latitude: 41.2565,
      longitude: -95.9345,
      dealCount: 32,
      totalDealValue: 1840000,
      acres: 4680,
      activeStatus: 'Active',
      company: 'Miller Land & Ag Services',
      businessType: 'Strategic Partner',
      tier: 'RP+',
      addedDate: '2025-07-22',
      referralCode: 'MILLERLAND',
      referralLink: 'boasafra.com/ref/MILLERLAND',
      regionalManager: 'Sarah Chen',
      openDeals: 10,
      wonDeals: 16,
      lostDeals: 6,
      wonValue: 720000,
      lastDealDate: '2026-04-20',
      performanceSegment: 'High Performer',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-003',
      referralPartnerName: 'AgPath Consulting',
      isConciergeRp: true,
      city: 'Kansas City',
      state: 'MO',
      latitude: 39.0997,
      longitude: -94.5786,
      dealCount: 28,
      totalDealValue: 1620000,
      acres: 3920,
      activeStatus: 'Active',
      company: 'AgPath Consulting Inc.',
      businessType: 'Strategic Partner',
      tier: 'RP+',
      addedDate: '2025-05-03',
      referralCode: 'AGPATH',
      referralLink: 'boasafra.com/ref/AGPATH',
      regionalManager: 'Mike Johnson',
      openDeals: 9,
      wonDeals: 15,
      lostDeals: 4,
      wonValue: 680000,
      lastDealDate: '2026-04-14',
      performanceSegment: 'High Performer',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-004',
      referralPartnerName: 'Greenline Partners',
      isConciergeRp: true,
      city: 'Sioux Falls',
      state: 'SD',
      latitude: 43.546,
      longitude: -96.7313,
      dealCount: 24,
      totalDealValue: 1450000,
      acres: 3480,
      activeStatus: 'Active',
      company: 'Greenline Partners',
      businessType: 'Regional Affiliate',
      tier: 'RP+',
      addedDate: '2025-09-01',
      referralCode: 'GREENLINE',
      referralLink: 'boasafra.com/ref/GREENLINE',
      regionalManager: 'Sarah Chen',
      openDeals: 8,
      wonDeals: 12,
      lostDeals: 4,
      wonValue: 615000,
      lastDealDate: '2026-04-10',
      performanceSegment: 'High Performer',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-005',
      referralPartnerName: 'Midwest Farm Strategies',
      isConciergeRp: false,
      city: 'Fargo',
      state: 'ND',
      latitude: 46.8772,
      longitude: -96.7898,
      dealCount: 22,
      totalDealValue: 1320000,
      acres: 3120,
      activeStatus: 'Active',
      company: 'Midwest Farm Strategies',
      businessType: 'Corporation',
      tier: 'RP',
      addedDate: '2025-06-18',
      referralCode: 'MIDWESTFARM',
      referralLink: 'boasafra.com/ref/MIDWESTFARM',
      regionalManager: 'Sarah Chen',
      openDeals: 9,
      wonDeals: 10,
      lostDeals: 3,
      wonValue: 580000,
      lastDealDate: '2026-04-09',
      performanceSegment: 'High Performer',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-006',
      referralPartnerName: 'HarvestPoint Advisors',
      isConciergeRp: false,
      city: 'Minneapolis',
      state: 'MN',
      latitude: 44.9778,
      longitude: -93.265,
      dealCount: 19,
      totalDealValue: 1180000,
      acres: 2850,
      activeStatus: 'Active',
      company: 'HarvestPoint Advisors',
      businessType: 'Individual / Small Business',
      tier: 'RP',
      addedDate: '2025-10-12',
      referralCode: 'HARVESTPOINT',
      referralLink: 'boasafra.com/ref/HARVESTPOINT',
      regionalManager: 'Lisa Park',
      openDeals: 8,
      wonDeals: 8,
      lostDeals: 3,
      wonValue: 510000,
      lastDealDate: '2026-03-29',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-007',
      referralPartnerName: 'Stone Creek Ag',
      isConciergeRp: false,
      city: 'Springfield',
      state: 'IL',
      latitude: 39.7817,
      longitude: -89.6501,
      dealCount: 18,
      totalDealValue: 980000,
      acres: 2420,
      activeStatus: 'Active',
      company: 'Stone Creek Ag',
      businessType: 'General Referral Source',
      tier: 'RP',
      addedDate: '2025-04-19',
      referralCode: 'STONECREEK',
      referralLink: 'boasafra.com/ref/STONECREEK',
      regionalManager: 'Mike Johnson',
      openDeals: 7,
      wonDeals: 7,
      lostDeals: 4,
      wonValue: 430000,
      lastDealDate: '2026-04-03',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-008',
      referralPartnerName: 'Northstar Rural Partners',
      isConciergeRp: false,
      city: 'Indianapolis',
      state: 'IN',
      latitude: 39.7684,
      longitude: -86.1581,
      dealCount: 16,
      totalDealValue: 850000,
      acres: 2180,
      activeStatus: 'Active',
      company: 'Northstar Rural Partners',
      businessType: 'Regional Affiliate',
      tier: 'RP',
      addedDate: '2025-03-24',
      referralCode: 'NORTHSTAR',
      referralLink: 'boasafra.com/ref/NORTHSTAR',
      regionalManager: 'Mike Johnson',
      openDeals: 7,
      wonDeals: 6,
      lostDeals: 3,
      wonValue: 390000,
      lastDealDate: '2026-03-22',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-009',
      referralPartnerName: 'FieldBridge Consulting',
      isConciergeRp: false,
      city: 'Columbus',
      state: 'OH',
      latitude: 39.9612,
      longitude: -82.9988,
      dealCount: 15,
      totalDealValue: 740000,
      acres: 1950,
      activeStatus: 'Active',
      company: 'FieldBridge Consulting',
      businessType: 'Corporation',
      tier: 'RP',
      addedDate: '2025-08-30',
      referralCode: 'FIELDBRIDGE',
      referralLink: 'boasafra.com/ref/FIELDBRIDGE',
      regionalManager: 'Lisa Park',
      openDeals: 6,
      wonDeals: 6,
      lostDeals: 3,
      wonValue: 325000,
      lastDealDate: '2026-03-20',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-010',
      referralPartnerName: 'CountyLine Ag Services',
      isConciergeRp: false,
      city: 'Lincoln',
      state: 'NE',
      latitude: 40.8136,
      longitude: -96.7026,
      dealCount: 14,
      totalDealValue: 680000,
      acres: 1820,
      activeStatus: 'Active',
      company: 'CountyLine Ag Services',
      businessType: 'General Referral Source',
      tier: 'RP',
      addedDate: '2025-11-02',
      referralCode: 'COUNTYLINE',
      referralLink: 'boasafra.com/ref/COUNTYLINE',
      regionalManager: 'Sarah Chen',
      openDeals: 6,
      wonDeals: 5,
      lostDeals: 3,
      wonValue: 300000,
      lastDealDate: '2026-04-01',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-011',
      referralPartnerName: 'Great Plains Referral',
      isConciergeRp: false,
      city: 'Wichita',
      state: 'KS',
      latitude: 37.6872,
      longitude: -97.3301,
      dealCount: 11,
      totalDealValue: 520000,
      acres: 1420,
      activeStatus: 'Active',
      company: 'Great Plains Referral',
      businessType: 'Individual / Small Business',
      tier: 'RP',
      addedDate: '2025-12-08',
      referralCode: 'GREATPLAINS',
      referralLink: 'boasafra.com/ref/GREATPLAINS',
      regionalManager: 'Lisa Park',
      openDeals: 5,
      wonDeals: 4,
      lostDeals: 2,
      wonValue: 205000,
      lastDealDate: '2026-03-18',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-012',
      referralPartnerName: 'Heartland Ag Partners',
      isConciergeRp: false,
      city: 'Madison',
      state: 'WI',
      latitude: 43.0731,
      longitude: -89.4012,
      dealCount: 9,
      totalDealValue: 380000,
      acres: 1180,
      activeStatus: 'Active',
      company: 'Heartland Ag Partners',
      businessType: 'Regional Affiliate',
      tier: 'RP',
      addedDate: '2025-09-17',
      referralCode: 'HEARTLAND',
      referralLink: 'boasafra.com/ref/HEARTLAND',
      regionalManager: 'Mike Johnson',
      openDeals: 4,
      wonDeals: 3,
      lostDeals: 2,
      wonValue: 165000,
      lastDealDate: '2026-02-27',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-013',
      referralPartnerName: 'High Mesa Agronomy',
      isConciergeRp: true,
      city: 'Fort Collins',
      state: 'CO',
      latitude: 40.5853,
      longitude: -105.0844,
      dealCount: 7,
      totalDealValue: 515000,
      acres: 1060,
      activeStatus: 'Active',
      company: 'High Mesa Agronomy',
      businessType: 'Strategic Partner',
      tier: 'RP+',
      addedDate: '2026-01-09',
      referralCode: 'HIGHMESA',
      referralLink: 'boasafra.com/ref/HIGHMESA',
      regionalManager: 'Lisa Park',
      openDeals: 3,
      wonDeals: 3,
      lostDeals: 1,
      wonValue: 260000,
      lastDealDate: '2026-04-08',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-014',
      referralPartnerName: 'Brazos Soil Partners',
      isConciergeRp: true,
      city: 'Waco',
      state: 'TX',
      latitude: 31.5493,
      longitude: -97.1467,
      dealCount: 6,
      totalDealValue: 470000,
      acres: 980,
      activeStatus: 'Active',
      company: 'Brazos Soil Partners',
      businessType: 'Strategic Partner',
      tier: 'RP+',
      addedDate: '2026-01-18',
      referralCode: 'BRAZOS',
      referralLink: 'boasafra.com/ref/BRAZOS',
      regionalManager: 'Sarah Chen',
      openDeals: 3,
      wonDeals: 2,
      lostDeals: 1,
      wonValue: 215000,
      lastDealDate: '2026-04-11',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-015',
      referralPartnerName: 'Valley Orchard Advisors',
      isConciergeRp: false,
      city: 'Fresno',
      state: 'CA',
      latitude: 36.7378,
      longitude: -119.7871,
      dealCount: 5,
      totalDealValue: 405000,
      acres: 760,
      activeStatus: 'Active',
      company: 'Valley Orchard Advisors',
      businessType: 'Corporation',
      tier: 'RP',
      addedDate: '2026-02-06',
      referralCode: 'VALLEYORCHARD',
      referralLink: 'boasafra.com/ref/VALLEYORCHARD',
      regionalManager: 'Lisa Park',
      openDeals: 2,
      wonDeals: 2,
      lostDeals: 1,
      wonValue: 190000,
      lastDealDate: '2026-03-30',
      performanceSegment: 'Healthy',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-016',
      referralPartnerName: 'Legacy Land Advisors',
      isConciergeRp: false,
      city: 'St. Louis',
      state: 'MO',
      latitude: 38.627,
      longitude: -90.1994,
      dealCount: 5,
      totalDealValue: 215000,
      acres: 980,
      activeStatus: 'Inactive',
      company: 'Legacy Land Services',
      businessType: 'General Referral Source',
      tier: 'RP',
      addedDate: '2025-06-15',
      referralCode: 'LEGACY2025',
      referralLink: 'boasafra.com/ref/LEGACY2025',
      regionalManager: 'Mike Johnson',
      openDeals: 0,
      wonDeals: 3,
      lostDeals: 2,
      wonValue: 125000,
      lastDealDate: '2025-12-02',
      performanceSegment: 'Inactive',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-017',
      referralPartnerName: 'Countryside Partners',
      isConciergeRp: false,
      city: 'Peoria',
      state: 'IL',
      latitude: 40.6936,
      longitude: -89.589,
      dealCount: 8,
      totalDealValue: 330000,
      acres: 1120,
      activeStatus: 'Inactive',
      company: 'Countryside Partners',
      businessType: 'General Referral Source',
      tier: 'RP',
      addedDate: '2025-07-04',
      referralCode: 'COUNTRYSIDE',
      referralLink: 'boasafra.com/ref/COUNTRYSIDE',
      regionalManager: 'Mike Johnson',
      openDeals: 0,
      wonDeals: 5,
      lostDeals: 3,
      wonValue: 220000,
      lastDealDate: '2025-12-16',
      performanceSegment: 'Inactive',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-018',
      referralPartnerName: 'AgriSource Network',
      isConciergeRp: false,
      city: 'Topeka',
      state: 'KS',
      latitude: 39.0473,
      longitude: -95.6752,
      dealCount: 2,
      totalDealValue: 18000,
      acres: 190,
      activeStatus: 'Active',
      company: 'AgriSource Network',
      businessType: 'Individual / Small Business',
      tier: 'RP',
      addedDate: '2026-02-18',
      referralCode: 'AGRISOURCE',
      referralLink: 'boasafra.com/ref/AGRISOURCE',
      regionalManager: 'Lisa Park',
      openDeals: 1,
      wonDeals: 1,
      lostDeals: 0,
      wonValue: 18000,
      lastDealDate: '2026-02-21',
      performanceSegment: 'Low Revenue',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-019',
      referralPartnerName: 'Riverbend Services',
      isConciergeRp: false,
      city: 'Davenport',
      state: 'IA',
      latitude: 41.5236,
      longitude: -90.5776,
      dealCount: 1,
      totalDealValue: 28000,
      acres: 210,
      activeStatus: 'Pending',
      company: 'Riverbend Services',
      businessType: 'General Referral Source',
      tier: 'RP',
      addedDate: '2026-03-03',
      referralCode: 'RIVERBEND',
      referralLink: 'boasafra.com/ref/RIVERBEND',
      regionalManager: 'Lisa Park',
      openDeals: 1,
      wonDeals: 0,
      lostDeals: 0,
      wonValue: 0,
      lastDealDate: '2026-03-04',
      performanceSegment: 'Low Activity',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-020',
      referralPartnerName: 'Crossroads Referral',
      isConciergeRp: false,
      city: 'Columbia',
      state: 'MO',
      latitude: 38.9517,
      longitude: -92.3341,
      dealCount: 1,
      totalDealValue: 22000,
      acres: 170,
      activeStatus: 'Pending',
      company: 'Crossroads Referral',
      businessType: 'General Referral Source',
      tier: 'RP',
      addedDate: '2026-03-11',
      referralCode: 'CROSSROADS',
      referralLink: 'boasafra.com/ref/CROSSROADS',
      regionalManager: 'Mike Johnson',
      openDeals: 1,
      wonDeals: 0,
      lostDeals: 0,
      wonValue: 0,
      lastDealDate: '2026-03-12',
      performanceSegment: 'Low Activity',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-021',
      referralPartnerName: 'Farmland Connect LLC',
      isConciergeRp: false,
      city: 'Cedar Rapids',
      state: 'IA',
      latitude: 41.9779,
      longitude: -91.6656,
      dealCount: 0,
      totalDealValue: 0,
      acres: 0,
      activeStatus: 'Pending',
      company: 'Farmland Connect',
      businessType: 'Individual / Small Business',
      tier: 'RP',
      addedDate: '2026-02-10',
      referralCode: null,
      referralLink: null,
      regionalManager: 'Lisa Park',
      openDeals: 0,
      wonDeals: 0,
      lostDeals: 0,
      wonValue: 0,
      lastDealDate: null,
      performanceSegment: 'Zero Deals',
      dataQualityFlag: 'Missing Referral Code',
    },
    {
      referralPartnerId: 'RP-022',
      referralPartnerName: 'Peach State Partners',
      isConciergeRp: true,
      city: 'Atlanta',
      state: 'GA',
      latitude: 33.749,
      longitude: -84.388,
      dealCount: 24,
      totalDealValue: 1380000,
      acres: 3240,
      activeStatus: 'Active',
      company: 'Peach State Partners LLC',
      businessType: 'Strategic Partner',
      tier: 'RP+',
      addedDate: '2025-09-05',
      referralCode: 'PEACHSTATE',
      referralLink: 'boasafra.com/ref/PEACHSTATE',
      regionalManager: 'Clayton Mason',
      openDeals: 11,
      wonDeals: 13,
      lostDeals: 0,
      wonValue: 715000,
      lastDealDate: '2026-04-12',
      performanceSegment: 'High Performer',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-023',
      referralPartnerName: 'Smoky Mountain Ag Advisors',
      isConciergeRp: false,
      city: 'Nashville',
      state: 'TN',
      latitude: 36.1627,
      longitude: -86.7816,
      dealCount: 17,
      totalDealValue: 890000,
      acres: 2150,
      activeStatus: 'Active',
      company: 'Smoky Mountain Ag Advisors',
      businessType: 'Individual / Small Business',
      tier: 'RP',
      addedDate: '2025-10-18',
      referralCode: 'SMOKYMTN',
      referralLink: 'boasafra.com/ref/SMOKYMTN',
      regionalManager: 'Clayton Mason',
      openDeals: 8,
      wonDeals: 9,
      lostDeals: 0,
      wonValue: 452000,
      lastDealDate: '2026-03-28',
      performanceSegment: 'Solid Performer',
      dataQualityFlag: null,
    },
    {
      referralPartnerId: 'RP-024',
      referralPartnerName: 'Carolina Farmland Group',
      isConciergeRp: false,
      city: 'Charlotte',
      state: 'NC',
      latitude: 35.2271,
      longitude: -80.8431,
      dealCount: 12,
      totalDealValue: 560000,
      acres: 1480,
      activeStatus: 'Active',
      company: 'Carolina Farmland Group LLC',
      businessType: 'General Referral Source',
      tier: 'RP',
      addedDate: '2025-11-30',
      referralCode: 'CAROLINAFG',
      referralLink: 'boasafra.com/ref/CAROLINAFG',
      regionalManager: 'Clayton Mason',
      openDeals: 5,
      wonDeals: 7,
      lostDeals: 0,
      wonValue: 305000,
      lastDealDate: '2026-04-02',
      performanceSegment: 'Solid Performer',
      dataQualityFlag: null,
    },
  ]
    .map((partner) => withCalculatedAverage(partner as ReferralPartnerInput))
    .map((partner) => ({
      ...partner,
      regionalManager: rpmRegionByState[partner.state]?.rpm ?? partner.regionalManager,
    }))
    .map((partner) => {
      const associates = associateRpmsByRpm[partner.regionalManager];
      if (!associates) return partner;
      const index = associateAssignmentCounters[partner.regionalManager] ?? 0;
      associateAssignmentCounters[partner.regionalManager] = index + 1;
      return { ...partner, associateRpm: associates[index % 2] };
    });

  const referralPartners = filterReferralPartners(allReferralPartners, filters);

  const totalReferredDeals = sumBy(referralPartners, (partner) => partner.dealCount);
  const openDeals = sumBy(referralPartners, (partner) => partner.openDeals);
  const wonDeals = sumBy(referralPartners, (partner) => partner.wonDeals);
  const lostDeals = sumBy(referralPartners, (partner) => partner.lostDeals);
  const totalReferredDealValue = sumBy(referralPartners, (partner) => partner.totalDealValue);
  const wonDealValue = sumBy(referralPartners, (partner) => partner.wonValue);
  const totalAcres = sumBy(referralPartners, (partner) => partner.acres);
  const activePartners = referralPartners.filter((partner) => partner.activeStatus === 'Active').length;
  const pendingRPs = referralPartners.filter((partner) => partner.activeStatus === 'Pending').length;
  const inactiveRPs = referralPartners.filter((partner) => partner.activeStatus === 'Inactive').length;
  const rpPlusPartners = referralPartners.filter((partner) => partner.tier === 'RP+').length;
  const conciergeRps = referralPartners.filter((partner) => partner.isConciergeRp).length;
  const standardRps = referralPartners.length - conciergeRps;
  const averageDealValue = calculateAverageDealValue(totalReferredDealValue, totalReferredDeals);
  const conversionRate = totalReferredDeals > 0 ? (wonDeals / totalReferredDeals) * 100 : 0;
  const partnersWithZeroDeals = referralPartners.filter((partner) => partner.dealCount === 0).length;
  const lowRevenueThreshold = 50000;
  const inactiveDaysThreshold = 90;
  const lowRevenuePartners = referralPartners.filter((partner) => partner.totalDealValue > 0 && partner.totalDealValue < lowRevenueThreshold).length;
  const partnersWithMissingCodes = referralPartners.filter((partner) => !partner.referralCode).length;

  // Non-RP deals: organic / direct deals with no referral partner involved, so there is no
  // referral code, tier, or incentive payout to attribute. Modeled as a share of the RP book
  // of business so the two business sources can be compared on the same charts.
  const nonRpTotalDeals = Math.round(totalReferredDeals * 0.35);
  const nonRpWonDeals = Math.round(nonRpTotalDeals * (conversionRate / 100));
  const nonRpWonDealValue = Math.round(nonRpWonDeals * calculateAverageDealValue(wonDealValue, wonDeals) * 0.85);
  const nonRpTotalAcres = Math.round(totalAcres * 0.32);
  const nonRpPaidAcres = Math.round(nonRpTotalAcres * (nonRpWonDeals / Math.max(nonRpTotalDeals, 1)));
  const rpPaidAcres = Math.round(totalAcres * (wonDeals / Math.max(totalReferredDeals, 1)));

  const combinedWonDealValue = wonDealValue + nonRpWonDealValue;
  const combinedWonDeals = wonDeals + nonRpWonDeals;
  const combinedTotalAcres = totalAcres + nonRpTotalAcres;
  const combinedPaidDeals = combinedWonDeals;
  const combinedAvgDealSize = calculateAverageDealValue(combinedWonDealValue, combinedWonDeals);
  const nonRpTotalDealValue = Math.round(nonRpTotalDeals * calculateAverageDealValue(totalReferredDealValue, totalReferredDeals) * 0.85);

  const marketPotentialByState = sortDesc(
    getMarketPotentialByState(referralPartners),
    (row) => row.marketPotential,
  );
  const nationalMarketPotential = sumBy(marketPotentialByState, (row) => row.marketPotential);
  const tamAverageDealValue = referralPartners.length > 0 ? nationalMarketPotential / referralPartners.length : 0;

  const partnerTable = referralPartners.map((partner) => ({
    ...partner,
    id: partner.referralPartnerId,
    name: partner.referralPartnerName,
    lat: partner.latitude,
    lng: partner.longitude,
    dealValue: partner.totalDealValue,
    totalValue: partner.totalDealValue,
    totalAcres: partner.acres,
    conversionRate: partner.dealCount > 0 ? Math.round((partner.wonDeals / partner.dealCount) * 100) : 0,
  }));

  const rpAgreementRows = partnerTable.map((partner) => {
    const agreementType = getRpAgreementType(partner.businessType);
    const incentivePayout = Math.round(partner.wonValue * incentivePayoutRateByAgreementType[agreementType]);
    return { ...partner, agreementType, incentivePayout };
  });

  const topPartnersByDeals = take(sortDesc(partnerTable, (partner) => partner.dealCount), 10);
  const topPartnersByValue = take(sortDesc(partnerTable, (partner) => partner.totalDealValue), 10);
  const topPartnersByWonValue = take(sortDesc(partnerTable, (partner) => partner.wonValue), 5);
  const topPartnerByWonValue = topPartnersByWonValue[0];
  const highestConversionPartner = sortDesc(
    partnerTable.filter((partner) => partner.dealCount > 0),
    (partner) => partner.conversionRate,
  )[0];
  const partnersNeedingAttention = partnerTable
    .filter((partner) => ['Zero Deals', 'Low Revenue', 'Low Activity', 'Inactive'].includes(partner.performanceSegment))
    .map((partner) => ({
      ...partner,
      issueType:
        partner.dealCount === 0
          ? 'Zero Deals'
          : partner.activeStatus === 'Inactive'
            ? 'Inactive'
            : partner.totalDealValue < lowRevenueThreshold
              ? 'Low Revenue'
              : 'Low Activity',
      daysSinceLastDeal: partner.activeStatus === 'Inactive' ? (partner.referralPartnerId === 'RP-016' ? 142 : 128) : null,
    }));

  const avgDealValueByType = Object.values(
    referralPartners.reduce<Record<string, { type: string; totalDealValue: number; dealCount: number }>>((groups, partner) => {
      groups[partner.businessType] = groups[partner.businessType] ?? {
        type: partner.businessType,
        totalDealValue: 0,
        dealCount: 0,
      };
      groups[partner.businessType].totalDealValue += partner.totalDealValue;
      groups[partner.businessType].dealCount += partner.dealCount;
      return groups;
    }, {}),
  ).map((row) => ({
    type: row.type,
    avgValue: calculateAverageDealValue(row.totalDealValue, row.dealCount),
  }));

  const stageNames = [
    'Contact Information',
    'Invitation Sent',
    'RFS Submitted',
    'Agreement Sent',
    'Soil Data Collection',
    'Analyst Team',
    'Report Complete | Not Paid',
  ];
  const stageWeights = [0.19, 0.12, 0.15, 0.1, 0.1, 0.09, 0.25];
  const stageCounts = distributeByWeight(totalReferredDeals, stageWeights);
  const stageValues = distributeByWeight(totalReferredDealValue, stageWeights);
  const stageAcres = distributeByWeight(totalAcres, stageWeights);
  const pipelineFunnel = stageNames.map((stage, index) => ({
    stage,
    count: stageCounts[index],
    value: stageValues[index],
    acres: stageAcres[index],
  }));
  const openPipelineValue = sumBy(pipelineFunnel.slice(0, -1), (stage) => stage.value);
  const lostDealValue = sumBy(referralPartners, (partner) => partner.totalDealValue - partner.wonValue) * (lostDeals / Math.max(totalReferredDeals - wonDeals, 1));

  const monthlyWeights = [0.14, 0.16, 0.18, 0.2, 0.17, 0.15];
  const monthlyValues = distributeByWeight(totalReferredDealValue, monthlyWeights);
  const monthlyDeals = distributeByWeight(totalReferredDeals, monthlyWeights);
  const nonRpMonthlyValues = distributeByWeight(nonRpTotalDealValue, monthlyWeights);
  const dealValueByMonth = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, index) => ({
    month,
    value: monthlyValues[index] + nonRpMonthlyValues[index],
    rpValue: monthlyValues[index],
    nonRpValue: nonRpMonthlyValues[index],
  }));
  const dealsAddedOverTime = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, index) => ({
    month,
    deals: monthlyDeals[index],
  }));

  const quarterlyPaidAccounts = [
    { quarter: 'Q1 2025', ratio: 0.15 },
    { quarter: 'Q2 2025', ratio: 0.18 },
    { quarter: 'Q3 2025', ratio: 0.21 },
    { quarter: 'Q4 2025', ratio: 0.2 },
    { quarter: 'Q1 2026', ratio: 0.26 },
  ];
  const paidDealTotal = wonDeals;
  const paidDealCounts = distributeByWeight(paidDealTotal, quarterlyPaidAccounts.map((row) => row.ratio));
  const paidAcres = distributeByWeight(totalAcres, quarterlyPaidAccounts.map((row) => row.ratio));
  const paidValues = distributeByWeight(wonDealValue, quarterlyPaidAccounts.map((row) => row.ratio));
  const nonRpPaidDealCounts = distributeByWeight(nonRpWonDeals, quarterlyPaidAccounts.map((row) => row.ratio));
  const dealsEnteredPaidAccountsByQuarter = quarterlyPaidAccounts.map((row, index) => ({
    quarter: row.quarter,
    deals: paidDealCounts[index] + nonRpPaidDealCounts[index],
    rpDeals: paidDealCounts[index],
    nonRpDeals: nonRpPaidDealCounts[index],
    acres: paidAcres[index],
    value: paidValues[index],
  }));

  const dealsEnteredPaidAccountsThisQuarter = dealsEnteredPaidAccountsByQuarter.at(-1)?.deals ?? 0;
  const rpPlusWonValue = sumBy(referralPartners.filter((partner) => partner.tier === 'RP+'), (partner) => partner.wonValue);
  const rpPlusContributionPct = wonDealValue > 0 ? (rpPlusWonValue / wonDealValue) * 100 : 0;
  const downstreamRPsRecruited = rpPlusPartners * 2;
  const downstreamDeals = Math.round(totalReferredDeals * 0.34);
  const downstreamWonDeals = Math.round(wonDeals * 0.32);
  const downstreamWonValue = Math.round(wonDealValue * (rpPlusContributionPct / 100) * 0.58);
  const incompleteRPPlusMappings = Math.max(rpPlusPartners - conciergeRps, 0);
  const manualReferralCodeOverrides = partnersWithMissingCodes;

  // Real-data connection note: Pipedrive's C-RP custom field should map directly
  // into `isConciergeRp` when the prototype is connected to live partner records.
  // The map legend, RP filters, and concierge counts intentionally read only from
  // this field so those views will reconcile after the Pipedrive sync is wired up.
  const executiveData = {
    kpis: {
      activePartners: activePartners.toLocaleString(),
      pendingRPs: pendingRPs.toLocaleString(),
      rpPlusPartners: rpPlusPartners.toLocaleString(),
      totalDeals: totalReferredDeals.toLocaleString(),
      openDeals: openDeals.toLocaleString(),
      wonDeals: wonDeals.toLocaleString(),
      lostDeals: lostDeals.toLocaleString(),
      totalDealValue: currencyShort(totalReferredDealValue),
      wonDealValue: currencyShort(combinedWonDealValue),
      totalAcres: wholeNumber(combinedTotalAcres),
      conversionRate: percent(conversionRate),
      dealsEnteredPaidAccounts: dealsEnteredPaidAccountsThisQuarter.toLocaleString(),
      avgDealValue: currencyShort(averageDealValue),
      paidDeals: combinedPaidDeals.toLocaleString(),
      avgDealSize: currencyShort(combinedAvgDealSize),
    },
    dataIntegrityChecks: [
      {
        check: 'Total Deals = Open + Won + Lost',
        status: totalReferredDeals === openDeals + wonDeals + lostDeals ? 'Passed' : 'Needs Review',
        detail: `${totalReferredDeals.toLocaleString()} = ${openDeals.toLocaleString()} + ${wonDeals.toLocaleString()} + ${lostDeals.toLocaleString()}`,
      },
      {
        check: 'Conversion Rate = Won / Total',
        status: 'Passed',
        detail: `${percent(conversionRate)} = ${wonDeals.toLocaleString()} / ${totalReferredDeals.toLocaleString()}`,
      },
      {
        check: 'Referral Code Mapping Completeness',
        status: partnersWithMissingCodes > 0 ? 'Needs Review' : 'Passed',
        detail: `${partnersWithMissingCodes.toLocaleString()} partners missing codes`,
      },
      {
        check: 'RP+ Mapping Completeness',
        status: incompleteRPPlusMappings > 0 ? 'Needs Review' : 'Passed',
        detail: `${incompleteRPPlusMappings.toLocaleString()} incomplete mappings`,
      },
      {
        check: 'Manual Referral Code Overrides',
        status: manualReferralCodeOverrides > 0 ? 'Issue' : 'Passed',
        detail: `${manualReferralCodeOverrides.toLocaleString()} records`,
      },
    ],
    executiveInsights: {
      bestPerformingRP: { name: topPartnerByWonValue?.referralPartnerName ?? 'No partners', wonValue: topPartnerByWonValue?.wonValue ?? 0 },
      highestConversionRP: { name: highestConversionPartner?.referralPartnerName ?? 'No partners', conversionRate: highestConversionPartner?.conversionRate ?? 0 },
      rpPlusContribution: percent(rpPlusContributionPct),
    },
    dealValueByMonth,
    dealsByStage: pipelineFunnel.map(({ stage, count }) => ({ stage, count })),
    newRPsOverTime: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, index) => ({
      month,
      newRPs: distributeByWeight(referralPartners.length, monthlyWeights)[index],
    })),
    topPartnersByValue: topPartnersByWonValue.map((partner) => ({
      name: partner.referralPartnerName,
      wonValue: partner.wonValue,
    })),
    dealsEnteredPaidAccountsByQuarter,
    revenueByBusinessSource: [
      { source: 'RP', value: wonDealValue },
      { source: 'Non-RP', value: nonRpWonDealValue },
    ],
    partnerLocations: partnerTable,
  };

  const partnerData = {
    kpis: {
      topRPWonValue: currencyShort(topPartnerByWonValue?.wonValue ?? 0),
      avgConversionRate: percent(conversionRate),
      partnersWithZeroDeals: partnersWithZeroDeals.toLocaleString(),
      lowRevenuePartners: lowRevenuePartners.toLocaleString(),
      lowRevenueSubtitle: `< $${(lowRevenueThreshold / 1000).toLocaleString()}K total`,
      inactiveRPs: inactiveRPs.toLocaleString(),
      inactiveSubtitle: `> ${inactiveDaysThreshold} days`,
      newRPsThisQuarter: referralPartners.filter((partner) => partner.addedDate >= '2026-01-01').length.toLocaleString(),
      newRPsThisQuarterSubtitle: 'Q1 2026',
    },
    topPartnersByDeals: topPartnersByDeals.map((partner) => ({
      name: partner.referralPartnerName,
      dealCount: partner.dealCount,
    })),
    topPartnersByValue: topPartnersByValue.map((partner) => ({
      name: partner.referralPartnerName,
      totalValue: partner.totalDealValue,
    })),
    conversionByPartner: take(
      sortDesc(
        partnerTable.filter((partner) => partner.dealCount > 0),
        (partner) => partner.conversionRate,
      ),
      8,
    ).map((partner) => ({
      name: partner.referralPartnerName,
      conversionRate: partner.conversionRate,
      businessType: partner.businessType,
    })),
    lowestDealCountPartners: take([...partnerTable].sort((a, b) => a.dealCount - b.dealCount), 6).map((partner) => ({
      name: partner.referralPartnerName,
      dealCount: partner.dealCount,
      totalValue: partner.totalDealValue,
    })),
    lowestRevenuePartners: take([...partnerTable].sort((a, b) => a.totalDealValue - b.totalDealValue), 6).map((partner) => ({
      name: partner.referralPartnerName,
      totalValue: partner.totalDealValue,
      dealCount: partner.dealCount,
    })),
    partnersNeedingAttention,
    avgDealValueByType,
    partnerTable,
  };

  const pipelineData = {
    kpis: {
      totalReferredDeals: totalReferredDeals.toLocaleString(),
      openPipelineValue: currencyShort(openPipelineValue),
      wonDealValue: currencyShort(wonDealValue),
      lostDealValue: currencyShort(lostDealValue),
      totalAcres: wholeNumber(totalAcres),
      avgDealValue: currencyShort(averageDealValue),
      avgAcresPerDeal: wholeNumber(calculateAverageDealValue(totalAcres, totalReferredDeals)),
      dealsEnteredPaidAccounts: dealsEnteredPaidAccountsThisQuarter.toLocaleString(),
    },
    pipelineFunnel,
    dealsAddedOverTime,
    pipelineByBusinessType: Object.values(
      referralPartners.reduce<Record<string, { type: string; count: number; value: number }>>((groups, partner) => {
        groups[partner.businessType] = groups[partner.businessType] ?? { type: partner.businessType, count: 0, value: 0 };
        groups[partner.businessType].count += partner.dealCount;
        groups[partner.businessType].value += partner.totalDealValue;
        return groups;
      }, {}),
    ),
    stageAging: stageNames.map((stage, index) => ({ stage, avgDays: [12, 18, 28, 22, 35, 42, 48][index] })),
    dealsEnteredPaidAccountsByQuarter,
  };

  const rpAgreementTypeOrder = ['Corporation', 'Individual/Small Business', 'Discount', 'Referral Source'];
  const paidDealRatio = wonDeals > 0 ? dealsEnteredPaidAccountsThisQuarter / wonDeals : 0;
  const totalIncentivePayout = sumBy(rpAgreementRows, (partner) => partner.incentivePayout);

  const rpAgreementGroups = rpAgreementTypeOrder.map((agreementType) => {
    const rows = rpAgreementRows.filter((partner) => partner.agreementType === agreementType);
    const dealValue = sumBy(rows, (partner) => partner.totalDealValue);
    const incentivePayout = sumBy(rows, (partner) => partner.incentivePayout);
    const wonDealsForType = sumBy(rows, (partner) => partner.wonDeals);
    return {
      agreementType,
      dealValue,
      incentivePayout,
      netValue: dealValue - incentivePayout,
      paidDeals: Math.round(wonDealsForType * paidDealRatio),
    };
  });

  const rpOverviewData = {
    kpis: {
      wonDealValue: currencyShort(wonDealValue),
      wonDeals: wonDeals.toLocaleString(),
      totalAcres: wholeNumber(totalAcres),
      avgDealSize: currencyShort(calculateAverageDealValue(wonDealValue, wonDeals)),
    },
    dealValueByAgreementType: rpAgreementGroups.map(({ agreementType, dealValue }) => ({
      type: agreementType,
      value: dealValue,
    })),
    valueAndPayoutByAgreementType: rpAgreementGroups,
    paidDealsByAgreementType: rpAgreementGroups.map(({ agreementType, paidDeals }) => ({
      type: agreementType,
      paidDeals,
    })),
  };

  const nonRpOverviewData = {
    kpis: {
      wonDealValue: currencyShort(nonRpWonDealValue),
      wonDeals: nonRpWonDeals.toLocaleString(),
      totalAcres: wholeNumber(nonRpTotalAcres),
      avgDealSize: currencyShort(calculateAverageDealValue(nonRpWonDealValue, nonRpWonDeals)),
    },
    totalDealsBySource: [
      { source: 'RP', deals: totalReferredDeals },
      { source: 'Non-RP', deals: nonRpTotalDeals },
    ],
    paidAcresBySource: [
      { source: 'RP', acres: rpPaidAcres },
      { source: 'Non-RP', acres: nonRpPaidAcres },
    ],
    revenueBySource: [
      { source: 'RP', dealValue: wonDealValue, netValue: wonDealValue - totalIncentivePayout },
      { source: 'Non-RP', dealValue: nonRpWonDealValue, netValue: nonRpWonDealValue },
    ],
  };

  const rpPlusRows = referralPartners.filter((partner) => partner.tier === 'RP+');
  const rpPlusData = {
    kpis: {
      activeRPPlus: rpPlusPartners.toLocaleString(),
      downstreamRPsRecruited: downstreamRPsRecruited.toLocaleString(),
      downstreamDeals: downstreamDeals.toLocaleString(),
      downstreamWonDeals: downstreamWonDeals.toLocaleString(),
      downstreamWonValue: currencyShort(downstreamWonValue),
      rpPlusContributionPct: percent(rpPlusContributionPct),
      incompleteMapping: incompleteRPPlusMappings.toLocaleString(),
    },
    downstreamValueByRPPlus: rpPlusRows.map((partner) => ({
      name: partner.referralPartnerName,
      downstreamValue: Math.round(partner.wonValue * 0.45),
      downstreamDeals: Math.max(Math.round(partner.wonDeals * 0.45), 1),
      downstreamAcres: Math.round(partner.acres * 0.22),
    })),
    newDownstreamRPs: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, index) => ({
      month,
      count: distributeByWeight(downstreamRPsRecruited, monthlyWeights)[index],
    })),
    conversionComparison: [
      { category: 'RP+ Network', conversionRate: Math.min(100, Math.max(0, Math.round(conversionRate + 6))) },
      { category: 'Standard RP', conversionRate: Math.min(100, Math.max(0, Math.round(conversionRate - 2))) },
    ],
    downstreamAcresByRPPlus: rpPlusRows.map((partner) => ({
      name: partner.referralPartnerName,
      acres: Math.round(partner.acres * 0.22),
    })),
  };

  const marketPotentialData = {
    statePlanning: getAgriculturalMarketStates(referralPartners),
  };

  const rpmGroups = Object.values(
    referralPartners.reduce<Record<string, { name: string; acres: number; dealValue: number; deals: number }>>((groups, partner) => {
      groups[partner.regionalManager] = groups[partner.regionalManager] ?? { name: partner.regionalManager, acres: 0, dealValue: 0, deals: 0 };
      groups[partner.regionalManager].acres += partner.acres;
      groups[partner.regionalManager].dealValue += partner.totalDealValue;
      groups[partner.regionalManager].deals += partner.dealCount;
      return groups;
    }, {}),
  );
  const rpmTeamRows: Array<{ name: string; level: 'rpm' | 'associate' | 'total'; acres: number; dealValue: number; deals: number; payout: number }> = [];
  const rpmTeamOrder = ['Clayton Mason', 'Dave Stamp', 'James St. Peter', 'Max Davis', 'Nicolas Post', 'Reagan Gross'];
  rpmTeamOrder.forEach((rpmName) => {
    const [firstAssociate, secondAssociate] = associateRpmsByRpm[rpmName];
    const associateRows = [firstAssociate, secondAssociate].map((associateName) => {
      const rows = referralPartners.filter((partner) => partner.associateRpm === associateName);
      const dealValue = sumBy(rows, (partner) => partner.totalDealValue);
      return {
        name: associateName,
        level: 'associate' as const,
        acres: sumBy(rows, (partner) => partner.acres),
        dealValue,
        deals: sumBy(rows, (partner) => partner.dealCount),
        payout: Math.round(dealValue * rpmPayoutRate),
      };
    });
    rpmTeamRows.push({
      name: rpmName,
      level: 'rpm',
      acres: sumBy(associateRows, (row) => row.acres),
      dealValue: sumBy(associateRows, (row) => row.dealValue),
      deals: sumBy(associateRows, (row) => row.deals),
      payout: sumBy(associateRows, (row) => row.payout),
    });
    rpmTeamRows.push(...associateRows);
  });
  const rpmTeamTotal = {
    name: 'Total',
    level: 'total' as const,
    acres: sumBy(rpmTeamRows.filter((row) => row.level === 'rpm'), (row) => row.acres),
    dealValue: sumBy(rpmTeamRows.filter((row) => row.level === 'rpm'), (row) => row.dealValue),
    deals: sumBy(rpmTeamRows.filter((row) => row.level === 'rpm'), (row) => row.deals),
    payout: sumBy(rpmTeamRows.filter((row) => row.level === 'rpm'), (row) => row.payout),
  };

  const topRPMByAcres = take(sortDesc(rpmGroups, (rpm) => rpm.acres), 1)[0];
  const topRPMByDealValue = take(sortDesc(rpmGroups, (rpm) => rpm.dealValue), 1)[0];
  const topRPMByDeals = take(sortDesc(rpmGroups, (rpm) => rpm.deals), 1)[0];

  const dealValueBuckets = [
    { bucket: '01. Under $2.5K', weight: 0.05 },
    { bucket: '02. $2.5K-$5K', weight: 0.08 },
    { bucket: '03. $5K-$10K', weight: 0.12 },
    { bucket: '04. $10K-$25K', weight: 0.2 },
    { bucket: '05. $25K-$50K', weight: 0.22 },
    { bucket: '06. $50K-$100K', weight: 0.18 },
    { bucket: '07. $100K-$500K', weight: 0.12 },
    { bucket: '08. $500K+', weight: 0.03 },
  ];
  const dealValueBucketCounts = distributeByWeight(totalReferredDeals, dealValueBuckets.map((row) => row.weight));
  const dealDistributionByValueBucket = dealValueBuckets.map((row, index) => ({
    bucket: row.bucket,
    deals: dealValueBucketCounts[index],
  }));

  const stateDealValues = Object.values(
    referralPartners.reduce<Record<string, { state: string; value: number }>>((groups, partner) => {
      groups[partner.state] = groups[partner.state] ?? { state: partner.state, value: 0 };
      groups[partner.state].value += partner.totalDealValue;
      return groups;
    }, {}),
  );

  const rpmPerformanceData = {
    topRPMByAcres: { name: topRPMByAcres?.name ?? 'No RPMs', stat: `${wholeNumber(topRPMByAcres?.acres ?? 0)} acres` },
    topRPMByDealValue: { name: topRPMByDealValue?.name ?? 'No RPMs', stat: currencyShort(topRPMByDealValue?.dealValue ?? 0) },
    topRPMByDeals: { name: topRPMByDeals?.name ?? 'No RPMs', stat: `${(topRPMByDeals?.deals ?? 0).toLocaleString()} deals` },
    dealDistributionByValueBucket,
    stateDealValues,
    rpmTeamTable: [...rpmTeamRows, rpmTeamTotal],
  };

  return {
    master: {
      referralPartners,
      totalReferredDeals,
      openDeals,
      wonDeals,
      lostDeals,
      totalReferredDealValue,
      wonDealValue,
      totalAcres,
      activePartners,
      pendingRPs,
      rpPlusPartners,
      conciergeRps,
      standardRps,
      averageDealValue,
      marketPotentialByState,
      nationalMarketPotential,
      conversionRate,
      dealsEnteredPaidAccountsThisQuarter,
      partnersWithZeroDeals,
      lowRevenuePartners,
      lowRevenueThreshold,
      inactiveRPs,
      inactiveDaysThreshold,
      rpPlusContributionPct,
      incompleteRPPlusMappings,
      manualReferralCodeOverrides,
    },
    executive: executiveData,
    partners: partnerData,
    pipeline: pipelineData,
    rpOverview: rpOverviewData,
    nonRpOverview: nonRpOverviewData,
    rpPlus: rpPlusData,
    marketPotential: marketPotentialData,
    rpmPerformance: rpmPerformanceData,
  };
};
