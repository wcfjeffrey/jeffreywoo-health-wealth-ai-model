// File: analysisEngine.ts (refactored)
import { UserInput, AnalysisResults, Gender, IncomeBreakdown, HealthRiskBreakdown } from '../types';
import { BASELINE_LONGEVITY, ANNUAL_RETURN_RATE, INFLATION_RATE } from '../constants';
import { getBaselineMortality, calculateSurvivalProbability } from './lifeTable';
import { calculateRelativeRisk } from './riskFactors';

/**
 * Calculate remaining life expectancy using life table + relative risk
 */
export const calculateLifeExpectancy = (input: UserInput): number => {
    const currentAge = input.age;
    const gender = input.gender;
    const relativeRisk = calculateRelativeRisk(input);
    
    // Start from baseline life expectancy from WHO/SOA
    const baselineLE = (BASELINE_LONGEVITY as any)[gender] || 78;
    
    // Apply relative risk to adjust hazard rate (Gompertz approximation)
    // Adjusted LE = Baseline LE * (1 - (RR - 1) * 0.5) for moderate adjustments
    // More precise: Convert RR to Δ mortality, then recalc remaining years
    let adjustedLE = baselineLE;
    
    if (relativeRisk > 1.0) {
        // Higher risk reduces life expectancy non-linearly
        const reductionFactor = 1 - (relativeRisk - 1) * 0.4;
        adjustedLE = baselineLE * Math.max(0.4, reductionFactor);
    } else if (relativeRisk < 1.0) {
        // Lower risk increases life expectancy
        const increaseFactor = 1 + (1 - relativeRisk) * 0.6;
        adjustedLE = baselineLE * Math.min(1.25, increaseFactor);
    }
    
    // Age adjustment: older individuals have less potential gain
    const ageFactor = Math.max(0.3, 1 - (currentAge - 20) / 100);
    adjustedLE = baselineLE + (adjustedLE - baselineLE) * ageFactor;
    
    return Math.min(115, Math.max(currentAge + 5, adjustedLE));
};

/**
 * Calculate survival probability to retirement using life table
 */
export const calculateSurvivalToRetirement = (input: UserInput): number => {
    const currentAge = input.age;
    const retirementAge = input.retirementAgeGoal;
    const gender = input.gender;
    const relativeRisk = calculateRelativeRisk(input);
    
    // Get baseline survival probability from life table
    let baselineSurvival = calculateSurvivalProbability(currentAge, retirementAge, gender);
    
    // Apply relative risk as hazard multiplier
    // Convert survival probability: S_adj(t) = S_baseline(t)^RR
    const adjustedSurvival = Math.pow(baselineSurvival, relativeRisk);
    
    return Math.min(0.99, Math.max(0.05, adjustedSurvival));
};

/**
 * Calculate remaining health risks (probabilistic model)
 */
export const calculateHealthRisks = (input: UserInput): HealthRiskBreakdown => {
    const relativeRisk = calculateRelativeRisk(input);
    
    // Convert relative risk to 10-year probability estimates
    const baseline10yrMortality = 0.08; // ~8% baseline 10-year mortality for 60yo
    
    return {
        cardiovascular: Math.min(95, Math.round(relativeRisk * 35 + (input.smoker ? 25 : 0))),
        metabolic: Math.min(95, Math.round(relativeRisk * 30 + (input.bmi > 30 ? 20 : 0))),
        psychological: Math.min(95, Math.round((10 - input.mentalHealthStatus) * 8 + (10 - input.socialConnectionLevel) * 5)),
        environmental: Math.min(95, Math.round((6 - input.airQualityRating) * 10 + input.pollutionExposure * 8))
    };
};

/**
 * Financial analysis (unchanged from original)
 */
export const calculateWealth = (input: UserInput): { retirementWealth: number, runwayAge: number, insuranceGap: number } => {
    const yearsToRetire = Math.max(0, input.retirementAgeGoal - input.age);
    const adjustedReturn = 0.03 + (input.riskTolerance / 10) * 0.08;
    const inflationAdjRate = (1 + adjustedReturn) / (1 + INFLATION_RATE) - 1;
    const adjMonthlyRate = inflationAdjRate / 12;
    
    const n = yearsToRetire * 12;
    const retirementWealth = input.savings * Math.pow(1 + adjMonthlyRate, n) + 
                         input.monthlyInvestment * ((Math.pow(1 + adjMonthlyRate, n) - 1) / adjMonthlyRate);
    
    const runwayAge = input.retirementAgeGoal + (retirementWealth / (input.monthlyExpenses * 0.90 * 12));
    
    const totalInsurance = Object.values(input.insuranceCoverage).reduce((a, b) => a + b, 0);
    const insuranceGap = Math.max(0, (input.income * 12) - totalInsurance);
    
    return { 
        retirementWealth: Math.round(retirementWealth), 
        runwayAge: Math.round(runwayAge * 10) / 10,
        insuranceGap
    };
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

/**
 * Main analysis function - produces final results
 */
export const runFullAnalysis = (input: UserInput): AnalysisResults => {
    const lifeExpectancy = calculateLifeExpectancy(input);
    const survivalToRetirement = calculateSurvivalToRetirement(input);
    const wealth = calculateWealth(input);
    const relativeRisk = calculateRelativeRisk(input);
    
    // Convert to a "shift" value for compatibility with existing UI
    const baselineLE = (BASELINE_LONGEVITY as any)[input.gender] || 78;
    const longevityShift = lifeExpectancy - baselineLE;
    
    // Health risk score (0-100, lower = better)
    const healthRiskScore = Math.max(0, Math.min(100, 100 - (relativeRisk - 0.5) * 40));
    
    return {
        estimatedLongevityShift: longevityShift,
        baselineLongevity: Math.round(lifeExpectancy * 10) / 10,
        financialRunwayAge: wealth.runwayAge,
        wealthAtRetirement: wealth.retirementWealth,
        savingsShortfall: Math.max(0, (lifeExpectancy - wealth.runwayAge) * input.monthlyExpenses * 12),
        healthRiskScore: Math.round(healthRiskScore),
        insuranceGap: wealth.insuranceGap,
        probabilityOfSurvivalToRetirement: survivalToRetirement,
        incomeBreakdown: calculateIncomeBreakdown(input),
        healthRiskBreakdown: calculateHealthRisks(input)
    };
};