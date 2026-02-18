
import React, { useState, useEffect } from 'react';
import { UserInput, Gender, Ethnicity, Education, AnalysisResults, Recommendation } from './types';
import { runFullAnalysis } from './services/calculator';
import { getAIRecommendations } from './services/geminiService';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import MethodologyGuide from './components/MethodologyGuide';
import ScenarioPlanner from './components/ScenarioPlanner';
import ImprovementTips from './components/ImprovementTips';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    age: 38,
    gender: Gender.FEMALE,
    ethnicity: Ethnicity.ASIAN,
    maritalStatus: 'Married',
    location: 'North America (USA/Canada)',
    
    // Biometric & Physiological
    bmi: 22.5,
    waistToHipRatio: 0.82,
    bloodPressureSys: 118,
    bloodPressureDia: 78,
    cholesterolLevel: 185,
    bloodSugarLevel: 92,
    restingHeartRate: 62,
    vo2Max: 42,
    dailySteps: 8500,
    heartRateVariability: 55,

    // Genetic & Biological
    epigeneticAgeDelta: -1.5,
    telomereLengthScale: 7,
    hasGeneticMutations: false,

    // Behavioral & Psychological
    mentalHealthStatus: 8,
    cognitiveFunctionScore: 92,
    socialConnectionLevel: 8,
    riskTakingBehavior: 3,

    // Healthcare Utilization
    checkupFrequency: 1,
    vaccinationHistoryScale: 9,
    medicationAdherence: 9,
    preventiveCareAccess: 4,

    // Macro & External
    regionalMortalityTrend: 4,
    climateChangeImpactRisk: 2,
    technologicalAccess: 4,

    // Cultural & Lifestyle
    dietaryPattern: 'Mediterranean',
    dietScore: 9,
    religiousSpiritualPractice: true,

    // Lifestyle Core
    exerciseHours: 4,
    sleepHours: 7.5,
    sleepQuality: 8,
    smoker: false,
    alcoholUnits: 3,
    recreationalDrugUse: 'None',

    // Medical / Family / Socio / Env Core
    hasChronicDisease: false,
    geneticPredisposition: 2,
    familyLongevity: 84,
    airQualityRating: 4,
    pollutionExposure: 2,
    healthcareAccess: 5,
    occupationalHazard: 1,
    educationLevel: Education.BACHELORS,
    employmentType: 'Full-time',
    stressLevel: 4,

    // Financial
    income: 105000,
    savings: 82000,
    monthlyInvestment: 1500,
    monthlyExpenses: 4200,
    retirementAgeGoal: 65,
    riskTolerance: 6,
    insuranceCoverage: {
      life: 500000,
      health: 50000,
      disability: 0,
      criticalIllness: 0,
      longTermCare: 0
    }
  });

  const [results, setResults] = useState<AnalysisResults>(runFullAnalysis(userInput));
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    setResults(runFullAnalysis(userInput));
  }, [userInput]);

  const handleRefreshAI = async () => {
    setLoadingAI(true);
    const recs = await getAIRecommendations(userInput, results);
    setRecommendations(recs);
    setLoadingAI(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-black text-xl">JW</div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-none">JeffreyWoo Health & Wealth</h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold text-nowrap">Integrated Impact Planner</p>
            </div>
          </div>
          <button 
            onClick={handleRefreshAI}
            disabled={loadingAI}
            className="group px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {loadingAI ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>✨ <span className="hidden sm:inline">AI Deep Insights</span></>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <InputForm data={userInput} onChange={setUserInput} />
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-lg">🛡️</div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase mb-1">Professional Actuarial Basis</h5>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Proprietary integration of life-table mortality risk models and Monte Carlo wealth simulations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <Dashboard results={results} input={userInput} />

            <ImprovementTips results={results} input={userInput} />

            <ScenarioPlanner currentInput={userInput} currentResults={results} />

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Personalized Strategy</h2>
                <div className="h-px bg-slate-200 flex-grow mx-4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-widest ${
                          rec.category === 'Health' ? 'bg-emerald-50 text-emerald-600' : 
                          rec.category === 'Environment' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {rec.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">{rec.impact}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2 leading-snug">{rec.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">{rec.description}</p>
                    </div>
                  ))
                ) : !loadingAI && (
                  <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-slate-400 text-sm font-medium">Click "AI Deep Insights" to generate targeted interventions.</p>
                  </div>
                )}

                {loadingAI && Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse h-40">
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-slate-50 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-50 rounded w-1/5"></div>
                    </div>
                    <div className="h-6 bg-slate-50 rounded w-3/4 mb-3"></div>
                    <div className="h-12 bg-slate-50 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </section>

            <MethodologyGuide />
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">JW</div>
            <p className="text-xs font-bold text-slate-400">© 2025 JeffreyWoo Analytics. All models probabilistic.</p>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-white transition-colors">GDPR/PDPO</a>
            <a href="#" className="hover:text-white transition-colors">Actuarial Basis</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
