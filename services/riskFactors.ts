import { 
    UserInput, Gender, DietaryPattern, Education, 
    RiskFactorWeights, RiskMultiplier 
} from '../types';

/**
 * Relative risk multipliers based on academic literature and SOA studies.
 * Each factor modifies baseline mortality: RR > 1 = higher mortality risk.
 */
export const calculateRelativeRisk = (input: UserInput): number => {
    let totalRR = 1.0;
    
    // Biomarkers & Clinical (SOA VBT-based multipliers)
    if (input.bmi < 18.5) totalRR *= 1.15;  // Underweight
    if (input.bmi > 30) totalRR *= 1.20;    // Obese
    if (input.bmi > 35) totalRR *= 1.35;
    
    if (input.bloodPressureSys > 140) totalRR *= 1.25;
    if (input.bloodPressureSys > 160) totalRR *= 1.45;
    if (input.bloodPressureDia > 90) totalRR *= 1.20;
    
    if (input.bloodSugarLevel > 110) totalRR *= 1.18;
    if (input.bloodSugarLevel > 125) totalRR *= 1.35;  // Pre-diabetic/Diabetic
    
    // Fitness & Activity (WHO guidelines)
    if (input.vo2Max < 25) totalRR *= 1.30;
    if (input.vo2Max > 40) totalRR *= 0.85;
    
    const stepsRR = Math.max(0.85, Math.min(1.25, 1.25 - (input.dailySteps / 10000) * 0.20));
    totalRR *= stepsRR;
    
    // Sleep (U-shaped curve)
    if (input.sleepQuality < 4) totalRR *= 1.22;
    if (input.sleepQuality > 9) totalRR *= 1.08;
    
    // Behavioral (SOA VBT standard)
    if (input.smoker) totalRR *= 2.20;  // Heavy smoking ~2-3x mortality
    if (input.smoker && input.alcoholUnits > 14) totalRR *= 1.35;
    
    if (input.alcoholUnits > 21) totalRR *= 1.30;
    if (input.alcoholUnits === 0) totalRR *= 0.95;  // Moderate drinker effect
    
    if (input.recreationalDrugUse === 'Regular') totalRR *= 1.80;
    if (input.recreationalDrugUse === 'Occasional') totalRR *= 1.25;
    
    // Dietary patterns (based on WHO GBD study)
    const dietRR: Record<DietaryPattern, number> = {
        'No Preference': 1.00,
        'Mediterranean': 0.82,
        'DASH': 0.85,
        'Vegan': 0.88,
        'Vegetarian': 0.89,
        'Pescatarian': 0.86,
        'Keto': 0.98,
        'Paleo': 0.95,
        'Western': 1.42,
        'Low-carb': 0.97,
        'Flexitarian': 0.92,
        'Carnivore': 1.18,
        'Whole30': 0.96,
        'Other': 1.00,
    };
    totalRR *= dietRR[input.dietaryPattern] || 1.00;
    
    // Chronic conditions (SOA VBT)
    if (input.hasChronicDisease) {
        totalRR *= 1.50;
        if (input.hasChronicDisease && input.age < 50) totalRR *= 1.20;
    }
    
    // Genetic (WHO/Based on familial longevity studies)
    if (input.hasGeneticMutations) totalRR *= 1.35;
    const familyRR = Math.max(0.70, Math.min(1.30, 1.30 - (input.familyLongevity - 78) * 0.012));
    totalRR *= familyRR;
    
    // Psychological & Social (Whitehall II study data)
    const mentalRR = Math.max(0.88, Math.min(1.35, 1.35 - (input.mentalHealthStatus / 10) * 0.35));
    totalRR *= mentalRR;
    
    const socialRR = Math.max(0.85, Math.min(1.28, 1.28 - (input.socialConnectionLevel / 10) * 0.35));
    totalRR *= socialRR;
    
    const stressRR = Math.max(1.00, Math.min(1.45, 1 + (input.stressLevel / 100) * 0.45));
    totalRR *= stressRR;
    
    // Socioeconomic (Education as proxy, from WHO)
    const educationRR: Record<Education, number> = {
        [Education.HIGH_SCHOOL]: 1.18,
        [Education.BACHELORS]: 1.00,
        [Education.MASTERS]: 0.92,
        [Education.PHD]: 0.88
    };
    totalRR *= educationRR[input.educationLevel];
    
    // Environmental (WHO air quality guidelines)
    const airRR = Math.max(1.00, Math.min(1.25, 1 + (6 - input.airQualityRating) * 0.05));
    totalRR *= airRR;
    
    const pollRR = Math.max(1.00, Math.min(1.20, 1 + (input.pollutionExposure - 1) * 0.06));
    totalRR *= pollRR;
    
    // Epigenetic / Telomere (research-based adjustments)
    const epiRR = Math.max(0.85, Math.min(1.30, 1 + (input.epigeneticAgeDelta / 10) * 0.12));
    totalRR *= epiRR;
    
    const teloRR = Math.max(0.88, Math.min(1.15, 1.15 - (input.telomereLengthScale - 5) * 0.06));
    totalRR *= teloRR;
    
    // Cap for plausibility
    return Math.min(3.5, Math.max(0.45, totalRR));
};