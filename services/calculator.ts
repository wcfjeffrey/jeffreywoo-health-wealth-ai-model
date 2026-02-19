
import { UserInput, AnalysisResults, Gender, Education, IncomeBreakdown, HealthRiskBreakdown, EmploymentType, DietaryPattern } from '../types';
import { BASELINE_LONGEVITY, ANNUAL_RETURN_RATE, INFLATION_RATE } from '../constants';

export const calculateLongevityShift = (input: UserInput): number => {
  let shift = 0;
  
  // 1. Biometrics & Lifestyle Vitals
  if (input.bmi < 18.5 || input.bmi > 30) shift -= 2.0;
  if (input.bloodPressureSys > 140 || input.bloodPressureDia > 90) shift -= 3.5;
  if (input.bloodSugarLevel > 110) shift -= 2.5;
  shift += (input.vo2Max > 40 ? 2.5 : -1.0);
  shift += (input.dailySteps / 5000) * 0.8;
  shift += (input.sleepQuality / 10) * 1.5;
  shift += (input.dietScore - 6) * 1.0;

  // 2. Genetic & Biological
  shift -= input.epigeneticAgeDelta * 0.6;
  shift += (input.telomereLengthScale - 5) * 0.5;
  if (input.hasGeneticMutations) shift -= 4.5;

  // 3. Behavioral & Psychological
  shift += (input.socialConnectionLevel - 5) * 1.5;
  shift -= (10 - input.mentalHealthStatus) * 0.6;
  shift -= (input.riskTakingBehavior / 10) * 2.0;

  // 4. Healthcare Utilization
  shift += (input.checkupFrequency > 0 ? 1.0 : -1.0);
  shift += (input.medicationAdherence / 10) * 2.0;
  shift += (input.preventiveCareAccess - 3) * 1.0;

  // 5. Macro & External
  shift += (input.regionalMortalityTrend - 3) * 0.8;
  shift -= (input.climateChangeImpactRisk - 1) * 0.5;
  shift += (input.technologicalAccess - 3) * 0.6;

  // 6. Expanded Dietary Patterns
  const dietShifts: Record<DietaryPattern, number> = {
    'No Preference': 0.0,
    'Mediterranean': 3.0,
    'DASH': 2.5,
    'Vegan': 2.0,
    'Vegetarian': 1.5,
    'Pescatarian': 2.0,
    'Keto': -0.5,
    'Paleo': 1.0,
    'Western': -3.0,
    'Low-carb': 0.5,
    'Flexitarian': 1.5,
    'Carnivore': -2.0,
    'Whole30': 1.0,
    'Other': 0.0
  };
  shift += dietShifts[input.dietaryPattern] || 0;

  if (input.religiousSpiritualPractice) shift += 1.5;

  // Original Lifestyle Core
  shift += (input.exerciseHours / 3) * 1.5; 
  if (input.smoker) shift -= 10.0;
  if (input.alcoholUnits > 14) shift -= (input.alcoholUnits - 14) * 0.2;
  if (input.recreationalDrugUse === 'Regular') shift -= 6.0;

  // Original Medical/Environmental/Socio Core
  if (input.hasChronicDisease) shift -= 5.0;
  const baseline = (BASELINE_LONGEVITY as any)[input.gender] || 78;
  const familyDiff = input.familyLongevity - baseline;
  shift += familyDiff * 0.35; 
  
  shift += (input.airQualityRating - 3) * 0.6;
  shift -= (input.pollutionExposure - 1) * 0.5;
  shift -= (input.stressLevel / 10) * 2.5;

  const educationMap: Record<Education, number> = {
    [Education.HIGH_SCHOOL]: -1.5,
    [Education.BACHELORS]: 0,
    [Education.MASTERS]: 2.0,
    [Education.PHD]: 3.5
  };
  shift += educationMap[input.educationLevel];

  return Math.min(25, Math.max(-35, shift));
};

export const calculateIncomeBreakdown = (input: UserInput): IncomeBreakdown => {
  const monthlyIncome = input.income / 12;
  let taxRate = 0.22;
  if (input.income > 120000) taxRate = 0.30;
  const taxes = monthlyIncome * taxRate;
  const savings = input.monthlyInvestment;
  const essential = input.monthlyExpenses;
  const discretionary = Math.max(0, monthlyIncome - taxes - savings - essential);
  return { essential, discretionary, savings, taxes };
};

export const calculateHealthRisks = (input: UserInput): HealthRiskBreakdown => {
  return {
    cardiovascular: Math.min(100, (input.bloodPressureSys > 140 ? 30 : 5) + (input.smoker ? 40 : 0) + (input.cholesterolLevel > 240 ? 25 : 0)),
    metabolic: Math.min(100, (input.bmi > 30 ? 30 : 5) + (input.bloodSugarLevel > 125 ? 45 : 5) + (input.dietaryPattern === 'Western' ? 20 : 0)),
    psychological: Math.min(100, (10 - input.mentalHealthStatus) * 10 + (10 - input.socialConnectionLevel) * 6),
    environmental: Math.min(100, (6 - input.airQualityRating) * 12 + (input.climateChangeImpactRisk * 12))
  };
};

export const calculateWealth = (input: UserInput): { retirementWealth: number, runwayAge: number, insuranceGap: number } => {
  const yearsToRetire = Math.max(0, input.retirementAgeGoal - input.age);
  const adjustedReturn = 0.03 + (input.riskTolerance / 10) * 0.08;
  const inflationAdjRate = (1 + adjustedReturn) / (1 + INFLATION_RATE) - 1;
  const adjMonthlyRate = inflationAdjRate / 12;

  const n = yearsToRetire * 12;
  const retirementWealth = input.savings * Math.pow(1 + adjMonthlyRate, n) + 
                         input.monthlyInvestment * ((Math.pow(1 + adjMonthlyRate, n) - 1) / adjMonthlyRate);

  const runwayAge = input.retirementAgeGoal + (retirementWealth / (input.monthlyExpenses * 0.90 * 12));
  
  // Summing the insurance breakdown
  const totalInsurance = Object.values(input.insuranceCoverage).reduce((a, b) => a + b, 0);
  const insuranceGap = Math.max(0, (input.income * 12) - totalInsurance);

  return { 
    retirementWealth: Math.round(retirementWealth), 
    runwayAge: Math.round(runwayAge * 10) / 10,
    insuranceGap
  };
};

export const runFullAnalysis = (input: UserInput): AnalysisResults => {
  const shift = calculateLongevityShift(input);
  const baseline = (BASELINE_LONGEVITY as any)[input.gender] || 78;
  const finalLongevity = baseline + shift;
  const wealth = calculateWealth(input);
  
  return {
    estimatedLongevityShift: shift,
    baselineLongevity: finalLongevity,
    financialRunwayAge: wealth.runwayAge,
    wealthAtRetirement: wealth.retirementWealth,
    savingsShortfall: Math.max(0, (finalLongevity - wealth.runwayAge) * input.monthlyExpenses * 12),
    healthRiskScore: Math.max(0, 100 - (shift + 35) * 1.4),
    insuranceGap: wealth.insuranceGap,
    probabilityOfSurvivalToRetirement: Math.max(0.4, 1 - (input.age / 115) + (shift / 110)),
    incomeBreakdown: calculateIncomeBreakdown(input),
    healthRiskBreakdown: calculateHealthRisks(input)
  };
};
