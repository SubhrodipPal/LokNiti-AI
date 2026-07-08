export interface Village {
  id: string; // Used as Assembly Segment / Block ID
  name: string;
  x: number;
  y: number;
  population: number;
  developmentIndex: number;
  infrastructure: {
    roads: 'Good' | 'Fair' | 'Poor';
    schools: 'Adequate' | 'Deficient';
    healthCenters: 'Adequate' | 'Deficient';
    waterAccess: 'Adequate' | 'Scarce';
  };
  demographics: {
    literacy: number;
    rural: boolean; // false represents high density urban slum/residential pockets
    vulnerableRatio: number; // percentage of children/elderly
    growthRate: number; // projected growth rate % in 5 years
  };
}

export interface CitizenRequest {
  id: string;
  citizenName: string;
  contact: string;
  channel: 'WhatsApp' | 'SMS' | 'IVR' | 'Web' | 'Letter';
  category: 'Roads' | 'Education' | 'Health' | 'Water' | 'Sanitation' | 'Electricity';
  subCategory: string;
  originalText: string;
  translatedText: string;
  language: string;
  locationId: string;
  urgency: number; // 0.0 to 1.0
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  timestamp: string;
  status: 'Submitted' | 'AI Verified' | 'Recommended' | 'Approved' | 'In Progress' | 'Completed';
  supportVotes: number;
  opposeVotes: number;
  clusterId?: string;
  evidenceNotes: string;
  evidenceMatch: boolean;
}

export interface IssueCluster {
  id: string;
  title: string;
  category: 'Roads' | 'Education' | 'Health' | 'Water' | 'Sanitation' | 'Electricity';
  locationId: string;
  requestIds: string[];
  priorityScore: number;
  status: 'Recommended' | 'Approved' | 'In Progress' | 'Completed';
  estimatedCost: number; // in INR Lakhs (1 Lakh = 100,000)
  beneficiaries: number;
  impactMetric: string;
  reasoningBreakdown: {
    demandScore: number; // 25
    infraGapScore: number; // 20
    distanceScore: number; // 15
    densityScore: number; // 10
    vulnerableScore: number; // 10
    growthScore: number; // 10
    alignmentScore: number; // 5
    costScore: number; // 5
  };
}

export interface ConstituencyStats {
  name: string;
  state: string;
  budgetAllocated: number; // in Lakhs
  budgetSpent: number; // in Lakhs
  activeProjects: number;
  completedProjects: number;
  totalGrievances: number;
  resolvedGrievances: number;
  voterSatisfaction: number; // percentage
}

export interface SystemWeights {
  citizenDemand: number;
  infraGap: number;
  travelDistance: number;
  popDensity: number;
  vulnerablePop: number;
  popGrowth: number;
  planAlignment: number;
  costEffectiveness: number;
}

export interface ActionLogItem {
  id: string;
  timestamp: string;
  actor: 'MP / Minister' | 'District Officer' | 'System Admin' | 'Citizen';
  actionType: 'Approve' | 'ProgressStatus' | 'UpdateWeights' | 'SubmitGrievance' | 'Vote' | 'UpdateBudget';
  targetId: string;
  details: string;
  revertData?: any;
}

export interface ConstituencyData {
  id: string;
  name: string;
  displayName: string;
  state: string;
  stats: ConstituencyStats;
  villages: Village[];
  requests: CitizenRequest[];
  clusters: IssueCluster[];
}

export const initialSystemWeights: SystemWeights = {
  citizenDemand: 25,
  infraGap: 20,
  travelDistance: 15,
  popDensity: 10,
  vulnerablePop: 10,
  popGrowth: 10,
  planAlignment: 5,
  costEffectiveness: 5
};

// 1. Kolkata Uttar (Urban/Metropolitan Constituency)
const kolkataUttarData: ConstituencyData = {
  id: 'kolkata_uttar',
  name: 'Kolkata Uttar',
  displayName: 'Kolkata Uttar (Urban City)',
  state: 'West Bengal',
  stats: {
    name: 'Kolkata Uttar',
    state: 'West Bengal',
    budgetAllocated: 2500, // ₹25 Crore
    budgetSpent: 1915,     // 19.15 Crore spent
    activeProjects: 14,
    completedProjects: 142,
    totalGrievances: 4890,
    resolvedGrievances: 4210,
    voterSatisfaction: 81
  },
  villages: [
    {
      id: 'AS1',
      name: 'Kashipur-Belgachhia',
      x: 250,
      y: 60,
      population: 185000,
      developmentIndex: 65,
      infrastructure: { roads: 'Poor', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 76, rural: false, vulnerableRatio: 28, growthRate: 7 }
    },
    {
      id: 'AS2',
      name: 'Shyampukur',
      x: 220,
      y: 140,
      population: 145000,
      developmentIndex: 82,
      infrastructure: { roads: 'Fair', schools: 'Adequate', healthCenters: 'Adequate', waterAccess: 'Adequate' },
      demographics: { literacy: 86, rural: false, vulnerableRatio: 22, growthRate: 4 }
    },
    {
      id: 'AS3',
      name: 'Maniktala',
      x: 340,
      y: 150,
      population: 210000,
      developmentIndex: 74,
      infrastructure: { roads: 'Fair', schools: 'Adequate', healthCenters: 'Deficient', waterAccess: 'Adequate' },
      demographics: { literacy: 81, rural: false, vulnerableRatio: 26, growthRate: 6 }
    },
    {
      id: 'AS4',
      name: 'Jorasanko',
      x: 140,
      y: 220,
      population: 198000,
      developmentIndex: 78,
      infrastructure: { roads: 'Good', schools: 'Adequate', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 83, rural: false, vulnerableRatio: 24, growthRate: 3 }
    },
    {
      id: 'AS5',
      name: 'Beleghata',
      x: 380,
      y: 250,
      population: 245000,
      developmentIndex: 70,
      infrastructure: { roads: 'Poor', schools: 'Adequate', healthCenters: 'Adequate', waterAccess: 'Scarce' },
      demographics: { literacy: 79, rural: false, vulnerableRatio: 30, growthRate: 8 }
    },
    {
      id: 'AS6',
      name: 'Chowringhee',
      x: 180,
      y: 340,
      population: 162000,
      developmentIndex: 85,
      infrastructure: { roads: 'Good', schools: 'Adequate', healthCenters: 'Adequate', waterAccess: 'Adequate' },
      demographics: { literacy: 88, rural: false, vulnerableRatio: 18, growthRate: 3 }
    },
    {
      id: 'AS7',
      name: 'Entally',
      x: 310,
      y: 360,
      population: 220000,
      developmentIndex: 68,
      infrastructure: { roads: 'Fair', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Adequate' },
      demographics: { literacy: 77, rural: false, vulnerableRatio: 29, growthRate: 9 }
    }
  ],
  requests: [
    {
      id: 'REQ-001',
      citizenName: 'Bimal Sen',
      contact: '+91 98300 12345',
      channel: 'WhatsApp',
      category: 'Roads',
      subCategory: 'Drainage & Waterlogging',
      originalText: 'বর্ষা হলেই আমাদের কাশীপুর রেল কলোনি রোডটা সম্পূর্ণ ডুবে যায়, ২ ফুট জল জমে থাকে। নোংরা জল ঘরে ঢুকে পড়ছে, নিকাশি সংস্কার প্রয়োজন।',
      translatedText: 'Whenever monsoon starts, our Kashipur Railway Colony Road gets completely submerged under 2 feet of water. Dirty sewage is entering homes, urgent drainage cleanup needed.',
      language: 'Bengali',
      locationId: 'AS1',
      urgency: 0.92,
      sentiment: 'Negative',
      timestamp: '2026-07-01T10:15:30Z',
      status: 'AI Verified',
      supportVotes: 284,
      opposeVotes: 4,
      clusterId: 'CL-001',
      evidenceNotes: 'Geotag matches Ward 1, Kashipur. Municipal drainage layouts confirm 60-year-old silted sewer pipes. Satellite GIS confirms waterlogging footprint across 4 acres.',
      evidenceMatch: true
    },
    {
      id: 'REQ-002',
      citizenName: 'Sunita Devi',
      contact: '+91 94331 98765',
      channel: 'IVR',
      category: 'Water',
      subCategory: 'Filtration Plant installation',
      originalText: 'जोरासांको वार्ड ३९ में पीने के पानी में पीलापन आ रहा है और जंग की गंध है। बच्चों की सेहत खराब हो रही है। फिल्टर प्लांट लगायें।',
      translatedText: 'In Jorasanko Ward 39, drinking water is yellowish with a rusty smell. Childrens health is deteriorating. Install community filtration plant.',
      language: 'Hindi',
      locationId: 'AS4',
      urgency: 0.88,
      sentiment: 'Negative',
      timestamp: '2026-07-02T14:22:00Z',
      status: 'AI Verified',
      supportVotes: 198,
      opposeVotes: 1,
      clusterId: 'CL-002',
      evidenceNotes: 'Water testing logs from KMC laboratory confirm iron concentration at Jorasanko tube-wells exceeds standard limit by 2.4mg/L.',
      evidenceMatch: true
    },
    {
      id: 'REQ-003',
      citizenName: 'Ramesh Gowda',
      contact: '+91 91223 54321',
      channel: 'SMS',
      category: 'Education',
      subCategory: 'Primary School Repairs',
      originalText: 'Entally Primary School building is very old and roof leaks during rains. Students cannot sit in classroom.',
      translatedText: 'Entally Primary School building is very old and roof leaks during rains. Students cannot sit in classroom.',
      language: 'English',
      locationId: 'AS7',
      urgency: 0.78,
      sentiment: 'Negative',
      timestamp: '2026-07-03T09:05:00Z',
      status: 'AI Verified',
      supportVotes: 145,
      opposeVotes: 2,
      clusterId: 'CL-003',
      evidenceNotes: 'KMC Education wing inspection logs list Entally Ward 55 primary school as structural category C (requires structural strengthening).',
      evidenceMatch: true
    },
    {
      id: 'REQ-004',
      citizenName: 'Anwar Ali',
      contact: '+91 90511 22334',
      channel: 'Web',
      category: 'Health',
      subCategory: 'PHC Pediatrician Shortage',
      originalText: 'Beleghata Ward 34 urban health center has no permanent doctor or pediatrician. Emergencies have to go 4.5km to NRS Medical College.',
      translatedText: 'Beleghata Ward 34 urban health center has no permanent doctor or pediatrician. Emergencies have to go 4.5km to NRS Medical College.',
      language: 'English',
      locationId: 'AS5',
      urgency: 0.85,
      sentiment: 'Negative',
      timestamp: '2026-07-03T11:45:00Z',
      status: 'Submitted',
      supportVotes: 210,
      opposeVotes: 6,
      clusterId: 'CL-004',
      evidenceNotes: 'Sanctioned pediatric medical officers posts at Beleghata Ward Health Unit have been vacant since Nov 2024. Footfall averages 180 children/day.',
      evidenceMatch: true
    },
    {
      id: 'REQ-005',
      citizenName: 'Debolina Roy',
      contact: '+91 98312 34567',
      channel: 'Letter',
      category: 'Roads',
      subCategory: 'Drainage & Waterlogging',
      originalText: 'কাশীপুর অঞ্চলে ড্রেনেজ ব্যবস্থার চরম দুরবস্থা। সামান্য বৃষ্টিতে বেলগাছিয়া রোড নদী হয়ে যায়। অবিলম্বে ড্রেন সংস্কার করুন।',
      translatedText: 'Severe state of drainage in Kashipur area. Belgachhia Road turns into a river in minor rains. Renovate drains immediately.',
      language: 'Bengali',
      locationId: 'AS1',
      urgency: 0.90,
      sentiment: 'Negative',
      timestamp: '2026-07-04T16:00:00Z',
      status: 'AI Verified',
      supportVotes: 242,
      opposeVotes: 3,
      clusterId: 'CL-001',
      evidenceNotes: 'Duplicates REQ-001. Directly linked to Kashipur/Belgachhia drainage congestion.',
      evidenceMatch: true
    },
    {
      id: 'REQ-006',
      citizenName: 'Karan Sharma',
      contact: '+91 93310 11223',
      channel: 'WhatsApp',
      category: 'Water',
      subCategory: 'Filtration Plant installation',
      originalText: 'जोरासांको में पानी की पाइप लाइन पुरानी है। गंदा पानी आ रहा है। नया वाटर फिल्टर चाहिए।',
      translatedText: 'Water pipelines in Jorasanko are old. Contaminated water is coming. Need new water filter.',
      language: 'Hindi',
      locationId: 'AS4',
      urgency: 0.86,
      sentiment: 'Negative',
      timestamp: '2026-07-05T08:30:00Z',
      status: 'AI Verified',
      supportVotes: 178,
      opposeVotes: 1,
      clusterId: 'CL-002',
      evidenceNotes: 'Duplicates REQ-002. Matches high turbidity levels in Jorasanko water grid.',
      evidenceMatch: true
    },
    {
      id: 'REQ-007',
      citizenName: 'Subir Das',
      contact: '+91 98450 78901',
      channel: 'SMS',
      category: 'Electricity',
      subCategory: 'Voltage fluctuations',
      originalText: 'Chowringhee Ward 62 facing heavy voltage fluctuations in evening. Appliances getting damaged.',
      translatedText: 'Chowringhee Ward 62 facing heavy voltage fluctuations in evening. Appliances getting damaged.',
      language: 'English',
      locationId: 'AS6',
      urgency: 0.45,
      sentiment: 'Negative',
      timestamp: '2026-07-05T12:10:00Z',
      status: 'Submitted',
      supportVotes: 62,
      opposeVotes: 32,
      evidenceNotes: 'CESC grid records verify standard voltage level maintained. Localized domestic building wiring load imbalance suspected.',
      evidenceMatch: false
    }
  ],
  clusters: [
    {
      id: 'CL-001',
      title: 'Kashipur-Belgachhia Drainage Sewerage Renovation',
      category: 'Roads',
      locationId: 'AS1',
      requestIds: ['REQ-001', 'REQ-005'],
      priorityScore: 95,
      status: 'Recommended',
      estimatedCost: 180, // ₹1.8 Crore
      beneficiaries: 45000,
      impactMetric: 'Prevents regular monsoon waterlogging across 4 wards, benefiting 45,000 residents and reducing business halt.',
      reasoningBreakdown: { demandScore: 24, infraGapScore: 20, distanceScore: 15, densityScore: 9, vulnerableScore: 8, growthScore: 7, alignmentScore: 5, costScore: 7 }
    },
    {
      id: 'CL-002',
      title: 'Jorasanko Community Water Filtration Plant & Pipelines',
      category: 'Water',
      locationId: 'AS4',
      requestIds: ['REQ-002', 'REQ-006'],
      priorityScore: 90,
      status: 'Recommended',
      estimatedCost: 85, // ₹85 Lakhs
      beneficiaries: 38000,
      impactMetric: 'Provides iron-filtered clean drinking water tap access to 5,500 congested commercial/slum households.',
      reasoningBreakdown: { demandScore: 20, infraGapScore: 20, distanceScore: 14, densityScore: 8, vulnerableScore: 9, growthScore: 6, alignmentScore: 5, costScore: 8 }
    },
    {
      id: 'CL-003',
      title: 'Entally Primary School Roof & Structural Repair',
      category: 'Education',
      locationId: 'AS7',
      requestIds: ['REQ-003'],
      priorityScore: 83,
      status: 'Recommended',
      estimatedCost: 45, // ₹45 Lakhs
      beneficiaries: 1200,
      impactMetric: 'Strengthens roof slab and constructs 2 new dry classrooms for Belgachhia railway school children.',
      reasoningBreakdown: { demandScore: 16, infraGapScore: 20, distanceScore: 12, densityScore: 7, vulnerableScore: 9, growthScore: 8, alignmentScore: 4, costScore: 7 }
    },
    {
      id: 'CL-004',
      title: 'Beleghata Ward Health Unit Doctor Quarters & Pediatrician allocation',
      category: 'Health',
      locationId: 'AS5',
      requestIds: ['REQ-004'],
      priorityScore: 88,
      status: 'Approved',
      estimatedCost: 65, // ₹65 Lakhs
      beneficiaries: 22000,
      impactMetric: 'Sanctions pediatric wing equipment and fills medical vacancies pre-empting child healthcare queue bottlenecks.',
      reasoningBreakdown: { demandScore: 18, infraGapScore: 20, distanceScore: 13, densityScore: 9, vulnerableScore: 9, growthScore: 7, alignmentScore: 5, costScore: 7 }
    }
  ]
};

// 2. Purulia (Dryland/Drought-prone Constituency)
const puruliaData: ConstituencyData = {
  id: 'purulia',
  name: 'Purulia',
  displayName: 'Purulia (Semi-Arid Rural)',
  state: 'West Bengal',
  stats: {
    name: 'Purulia',
    state: 'West Bengal',
    budgetAllocated: 2500, // ₹25 Crore
    budgetSpent: 2125,     // 21.25 Crore spent
    activeProjects: 8,
    completedProjects: 85,
    totalGrievances: 3450,
    resolvedGrievances: 2980,
    voterSatisfaction: 74
  },
  villages: [
    {
      id: 'AS1',
      name: 'Purulia Town',
      x: 240,
      y: 100,
      population: 120000,
      developmentIndex: 72,
      infrastructure: { roads: 'Fair', schools: 'Adequate', healthCenters: 'Adequate', waterAccess: 'Adequate' },
      demographics: { literacy: 80, rural: false, vulnerableRatio: 23, growthRate: 5 }
    },
    {
      id: 'AS2',
      name: 'Balarampur',
      x: 160,
      y: 180,
      population: 155000,
      developmentIndex: 54, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 62, rural: true, vulnerableRatio: 33, growthRate: 6 }
    },
    {
      id: 'AS3',
      name: 'Baghmundi',
      x: 110,
      y: 240,
      population: 135000,
      developmentIndex: 48, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 55, rural: true, vulnerableRatio: 36, growthRate: 4 }
    },
    {
      id: 'AS4',
      name: 'Jhalda',
      x: 100,
      y: 120,
      population: 145000,
      developmentIndex: 52, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Adequate', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 66, rural: true, vulnerableRatio: 31, growthRate: 3 }
    },
    {
      id: 'AS5',
      name: 'Manbazar',
      x: 360,
      y: 220,
      population: 180000,
      developmentIndex: 58, // Critical!
      infrastructure: { roads: 'Fair', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 63, rural: true, vulnerableRatio: 34, growthRate: 8 }
    },
    {
      id: 'AS6',
      name: 'Hura',
      x: 380,
      y: 110,
      population: 165000,
      developmentIndex: 62,
      infrastructure: { roads: 'Fair', schools: 'Adequate', healthCenters: 'Adequate', waterAccess: 'Scarce' },
      demographics: { literacy: 70, rural: true, vulnerableRatio: 28, growthRate: 7 }
    },
    {
      id: 'AS7',
      name: 'Puncha',
      x: 300,
      y: 320,
      population: 140000,
      developmentIndex: 56, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 61, rural: true, vulnerableRatio: 32, growthRate: 6 }
    }
  ],
  requests: [
    {
      id: 'REQ-001',
      citizenName: 'Dhananjay Mahato',
      contact: '+91 94347 11111',
      channel: 'WhatsApp',
      category: 'Water',
      subCategory: 'Fluoride Filter Installation',
      originalText: 'আমাদের বলরামপুরে নলকূপের জল খেলে দাঁত ও হাড় খয়ে যাচ্ছে। জলে অতিরিক্ত ফ্লুরাইড আছে, ফিল্টার প্ল্যান্ট চাই।',
      translatedText: 'Drinking tube-well water in Balarampur is decaying our teeth and bones. Excess fluoride in groundwater, need water filtration plant.',
      language: 'Bengali',
      locationId: 'AS2',
      urgency: 0.95,
      sentiment: 'Negative',
      timestamp: '2026-07-01T08:10:00Z',
      status: 'AI Verified',
      supportVotes: 342,
      opposeVotes: 2,
      clusterId: 'CL-001',
      evidenceNotes: 'Geotag matches Balarampur Block. Public Health Engineering testing records show fluoride at 3.2 mg/L (safety limit 1.0 mg/L).',
      evidenceMatch: true
    },
    {
      id: 'REQ-002',
      citizenName: 'Budhni Murmu',
      contact: '+91 90022 55555',
      channel: 'IVR',
      category: 'Water',
      subCategory: 'Water Tanker Supply',
      originalText: 'बाघमुंडी ब्लॉक में पीने के पानी का भारी संकट है। कुएं सूख गए हैं, महिलाएं ३ किमी दूर से पानी लाती हैं। पानी की टंकी की आवश्यकता है।',
      translatedText: 'Severe drinking water crisis in Baghmundi block. Wells are dry, women fetch water from 3km. Need water tanker/reservoir.',
      language: 'Hindi',
      locationId: 'AS3',
      urgency: 0.98,
      sentiment: 'Negative',
      timestamp: '2026-07-02T12:15:00Z',
      status: 'AI Verified',
      supportVotes: 420,
      opposeVotes: 0,
      clusterId: 'CL-002',
      evidenceNotes: 'Baghmundi groundwater monitoring shows absolute depletion of aquifers. Surface reservoirs dry.',
      evidenceMatch: true
    },
    {
      id: 'REQ-003',
      citizenName: 'Sanat Kumar',
      contact: '+91 98455 22222',
      channel: 'Web',
      category: 'Roads',
      subCategory: 'Check-Dam Construction',
      originalText: 'ঝালদা অঞ্চলে বৃষ্টির জল ধরে রাখার জন্য চেক-ড্যাম বা জলাধার নির্মাণ করা অত্যন্ত জরুরী। চাষের জল পাওয়া যাচ্ছে না।',
      translatedText: 'Constructing check-dams or reservoirs to harvest rainwater in Jhalda is highly urgent. No irrigation water.',
      language: 'Bengali',
      locationId: 'AS4',
      urgency: 0.88,
      sentiment: 'Negative',
      timestamp: '2026-07-03T14:40:00Z',
      status: 'AI Verified',
      supportVotes: 180,
      opposeVotes: 4,
      clusterId: 'CL-003',
      evidenceNotes: 'Topographic contour analysis validates Jhalda stream basin matches optimal sites for 3 series check-dams.',
      evidenceMatch: true
    },
    {
      id: 'REQ-004',
      citizenName: 'Shanti Mandi',
      contact: '+91 91220 99999',
      channel: 'Letter',
      category: 'Education',
      subCategory: 'School Toilet Blocks',
      originalText: 'মানবাজারের আদিবাসী প্রাথমিক বিদ্যালয়ে মেয়েদের জন্য শৌচাগার নেই। ছাত্রীরা স্কুল ছেড়ে দিচ্ছে।',
      translatedText: 'No girls toilets in Manbazar tribal primary school. Female students are dropping out.',
      language: 'Bengali',
      locationId: 'AS5',
      urgency: 0.90,
      sentiment: 'Negative',
      timestamp: '2026-07-04T10:00:00Z',
      status: 'Submitted',
      supportVotes: 156,
      opposeVotes: 1,
      clusterId: 'CL-004',
      evidenceNotes: 'District education audit lists Manbazar school as zero-sanitation infrastructure site.',
      evidenceMatch: true
    }
  ],
  clusters: [
    {
      id: 'CL-001',
      title: 'Balarampur Fluorosis Filtration Plant',
      category: 'Water',
      locationId: 'AS2',
      requestIds: ['REQ-001'],
      priorityScore: 94,
      status: 'Recommended',
      estimatedCost: 95, // ₹95 Lakhs
      beneficiaries: 22000,
      impactMetric: 'Removes toxic fluoride, providing safe drinking water tap connections to 22,000 tribal villagers.',
      reasoningBreakdown: { demandScore: 23, infraGapScore: 20, distanceScore: 15, densityScore: 7, vulnerableScore: 10, growthScore: 6, alignmentScore: 5, costScore: 8 }
    },
    {
      id: 'CL-002',
      title: 'Baghmundi Rainwater Harvesting Check-Dams',
      category: 'Water',
      locationId: 'AS3',
      requestIds: ['REQ-002'],
      priorityScore: 96,
      status: 'Recommended',
      estimatedCost: 160, // ₹1.6 Crore
      beneficiaries: 34000,
      impactMetric: 'Constructs 3 concrete check-dams in Ayodhya hills streams to recharge water table and assist irrigation.',
      reasoningBreakdown: { demandScore: 25, infraGapScore: 20, distanceScore: 14, densityScore: 6, vulnerableScore: 10, growthScore: 8, alignmentScore: 5, costScore: 8 }
    },
    {
      id: 'CL-003',
      title: 'Jhalda Piped Water Grid System',
      category: 'Water',
      locationId: 'AS4',
      requestIds: ['REQ-003'],
      priorityScore: 91,
      status: 'Recommended',
      estimatedCost: 240, // ₹2.4 Crore
      beneficiaries: 48000,
      impactMetric: 'Lays 12km connecting pipe system from Subarnarekha river supply to Jhalda rural settlement centers.',
      reasoningBreakdown: { demandScore: 20, infraGapScore: 20, distanceScore: 15, densityScore: 7, vulnerableScore: 9, growthScore: 7, alignmentScore: 5, costScore: 8 }
    },
    {
      id: 'CL-004',
      title: 'Manbazar Girls School Sanitation Campaign',
      category: 'Education',
      locationId: 'AS5',
      requestIds: ['REQ-004'],
      priorityScore: 87,
      status: 'Approved',
      estimatedCost: 35, // ₹35 Lakhs
      beneficiaries: 4500,
      impactMetric: 'Builds modern toilet blocks with bio-digesters in 3 primary schools, reducing girls dropout rates.',
      reasoningBreakdown: { demandScore: 18, infraGapScore: 20, distanceScore: 12, densityScore: 8, vulnerableScore: 10, growthScore: 6, alignmentScore: 5, costScore: 8 }
    }
  ]
};

// 3. Darjeeling (Hilly/Tea Gardens Constituency)
const darjeelingData: ConstituencyData = {
  id: 'darjeeling',
  name: 'Darjeeling',
  displayName: 'Darjeeling (Hilly Slopes)',
  state: 'West Bengal',
  stats: {
    name: 'Darjeeling',
    state: 'West Bengal',
    budgetAllocated: 2500, // ₹25 Crore
    budgetSpent: 2200,     // 22.0 Crore spent
    activeProjects: 6,
    completedProjects: 92,
    totalGrievances: 2890,
    resolvedGrievances: 2410,
    voterSatisfaction: 79
  },
  villages: [
    {
      id: 'AS1',
      name: 'Darjeeling Town',
      x: 200,
      y: 100,
      population: 132000,
      developmentIndex: 76,
      infrastructure: { roads: 'Fair', schools: 'Adequate', healthCenters: 'Adequate', waterAccess: 'Adequate' },
      demographics: { literacy: 89, rural: false, vulnerableRatio: 19, growthRate: 3 }
    },
    {
      id: 'AS2',
      name: 'Kalimpong',
      x: 380,
      y: 120,
      population: 120000,
      developmentIndex: 70,
      infrastructure: { roads: 'Fair', schools: 'Adequate', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 82, rural: true, vulnerableRatio: 24, growthRate: 4 }
    },
    {
      id: 'AS3',
      name: 'Kurseong',
      x: 240,
      y: 220,
      population: 115000,
      developmentIndex: 64,
      infrastructure: { roads: 'Poor', schools: 'Adequate', healthCenters: 'Adequate', waterAccess: 'Scarce' },
      demographics: { literacy: 84, rural: true, vulnerableRatio: 26, growthRate: 2 }
    },
    {
      id: 'AS4',
      name: 'Mirik',
      x: 120,
      y: 240,
      population: 95000,
      developmentIndex: 68,
      infrastructure: { roads: 'Poor', schools: 'Adequate', healthCenters: 'Deficient', waterAccess: 'Adequate' },
      demographics: { literacy: 81, rural: true, vulnerableRatio: 22, growthRate: 3 }
    },
    {
      id: 'AS5',
      name: 'Pulbazar',
      x: 100,
      y: 80,
      population: 85000,
      developmentIndex: 55, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 75, rural: true, vulnerableRatio: 32, growthRate: 4 }
    },
    {
      id: 'AS6',
      name: 'Sukhia Pokhri',
      x: 90,
      y: 180,
      population: 98000,
      developmentIndex: 59, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Adequate', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 78, rural: true, vulnerableRatio: 30, growthRate: 3 }
    },
    {
      id: 'AS7',
      name: 'Gorubathan',
      x: 410,
      y: 280,
      population: 105000,
      developmentIndex: 58, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Adequate' },
      demographics: { literacy: 76, rural: true, vulnerableRatio: 29, growthRate: 5 }
    }
  ],
  requests: [
    {
      id: 'REQ-001',
      citizenName: 'Tshering Sherpa',
      contact: '+91 97330 22222',
      channel: 'Web',
      category: 'Roads',
      subCategory: 'Landslide Protection Wall',
      originalText: 'landslide hazard is very high at NH55 near Kurseong. Retaining wall structure needs urgent reinforcing before next rain.',
      translatedText: 'landslide hazard is very high at NH55 near Kurseong. Retaining wall structure needs urgent reinforcing before next rain.',
      language: 'English',
      locationId: 'AS3',
      urgency: 0.93,
      sentiment: 'Negative',
      timestamp: '2026-07-01T09:12:00Z',
      status: 'AI Verified',
      supportVotes: 310,
      opposeVotes: 1,
      clusterId: 'CL-001',
      evidenceNotes: 'Geotag matches landslide-prone slope Ward 4 Kurseong. Geological survey rates slope instability index at 82%.',
      evidenceMatch: true
    },
    {
      id: 'REQ-002',
      citizenName: 'Pema Tamang',
      contact: '+91 99335 88888',
      channel: 'WhatsApp',
      category: 'Water',
      subCategory: 'Spring-Water Pipelines',
      originalText: 'सुखियापोखरी चिया कमानका श्रमिकहरूका लागि पिउने पानीको स्रोत छैन। मूल धाराबाट पानी जोड्न पाइपलाइन चाहिन्छ।',
      translatedText: 'No drinking water source for Sukhia Pokhri tea garden workers. Need pipeline from spring source.',
      language: 'Nepali',
      locationId: 'AS6',
      urgency: 0.89,
      sentiment: 'Negative',
      timestamp: '2026-07-02T10:30:00Z',
      status: 'AI Verified',
      supportVotes: 245,
      opposeVotes: 3,
      clusterId: 'CL-002',
      evidenceNotes: 'GIS water resource mapping validates natural spring (Jhora) source located 1.2km uphill from tea estate quarters.',
      evidenceMatch: true
    },
    {
      id: 'REQ-003',
      citizenName: 'Biren Subba',
      contact: '+91 94340 77777',
      channel: 'IVR',
      category: 'Education',
      subCategory: 'School Slope Reinforcement',
      originalText: 'पुलबजारको पहाडी प्राथमिक विद्यालय पहिरोले क्षतिग्रस्त भएको छ। कक्षा सञ्चालन गर्न जोखिमपूर्ण छ।',
      translatedText: 'Hill primary school in Pulbazar is damaged by landslide. Running classes is risky.',
      language: 'Nepali',
      locationId: 'AS5',
      urgency: 0.85,
      sentiment: 'Negative',
      timestamp: '2026-07-03T15:20:00Z',
      status: 'Submitted',
      supportVotes: 198,
      opposeVotes: 2,
      clusterId: 'CL-003',
      evidenceNotes: 'Local inspector notes cracks in school foundation due to sub-surface soil creep.',
      evidenceMatch: true
    }
  ],
  clusters: [
    {
      id: 'CL-001',
      title: 'NH55 Slope Landslide Retaining Concrete Walls',
      category: 'Roads',
      locationId: 'AS3',
      requestIds: ['REQ-001'],
      priorityScore: 93,
      status: 'Recommended',
      estimatedCost: 210, // ₹2.1 Crore
      beneficiaries: 65000,
      impactMetric: 'Reinforces 4 critical landslide zones on NH55 highway, securing transit and protecting adjacent slopes.',
      reasoningBreakdown: { demandScore: 23, infraGapScore: 20, distanceScore: 14, densityScore: 7, vulnerableScore: 9, growthScore: 5, alignmentScore: 5, costScore: 7 }
    },
    {
      id: 'CL-002',
      title: 'Sukhia Pokhri Tea Garden Spring Water Pipeline',
      category: 'Water',
      locationId: 'AS6',
      requestIds: ['REQ-002'],
      priorityScore: 89,
      status: 'Recommended',
      estimatedCost: 110, // ₹1.1 Crore
      beneficiaries: 28000,
      impactMetric: 'Lays 1.2km mountain gravity-fed pipes, delivering clean spring water to tea garden worker households.',
      reasoningBreakdown: { demandScore: 21, infraGapScore: 20, distanceScore: 13, densityScore: 6, vulnerableScore: 10, growthScore: 6, alignmentScore: 5, costScore: 8 }
    },
    {
      id: 'CL-003',
      title: 'Pulbazar Slope Reinforcement & School Reconstruction',
      category: 'Education',
      locationId: 'AS5',
      requestIds: ['REQ-003'],
      priorityScore: 85,
      status: 'Approved',
      estimatedCost: 95, // ₹95 Lakhs
      beneficiaries: 6800,
      impactMetric: 'Rebuilds school foundation with rock anchoring and concrete retaining walls, restoring safe school access.',
      reasoningBreakdown: { demandScore: 19, infraGapScore: 20, distanceScore: 12, densityScore: 6, vulnerableScore: 10, growthScore: 5, alignmentScore: 5, costScore: 8 }
    }
  ]
};

// 4. Sundarbans (Coastal Delta/Disaster-prone Constituency)
const sundarbansData: ConstituencyData = {
  id: 'sundarbans',
  name: 'Sundarbans',
  displayName: 'Sundarbans (Coastal Delta)',
  state: 'West Bengal',
  stats: {
    name: 'Sundarbans',
    state: 'West Bengal',
    budgetAllocated: 2500, // ₹25 Crore
    budgetSpent: 2180,     // 21.8 Crore spent
    activeProjects: 9,
    completedProjects: 78,
    totalGrievances: 4120,
    resolvedGrievances: 3540,
    voterSatisfaction: 77
  },
  villages: [
    {
      id: 'AS1',
      name: 'Gosaba',
      x: 280,
      y: 260,
      population: 190000,
      developmentIndex: 52, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Adequate', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 73, rural: true, vulnerableRatio: 34, growthRate: 8 }
    },
    {
      id: 'AS2',
      name: 'Sagar Island',
      x: 80,
      y: 360,
      population: 220000,
      developmentIndex: 64,
      infrastructure: { roads: 'Fair', schools: 'Adequate', healthCenters: 'Adequate', waterAccess: 'Scarce' },
      demographics: { literacy: 79, rural: true, vulnerableRatio: 28, growthRate: 5 }
    },
    {
      id: 'AS3',
      name: 'Namkhana',
      x: 160,
      y: 380,
      population: 180000,
      developmentIndex: 58, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 74, rural: true, vulnerableRatio: 30, growthRate: 7 }
    },
    {
      id: 'AS4',
      name: 'Patharpratima',
      x: 210,
      y: 390,
      population: 200000,
      developmentIndex: 55, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Deficient', healthCenters: 'Adequate', waterAccess: 'Scarce' },
      demographics: { literacy: 72, rural: true, vulnerableRatio: 33, growthRate: 6 }
    },
    {
      id: 'AS5',
      name: 'Basanti',
      x: 330,
      y: 190,
      population: 215000,
      developmentIndex: 56, // Critical!
      infrastructure: { roads: 'Fair', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Adequate' },
      demographics: { literacy: 71, rural: true, vulnerableRatio: 32, growthRate: 9 }
    },
    {
      id: 'AS6',
      name: 'Sandeshkhali',
      x: 390,
      y: 110,
      population: 175000,
      developmentIndex: 50, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Adequate', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 68, rural: true, vulnerableRatio: 31, growthRate: 8 }
    },
    {
      id: 'AS7',
      name: 'Hingalganj',
      x: 410,
      y: 50,
      population: 160000,
      developmentIndex: 48, // Critical!
      infrastructure: { roads: 'Poor', schools: 'Deficient', healthCenters: 'Deficient', waterAccess: 'Scarce' },
      demographics: { literacy: 65, rural: true, vulnerableRatio: 35, growthRate: 6 }
    }
  ],
  requests: [
    {
      id: 'REQ-001',
      citizenName: 'Gouranga Mondal',
      contact: '+91 97340 33333',
      channel: 'WhatsApp',
      category: 'Roads',
      subCategory: 'Embankment Reinforcement',
      originalText: 'গোসাবা নদীর বাঁধ আম্ফান ঝড়ে ভেঙে গেছে। নোনা জল ঢুকে ধান চাষ শেষ, অবিলম্বে কংক্রিট বাঁধ বা বোল্ডার বসানো হোক।',
      translatedText: 'Gosaba river embankment broke in cyclone. Saltwater has ruined paddy crops, urgently build concrete embankment or lay boulders.',
      language: 'Bengali',
      locationId: 'AS1',
      urgency: 0.97,
      sentiment: 'Negative',
      timestamp: '2026-07-01T07:15:00Z',
      status: 'AI Verified',
      supportVotes: 489,
      opposeVotes: 1,
      clusterId: 'CL-001',
      evidenceNotes: 'Geotag matches breached embankment in Gosaba. Sentinel satellite imagery confirms saline water inundation across 220 hectares.',
      evidenceMatch: true
    },
    {
      id: 'REQ-002',
      citizenName: 'Shibu Naskar',
      contact: '+91 90518 44444',
      channel: 'Letter',
      category: 'Roads',
      subCategory: 'Concrete Jetty Ghat',
      originalText: 'সন্দেশখালি ফেরি ঘাট খুবই বিপজ্জনক। কংক্রিটের জেটি ঘাট না থাকায় নৌকোয় উঠতে গিয়ে গত সপ্তাহে ২ জন পড়ে যায়।',
      translatedText: 'Sandeshkhali ferry jetty is hazardous. Lacking concrete jetty, 2 people fell into river last week while boarding.',
      language: 'Bengali',
      locationId: 'AS6',
      urgency: 0.88,
      sentiment: 'Negative',
      timestamp: '2026-07-02T11:00:00Z',
      status: 'AI Verified',
      supportVotes: 212,
      opposeVotes: 2,
      clusterId: 'CL-002',
      evidenceNotes: 'Sandeshkhali ferry logs record daily passenger load of 8,500. Slipways show algae siltation.',
      evidenceMatch: true
    },
    {
      id: 'REQ-003',
      citizenName: 'Rabindra Maiti',
      contact: '+91 98319 99999',
      channel: 'SMS',
      category: 'Water',
      subCategory: 'Solar Desalination Plant',
      originalText: 'নামখানাতে পানীয় জলের পুকুরগুলো সব নোনা হয়ে গেছে ঘূর্ণিঝড়ে। সৌর চালিত ডিস্যালিনেশন প্ল্যান্ট বসানো প্রয়োজন।',
      translatedText: 'Drinking water ponds in Namkhana turned saline due to cyclone. Solar desalination plant needed.',
      language: 'Bengali',
      locationId: 'AS3',
      urgency: 0.92,
      sentiment: 'Negative',
      timestamp: '2026-07-03T16:05:00Z',
      status: 'Submitted',
      supportVotes: 320,
      opposeVotes: 3,
      clusterId: 'CL-003',
      evidenceNotes: 'Pond water salinity logs confirm chloride content at 1200 mg/L (potable limit 250 mg/L). Solar potential matches criteria.',
      evidenceMatch: true
    }
  ],
  clusters: [
    {
      id: 'CL-001',
      title: 'Gosaba concrete river embankment reinforcement',
      category: 'Roads',
      locationId: 'AS1',
      requestIds: ['REQ-001'],
      priorityScore: 97,
      status: 'Recommended',
      estimatedCost: 280, // ₹2.8 Crore
      beneficiaries: 85000,
      impactMetric: 'Constructs 450 meters of reinforced concrete flood protection embankment, shielding Gosaba village from saline floods.',
      reasoningBreakdown: { demandScore: 25, infraGapScore: 20, distanceScore: 14, densityScore: 7, vulnerableScore: 10, growthScore: 8, alignmentScore: 5, costScore: 8 }
    },
    {
      id: 'CL-002',
      title: 'Sandeshkhali Concrete Jetty & Ferry Ghat',
      category: 'Roads',
      locationId: 'AS6',
      requestIds: ['REQ-002'],
      priorityScore: 88,
      status: 'Recommended',
      estimatedCost: 75, // ₹75 Lakhs
      beneficiaries: 42000,
      impactMetric: 'Reconstructs slipway with floating concrete jetty pontoon and safety railings, ensuring safe passenger boarding.',
      reasoningBreakdown: { demandScore: 21, infraGapScore: 20, distanceScore: 12, densityScore: 8, vulnerableScore: 9, growthScore: 6, alignmentScore: 4, costScore: 8 }
    },
    {
      id: 'CL-003',
      title: 'Namkhana Solar Desalination Ponds',
      category: 'Water',
      locationId: 'AS3',
      requestIds: ['REQ-003'],
      priorityScore: 92,
      status: 'Approved',
      estimatedCost: 120, // ₹1.2 Crore
      beneficiaries: 30000,
      impactMetric: 'Installs 2 solar reverse-osmosis purification kiosks to filter saline pond water, serving 30,000 delta residents.',
      reasoningBreakdown: { demandScore: 23, infraGapScore: 20, distanceScore: 13, densityScore: 7, vulnerableScore: 10, growthScore: 7, alignmentScore: 5, costScore: 7 }
    }
  ]
};

export const constituencyPresets: Record<string, ConstituencyData> = {
  kolkata_uttar: kolkataUttarData,
  purulia: puruliaData,
  darjeeling: darjeelingData,
  sundarbans: sundarbansData
};

export const calculatePriority = (cluster: IssueCluster, weights: SystemWeights, villages: Village[]): number => {
  const village = villages.find(v => v.id === cluster.locationId);
  if (!village) return 0;
  
  // 1. Citizen Demand: relative to requests count + support votes
  const totalVotes = cluster.requestIds.length * 50 + 150;
  const demandVal = Math.min(100, (totalVotes / 400) * 100);
  
  // 2. Infra Gap: check village infrastructure status
  let infraVal = 0;
  if (cluster.category === 'Roads') infraVal = village.infrastructure.roads === 'Poor' ? 100 : village.infrastructure.roads === 'Fair' ? 50 : 10;
  else if (cluster.category === 'Education') infraVal = village.infrastructure.schools === 'Deficient' ? 100 : 20;
  else if (cluster.category === 'Health') infraVal = village.infrastructure.healthCenters === 'Deficient' ? 100 : 20;
  else if (cluster.category === 'Water') infraVal = village.infrastructure.waterAccess === 'Scarce' ? 100 : 20;
  else infraVal = 50; // Default
  
  // 3. Travel Distance: mock distance gap score
  const distanceVal = cluster.category === 'Roads' || cluster.category === 'Water' ? 90 : 60;
  
  // 4. Population Density: relative to assembly population (scaling urban density)
  const densityVal = Math.min(100, (village.population / 250000) * 100);
  
  // 5. Vulnerable Population ratio
  const vulnerableVal = village.demographics.vulnerableRatio * 3.3; // Scale up to 100
  
  // 6. Growth Rate
  const growthVal = village.demographics.growthRate * 10; // Scale up to 100
  
  // 7. Plan Alignment
  const alignmentVal = 95; // High alignment
  
  // 8. Cost Effectiveness: inverted cost (lower cost -> higher score)
  const costVal = Math.max(10, 100 - (cluster.estimatedCost / 3));
  
  // Calculate weighted sum
  const sumWeights = weights.citizenDemand + weights.infraGap + weights.travelDistance + weights.popDensity + 
                     weights.vulnerablePop + weights.popGrowth + weights.planAlignment + weights.costEffectiveness;
  
  const score = (
    demandVal * weights.citizenDemand +
    infraVal * weights.infraGap +
    distanceVal * weights.travelDistance +
    densityVal * weights.popDensity +
    vulnerableVal * weights.vulnerablePop +
    growthVal * weights.popGrowth +
    alignmentVal * weights.planAlignment +
    costVal * weights.costEffectiveness
  ) / (sumWeights || 1);
  
  return Math.round(score);
};

// Backward-compatible exports
export const initialVillables = kolkataUttarData.villages;
export const initialVillages = kolkataUttarData.villages;
export const initialCitizenRequests = kolkataUttarData.requests;
export const initialIssueClusters = kolkataUttarData.clusters;
export const initialConstituencyStats = kolkataUttarData.stats;

export type { Village as AssemblySegment };
export { initialConstituencyStats as initialStats };

export const formatIndianCurrency = (lakhs: number): string => {
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `₹${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Crore`;
  }
  return `₹${lakhs.toFixed(0)} Lakhs`;
};
