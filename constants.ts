// ============================================================
// LONGEVITY CONSTANTS (Mainland China 2025 Data)
// ============================================================

/**
 * Period life expectancy at birth (2024-2025)
 * Sources:
 * - National Health Commission of China (NHC) 2025: National average 79.25 years
 * - NHC 2023 report: 78.6 years (improved from 77.93 in 2021)
 * - National Bureau of Statistics of China (2024): Female 81.5, Male 77.5
 * 
 * Life expectancy by region (2025 estimates):
 * - Shanghai: 84.5 years (highest)
 * - Beijing: 83.8 years
 * - Guangdong: 81.5 years
 * - National average: 79.25 years
 */
export const BASELINE_LONGEVITY = {
    Male: 77.5,        // NBS 2024 data for male population
    Female: 81.5,      // NBS 2024 data for female population
    'Non-binary': 79.5  // Average of male/female
};

/**
 * Age-specific remaining life expectancy for Mainland China population
 * Based on China Life Insurance Mortality Table CL2023 and NBS life tables
 * Values represent expected remaining years at exact age
 */
export const REMAINING_LE_BY_AGE: Record<string, Record<number, number>> = {
    Male: {
        30: 48.2,      // Life expectancy to 78.2
        40: 38.8,      // Life expectancy to 78.8
        50: 29.6,      // Life expectancy to 79.6
        60: 20.5,      // Life expectancy to 80.5
        65: 16.5,      // Life expectancy to 81.5
        70: 12.8,      // Life expectancy to 82.8
        75: 9.4,       // Life expectancy to 84.4
        80: 6.5,       // Life expectancy to 86.5
        85: 4.5,       // Life expectancy to 89.5
        90: 3.1        // Life expectancy to 93.1
    },
    Female: {
        30: 52.1,      // Life expectancy to 82.1
        40: 42.5,      // Life expectancy to 82.5
        50: 33.0,      // Life expectancy to 83.0
        60: 23.8,      // Life expectancy to 83.8
        65: 19.5,      // Life expectancy to 84.5
        70: 15.5,      // Life expectancy to 85.5
        75: 11.9,      // Life expectancy to 86.9
        80: 8.7,       // Life expectancy to 88.7
        85: 6.1,       // Life expectancy to 91.1
        90: 4.2        // Life expectancy to 94.2
    }
};

/**
 * Baseline 10-year mortality probability by age (from China Life Table CL2023)
 * Used for health risk scoring and insurance calculations
 * Values represent probability of death within next 10 years
 */
export const BASELINE_10YR_MORTALITY: Record<string, Record<number, number>> = {
    Male: {
        30: 0.018,     // 1.8% chance of dying within 10 years
        40: 0.032,     // 3.2%
        50: 0.065,     // 6.5%
        60: 0.125,     // 12.5%
        65: 0.168,     // 16.8%
        70: 0.235,     // 23.5%
        75: 0.325,     // 32.5%
        80: 0.445      // 44.5%
    },
    Female: {
        30: 0.010,     // 1.0%
        40: 0.018,     // 1.8%
        50: 0.038,     // 3.8%
        60: 0.078,     // 7.8%
        65: 0.108,     // 10.8%
        70: 0.158,     // 15.8%
        75: 0.225,     // 22.5%
        80: 0.325      // 32.5%
    }
};

// ============================================================
// FINANCIAL CONSTANTS (Mainland China Market)
// ============================================================

/**
 * Long-term expected annual return for Mainland China markets
 * Sources:
 * - Shanghai Composite Index (1990-2025): ~10.2% annualized nominal return
 * - CSI 300 Index (2005-2025): ~8.5% annualized nominal return
 * - Mixed-asset fund average (10-year): 6-8% 
 * 
 * Forward-looking conservative estimates (acknowledging slower growth):
 * - Historical average: ~8-10% nominal
 * - Conservative planning: 5-6% for balanced portfolio
 * - Considering demographic shifts and economic transition
 */
export const ANNUAL_RETURN_RATE = 0.055;  // 5.5% for balanced China market portfolio

/**
 * Expected long-term inflation rate for Mainland China
 * Sources:
 * - National Bureau of Statistics historical data (2000-2024): ~2.3% average CPI
 * - 2025 government target: ~2% 
 * - Recent 5-year average (2020-2024): ~1.8% (subdue post-pandemic)
 * 
 * Using 2.0% as long-term expectation (government target)
 */
export const INFLATION_RATE = 0.020;  // 2.0%

/**
 * Real return (nominal return - inflation)
 * Revised: 5.5% - 2.0% = 3.5% real return
 * Higher than developed markets due to China's continued growth potential
 */
export const REAL_RETURN_RATE = ANNUAL_RETURN_RATE - INFLATION_RATE;  // 0.035

/**
 * Safe withdrawal rate (SWR) for retirement in China
 * Factors affecting SWR:
 * - Retirement duration: 25-30 years (shorter than Hong Kong due to later retirement)
 * - Social security system coverage (urban vs rural)
 * - Real estate wealth component
 * - Healthcare costs inflation (higher than general CPI)
 * 
 * Using 4.0% as baseline (same as international standard)
 * Note: Many Chinese retirees rely more on rental income than liquid assets
 */
export const SAFE_WITHDRAWAL_RATE = 0.04;  // 4%

/**
 * Expected return by risk tolerance (for calculateWealth function)
 * Maps user risk tolerance (0-10) to expected nominal return
 * Based on China market historical volatility patterns
 */
export const EXPECTED_RETURN_BY_RISK: Record<number, number> = {
    0: 0.020,   // Very conservative: bank deposits (1.5-2.5%)
    2: 0.030,   // Conservative: wealth management products (2.5-3.5%)
    4: 0.040,   // Moderate-conservative: bond-heavy mix
    5: 0.045,   // Moderate: balanced 50/50
    6: 0.050,   // Moderate-aggressive: equity-heavy mix
    8: 0.060,   // Aggressive: mostly equities
    10: 0.070   // Very aggressive: full equity exposure
};

// ============================================================
// CHINA-SPECIFIC HEALTH & LIFESTYLE CONSTANTS
// ============================================================

/**
 * Dietary pattern modifiers specific to Chinese population
 * Based on China Health and Nutrition Survey (CHNS) and related studies
 */
export const DIETARY_RISK_MODIFIERS: Record<string, number> = {
    'Traditional Chinese': 1.05,    // High salt, pickled foods, moderate fish
    'Southern Chinese': 0.92,       // More vegetables, rice, less meat
    'Northern Chinese': 1.08,       // Higher meat, wheat-based, saltier
    'Mediterranean': 0.82,          // Still beneficial for Chinese population
    'Vegetarian': 0.89,
    'Western': 1.42                 // Highest risk in Chinese context
};

/**
 * Pollution exposure adjustment (China-specific)
 * Air pollution is a significant risk factor in Chinese urban areas
 * Based on WHO air quality guidelines and Chinese environmental data
 */
export const POLLUTION_RISK_MULTIPLIER = (pollutionLevel: number): number => {
    // pollutionLevel 1-10, where 10 is most polluted
    // Based on AQI (Air Quality Index) conversion
    if (pollutionLevel <= 3) return 1.00;   // AQI < 50 (Good)
    if (pollutionLevel <= 5) return 1.05;   // AQI 50-100 (Moderate)
    if (pollutionLevel <= 7) return 1.12;   // AQI 100-150 (Unhealthy for sensitive)
    if (pollutionLevel <= 9) return 1.25;   // AQI 150-200 (Unhealthy)
    return 1.40;                             // AQI > 200 (Very unhealthy)
};

// ============================================================
// CHINA SOCIAL SECURITY & RETIREMENT CONSTANTS
// ============================================================

/**
 * Statutory retirement ages in Mainland China (2025)
 * Note: Gradual retirement age extension announced in 2024
 * New policy: Male 63, Female 55 (blue-collar) or 58 (white-collar) by 2035
 */
export const STATUTORY_RETIREMENT_AGE = {
    Male: 63,                    // Extended from 60 starting 2025
    FemaleBlueCollar: 55,       // Extended from 50
    FemaleWhiteCollar: 58,      // Extended from 55
    Default: 60                  // Default fallback
};

/**
 * Urban Employee Basic Pension replacement rate (2025)
 * Average pension as percentage of pre-retirement income
 * Urban ~45-50%, Rural ~15-20%
 */
export const PENSION_REPLACEMENT_RATE = {
    Urban: 0.45,
    Rural: 0.18,
    Average: 0.35
};