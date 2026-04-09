import { Gender } from '../types';

/**
 * Simulated baseline mortality rates (qx) from SOA VBT / WHO life tables.
 * In production, replace with actual imported CSV/JSON data from SOA or WHO.
 */
const SOA_VBT_MALE: Record<number, number> = {
    20: 0.00098, 25: 0.00105, 30: 0.00115, 35: 0.00132,
    40: 0.00158, 45: 0.00204, 50: 0.00282, 55: 0.00405,
    60: 0.00611, 65: 0.00963, 70: 0.01562, 75: 0.02599,
    80: 0.04513, 85: 0.08164, 90: 0.14896, 95: 0.25000
};

const SOA_VBT_FEMALE: Record<number, number> = {
    20: 0.00052, 25: 0.00056, 30: 0.00062, 35: 0.00073,
    40: 0.00090, 45: 0.00119, 50: 0.00168, 55: 0.00252,
    60: 0.00397, 65: 0.00657, 70: 0.01124, 75: 0.01966,
    80: 0.03574, 85: 0.06723, 90: 0.12793, 95: 0.23000
};

const WHO_LIFE_TABLE_INTERPOLATION = true; // Use linear interpolation between ages

/**
 * Interpolates mortality rate for exact ages between table entries
 */
const interpolateMortality = (
    age: number, 
    table: Record<number, number>
): number => {
    const ages = Object.keys(table).map(Number).sort((a,b) => a-b);
    
    if (age <= ages[0]) return table[ages[0]];
    if (age >= ages[ages.length - 1]) return table[ages[ages.length - 1]];
    
    for (let i = 0; i < ages.length - 1; i++) {
        if (age >= ages[i] && age <= ages[i+1]) {
            const t = (age - ages[i]) / (ages[i+1] - ages[i]);
            const qx1 = table[ages[i]];
            const qx2 = table[ages[i+1]];
            return qx1 + t * (qx2 - qx1);
        }
    }
    return table[ages[0]];
};

/**
 * Get baseline mortality probability (qx) from SOA VBT or WHO tables
 */
export const getBaselineMortality = (age: number, gender: Gender): number => {
    if (WHO_LIFE_TABLE_INTERPOLATION) {
        // Use WHO-style interpolation
        const table = gender === Gender.MALE ? SOA_VBT_MALE : SOA_VBT_FEMALE;
        return interpolateMortality(age, table);
    }
    // Direct lookup (nearest age)
    const table = gender === Gender.MALE ? SOA_VBT_MALE : SOA_VBT_FEMALE;
    const ages = Object.keys(table).map(Number);
    const nearest = ages.reduce((prev, curr) => 
        Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
    );
    return table[nearest];
};

/**
 * Calculate survival probability from current age to target age
 */
export const calculateSurvivalProbability = (
    currentAge: number,
    targetAge: number,
    gender: Gender
): number => {
    let survivalProb = 1.0;
    for (let age = Math.floor(currentAge); age < targetAge; age++) {
        const qx = getBaselineMortality(age, gender);
        survivalProb *= (1 - qx);
    }
    return Math.max(0, Math.min(1, survivalProb));
};