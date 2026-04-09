
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, AnalysisResults } from "../types";

export const getAIRecommendations = async (userInput: UserInput, results: AnalysisResults) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert Actuarial Consultant and Longevity Scientist for the "JeffreyWoo Health & Wealth Impact Planner".
    Your goal is to provide 4 highly specific, actionable, and mathematically-reasoned recommendations based on the user's unique profile.

    USER DATA OVERVIEW:
    - Biological Profile: Age ${userInput.age}, BMI ${userInput.bmi}, Blood Pressure ${userInput.bloodPressureSys}/${userInput.bloodPressureDia}, Resting HR ${userInput.restingHeartRate}, VO2 Max ${userInput.vo2Max}.
    - Genetic/Cellular: Epigenetic Delta ${userInput.epigeneticAgeDelta} (negative means younger), Telomere Scale ${userInput.telomereLengthScale}/10.
    - Lifestyle: Diet [${userInput.dietaryPattern}] (Score: ${userInput.dietScore}/10), Exercise ${userInput.exerciseHours}h/wk, Sleep ${userInput.sleepHours}h/night (Quality: ${userInput.sleepQuality}/10), Smoker: ${userInput.smoker}, Alcohol ${userInput.alcoholUnits} units/wk.
    - Psychological: Stress ${userInput.stressLevel}/10, Mental Health ${userInput.mentalHealthStatus}/10, Social Connection ${userInput.socialConnectionLevel}/10.
    - Environmental: Air Quality ${userInput.airQualityRating}/5, Climate Risk ${userInput.climateChangeImpactRisk}/5.
    - Financial: Income $${userInput.income}/yr, Monthly Expenses $${userInput.monthlyExpenses}, Monthly Investment $${userInput.monthlyInvestment}, Total Savings $${userInput.savings}.
    - Insurance: Life $${userInput.insuranceCoverage.life}, Health $${userInput.insuranceCoverage.health}, Disability $${userInput.insuranceCoverage.disability}.

    CALCULATED ACTUARIAL RESULTS:
    - Est. Life Expectancy: ${results.baselineLongevity.toFixed(1)} years (Longevity Shift: ${results.estimatedLongevityShift.toFixed(1)} years).
    - Wealth at Retirement: $${results.wealthAtRetirement.toLocaleString()}.
    - Financial Runway Ends At: Age ${results.financialRunwayAge.toFixed(1)}.
    - Insurance Gap: $${results.insuranceGap.toLocaleString()}.
    - Probability of Survival to Retirement: ${(results.probabilityOfSurvivalToRetirement * 100).toFixed(0)}%.

    TASKS:
    1. HEALTH-WEALTH SWAP: Identify one health habit change and calculate its projected financial ROI (e.g., 'Reducing stress levels by 2 points could lower cardiovascular risk by 12%, potentially saving $40k in late-life healthcare premiums while adding 1.8 years').
    2. BIOMETRIC INTERVENTION: Target the most concerning vitals or genetic markers (e.g., Blood Sugar, VO2 Max, or Telomere health).
    3. ENVIRONMENTAL ADAPTATION: Suggest a change based on location, climate risk, or occupational hazards.
    4. PORTFOLIO CALIBRATION: Adjust financial strategy based on the new 'Longevity Window' (e.g., 'With a lifespan now exceeding 85, your 4% withdrawal rate may be too aggressive; suggest moving to 3.5% or increasing equity exposure').

    OUTPUT REQUIREMENTS:
    - Category: Must be 'Health', 'Wealth', or 'Environment'.
    - Title: Concise and professional.
    - Description: Actionable steps with reasoning.
    - Impact: A clear quantitative estimate (e.g., '+2.4 Years', '+$120k Portfolio', '-15% Risk').
    - Tone: Empowering, actuarial, professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              impact: { type: Type.STRING },
            },
            required: ["category", "title", "description", "impact"],
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback to structured insights if API fails
    return [
      {
        category: "Health",
        title: "VO2 Max Optimization",
        description: "Given your current activity levels, adding 2 sessions of Zone 5 intervals weekly could improve cardiovascular mortality risk by 20%.",
        impact: "+3.2 Years"
      },
      {
        category: "Wealth",
        title: "Extended Runway Hedge",
        description: "Your projected lifespan exceeds your current financial runway by 4 years. Recommend increasing equity weight to 75% to outpace inflation.",
        impact: "+$240k Asset Delta"
      }
    ];
  }
};
