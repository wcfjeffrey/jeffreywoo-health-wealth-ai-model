
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  NON_BINARY = 'Non-binary'
}

export enum Ethnicity {
  WHITE = 'White',
  BLACK = 'Black',
  ASIAN = 'Asian',
  HISPANIC = 'Hispanic',
  OTHER = 'Other'
}

export enum Education {
  HIGH_SCHOOL = 'High School',
  BACHELORS = 'Bachelors',
  MASTERS = 'Masters',
  PHD = 'PhD/MD'
}

export type EmploymentType = 'Full-time' | 'Part-time' | 'Self-employed' | 'Unemployed' | 'Retired';

export type DietaryPattern = 
  | 'Mediterranean' 
  | 'DASH' 
  | 'Vegan' 
  | 'Vegetarian' 
  | 'Pescatarian' 
  | 'Keto' 
  | 'Paleo' 
  | 'Western' 
  | 'Low-carb' 
  | 'Flexitarian' 
  | 'Carnivore' 
  | 'Whole30' 
  | 'Other';

export interface InsuranceCoverage {
  life: number;
  health: number;
  disability: number;
  criticalIllness: number;
  longTermCare: number;
}

export interface UserInput {
  // --- Demographics ---
  age: number;
  gender: Gender;
  ethnicity: Ethnicity;
  maritalStatus: string;
  location: string;
  
  // --- Lifestyle ---
  dietaryPattern: DietaryPattern;
  dietScore: number; // 1-10 quality
  exerciseHours: number; 
  sleepHours: number; 
  sleepQuality: number; // 1-10
  smoker: boolean;
  alcoholUnits: number; 
  recreationalDrugUse: 'None' | 'Occasional' | 'Regular';
  religiousSpiritualPractice: boolean;

  // --- Biometrics & Physiological ---
  bmi: number;
  waistToHipRatio: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  cholesterolLevel: number;
  bloodSugarLevel: number;
  restingHeartRate: number;
  vo2Max: number;
  dailySteps: number;
  heartRateVariability: number;

  // --- Medical / Family History / Genetic ---
  hasChronicDisease: boolean;
  geneticPredisposition: number; // 0-10
  familyLongevity: number;
  epigeneticAgeDelta: number;
  telomereLengthScale: number; // 1-10
  hasGeneticMutations: boolean;

  // --- Behavioral & Psychological ---
  mentalHealthStatus: number; // 1-10
  cognitiveFunctionScore: number; // 1-100
  socialConnectionLevel: number; // 1-10
  riskTakingBehavior: number; // 1-10

  // --- Environmental ---
  airQualityRating: number; // 1-5
  pollutionExposure: number; // 1-5
  healthcareAccess: number; // 1-5
  occupationalHazard: number; // 1-5
  stressLevel: number; // 1-10

  // --- Healthcare Utilization ---
  checkupFrequency: number;
  vaccinationHistoryScale: number; // 1-10
  medicationAdherence: number; // 1-10
  preventiveCareAccess: number; // 1-5

  // --- Macro & External ---
  regionalMortalityTrend: number; // 1-5
  climateChangeImpactRisk: number; // 1-5
  technologicalAccess: number; // 1-5

  // --- Socio-economic ---
  educationLevel: Education;
  employmentType: EmploymentType;

  // --- Financial ---
  income: number;
  savings: number;
  monthlyInvestment: number;
  monthlyExpenses: number;
  retirementAgeGoal: number;
  riskTolerance: number; // 1-10
  insuranceCoverage: InsuranceCoverage;
}

export interface IncomeBreakdown {
  essential: number;
  discretionary: number;
  savings: number;
  taxes: number;
}

export interface HealthRiskBreakdown {
  cardiovascular: number;
  metabolic: number;
  psychological: number;
  environmental: number;
}

export interface AnalysisResults {
  estimatedLongevityShift: number;
  baselineLongevity: number;
  financialRunwayAge: number;
  wealthAtRetirement: number;
  savingsShortfall: number;
  healthRiskScore: number;
  insuranceGap: number;
  probabilityOfSurvivalToRetirement: number;
  incomeBreakdown: IncomeBreakdown;
  healthRiskBreakdown: HealthRiskBreakdown;
}

export interface Recommendation {
  category: 'Health' | 'Wealth' | 'Environment';
  title: string;
  description: string;
  impact: string;
}
