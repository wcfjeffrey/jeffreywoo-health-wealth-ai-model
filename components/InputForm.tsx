
import React, { useState } from 'react';
import { UserInput, Gender, Ethnicity, Education, EmploymentType, DietaryPattern } from '../types';

interface Props {
  data: UserInput;
  onChange: (data: UserInput) => void;
}

const locations = [
  "North America (USA/Canada)",
  "Western Europe",
  "Eastern Europe",
  "East Asia (China/Japan/Korea)",
  "Southeast Asia",
  "South Asia (India/Pakistan)",
  "Latin America & Caribbean",
  "Middle East",
  "Africa",
  "Oceania (Australia/NZ)"
];

const dietOptions: DietaryPattern[] = [
  'Mediterranean', 'DASH', 'Vegan', 'Vegetarian', 'Pescatarian', 
  'Keto', 'Paleo', 'Western', 'Low-carb', 'Flexitarian', 
  'Carnivore', 'Whole30', 'Other'
];

const descriptions: Record<string, string> = {
  // Identity & Demographics
  age: "Health: Primary factor in biological aging and disease risk. Wealth: Determines the remaining years for compound interest and retirement planning duration.",
  gender: "Health: Influences average life expectancy based on biological trends. Wealth: Affects long-term insurance premiums and household financial responsibilities.",
  ethnicity: "Health: Linked to specific genetic and epidemiological health risks. Wealth: Used for demographic financial modeling and risk assessment.",
  maritalStatus: "Health: Strong social support from a partner is a proven longevity multiplier. Wealth: Influences tax status, joint savings, and household cost-sharing.",
  location: "Health: Impacts health via regional air quality and local mortality rates. Wealth: Affects cost of living and local healthcare expenses.",
  educationLevel: "Health: Higher education is correlated with better health literacy and preventative care. Wealth: A direct predictor of lifetime earning potential.",
  employmentType: "Health: Affects stress levels and physical strain on the body. Wealth: Determines income stability and access to employer-provided benefits.",

  // Lifestyle & Habits
  dietaryPattern: "Health: Core driver of metabolic health and systemic inflammation. Wealth: Impacts future medical costs and long-term vitality.",
  dietScore: "Health: Overall nutritional quality directly impacts lifespan. Wealth: Healthy eating reduces the risk of expensive chronic disease costs.",
  exerciseHours: "Health: Improves cardiovascular resilience and mental wellbeing. Wealth: Enhances productivity and reduces long-term medical liabilities.",
  sleepHours: "Health: Critical for cognitive function, repair, and physical recovery. Wealth: Good sleep is tied to sharper decision-making and higher earnings.",
  sleepQuality: "Health: Impacts heart health and immune system response. Wealth: Influences workplace performance and mental clarity.",
  alcoholUnits: "Health: Chronic consumption reduces organ health and longevity. Wealth: Represents discretionary spend and potential future healthcare costs.",
  recreationalDrugUse: "Health: High risk for metabolic and psychological health issues. Wealth: Can lead to significant financial, career, and legal liabilities.",
  smoker: "Health: Single biggest lifestyle risk to longevity and heart health. Wealth: Significantly increases insurance premiums and lifetime healthcare costs.",
  religiousSpiritualPractice: "Health: Reduces stress and provides community support. Wealth: Often linked to philanthropic stability and social safety nets.",

  // Biometrics & Vitals
  bmi: "Health: Indicator of metabolic risk and chronic disease vulnerability. Wealth: High BMI often leads to higher medical costs and insurance premiums.",
  waistToHipRatio: "Health: Superior predictor of visceral fat and cardiovascular risk. Wealth: Reflects future health maintenance needs and costs.",
  bloodPressure: "Health: High pressure is a silent risk factor for heart issues. Wealth: Impacts the need for long-term chronic care and medication funding.",
  cholesterolLevel: "Health: High LDL impacts heart longevity and artery health. Wealth: Managing levels early prevents expensive emergency care risks.",
  bloodSugarLevel: "Health: Primary marker for diabetes and metabolic age. Wealth: Chronic sugar management can be a significant lifetime financial burden.",
  restingHeartRate: "Health: Measure of cardiovascular efficiency and fitness. Wealth: Lower rates correlate with lower mortality risk and better insurance terms.",
  vo2Max: "Health: One of the most powerful predictors of long-term health. Wealth: High fitness extends your active and productive working years.",
  heartRateVariability: "Health: Shows nervous system resilience and stress recovery. Wealth: High HRV leads to better stress management and career longevity.",
  dailySteps: "Health: Fundamental activity level for metabolic and heart health. Wealth: Reduces the risk of future expensive healthcare utilization.",

  // History & Genetics
  geneticPredisposition: "Health: Biological risk baseline for inherited conditions. Wealth: Higher health risks mean a greater need for savings and insurance planning.",
  familyLongevity: "Health: Strong indicator of inherited biological aging potential. Wealth: Helps estimate the length of the retirement funding window.",
  epigeneticAgeDelta: "Health: Measures if you are aging faster or slower than your calendar age. Wealth: Validates the efficacy of current health spending.",
  telomereLengthScale: "Health: Biological marker of cellular youth and replication capacity. Wealth: Scientific confirmation of your long-term health capital.",
  mentalHealthStatus: "Health: Crucial for overall quality of life and resilience. Wealth: Directly impacts earning consistency and effective risk management.",
  cognitiveFunctionScore: "Health: Predicts late-life independence and brain health. Wealth: Ensures long-term control over financial assets and estate.",
  hasChronicDisease: "Health: Requires active management to avoid complications. Wealth: Mandates specific savings for medical treatments and care.",
  hasGeneticMutations: "Health: High-risk variants like BRCA increase vulnerability. Wealth: Influences early-stage insurance and medical trust planning.",

  // Environmental & Context
  airQualityRating: "Health: Poor air quality leads to respiratory and heart risks. Wealth: May require higher spending on filtration or relocation costs.",
  pollutionExposure: "Health: Cumulative toxic load impacts organ function and aging. Wealth: Impacts property value and long-term healthcare costs.",
  healthcareAccess: "Health: Determines speed and quality of medical interventions. Wealth: Proximity reduces time-loss and travel costs for care.",
  occupationalHazard: "Health: Daily exposure to danger, toxins, or physical strain. Wealth: Often yields higher pay but at the cost of potential health capital.",
  stressLevel: "Health: High cortisol leads to chronic systemic and heart issues. Wealth: Correlated with burnout, reduced productivity, and income loss.",
  socialConnectionLevel: "Health: Loneliness is as toxic to health as smoking. Wealth: Social networks often provide career opportunities and safety nets.",
  medicationAdherence: "Health: Vital for controlling known health issues effectively. Wealth: Prevents expensive complications and avoidable hospitalizations.",
  riskTakingBehavior: "Health: Propensity for accidents or extreme events. Wealth: Increases the risk of sudden asset loss or liability claims.",
  climateChangeImpactRisk: "Health: Exposure to extreme heat, stress, or disasters. Wealth: Affects insurance availability and real estate security.",
  checkupFrequency: "Health: Essential for early detection of potential issues. Wealth: Preventive care is significantly cheaper than emergency intervention.",

  // Financial Data
  income: "Wealth: The fuel for savings, lifestyle, and healthcare access. Health: Provides access to premium nutrition and better medical care.",
  savings: "Wealth: Your current financial safety net for long-term growth. Health: Provides security to manage health crises without ruin.",
  monthlyInvestment: "Wealth: Drives the growth of your future financial runway. Health: Funds future longevity and preventative treatments.",
  retirementAgeGoal: "Wealth: Defines the end of the accumulation phase. Health: Impacts physical and mental wear-and-tear expectations.",
  monthlyExpenses: "Wealth: The burn rate of your capital portfolio. Health: Dictates the quality of your current environment and nutrition.",
  riskTolerance: "Wealth: Your ability to seek growth in volatile markets. Health: High stress from market swings can negatively impact heart health.",
  
  // Insurance Breakdown Descriptions
  insuranceLife: "Wealth: Provides a death benefit to dependents, ensuring their financial stability in your absence. Health: Reduces stress regarding family security.",
  insuranceHealth: "Wealth: Protects against the astronomical costs of private medical treatments. Health: Ensures access to the highest tier of medical specialists.",
  insuranceDisability: "Wealth: Replaces lost income if you are unable to work due to illness or injury. Health: Allows focus on recovery without financial pressure.",
  insuranceCritical: "Wealth: Provides a lump sum upon diagnosis of specific illnesses like cancer or heart attack. Health: Funds advanced non-covered treatments.",
  insuranceLTC: "Wealth: Protects your life savings from the high costs of nursing homes or home-care in old age. Health: Ensures dignity and quality care in late life."
};

const InputForm: React.FC<Props> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'id' | 'habits' | 'vitals' | 'history' | 'env' | 'wealth'>('id');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'number') val = parseFloat(value) || 0;
    if (type === 'checkbox') val = (e.target as HTMLInputElement).checked;
    
    // Handle nested insurance updates
    if (name.startsWith('insurance_')) {
      const field = name.split('_')[1];
      onChange({
        ...data,
        insuranceCoverage: {
          ...data.insuranceCoverage,
          [field]: val
        }
      });
      return;
    }

    onChange({ ...data, [name]: val });
  };

  const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-wider border-b-2 transition-all ${
        activeTab === id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      <span className="block mb-1 text-sm">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex bg-slate-50/50 flex-wrap">
        <TabButton id="id" label="Identity" icon="🆔" />
        <TabButton id="habits" label="Habits" icon="🏃" />
        <TabButton id="vitals" label="Vitals" icon="🫀" />
        <TabButton id="history" label="History" icon="📋" />
        <TabButton id="env" label="Context" icon="🌍" />
        <TabButton id="wealth" label="Wealth" icon="💵" />
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
        {activeTab === 'id' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Demographics & Socio-Economic</h3>
            <div className="grid grid-cols-2 gap-4">
              <div title={descriptions.age}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Age</label>
                <input type="number" name="age" value={data.age} onChange={handleChange} className="w-full p-2 border rounded-lg hover:border-indigo-300 transition-colors" />
              </div>
              <div title={descriptions.gender}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
                <select name="gender" value={data.gender} onChange={handleChange} className="w-full p-2 border rounded-lg hover:border-indigo-300 transition-colors">
                  {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div title={descriptions.ethnicity}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ethnicity</label>
                <select name="ethnicity" value={data.ethnicity} onChange={handleChange} className="w-full p-2 border rounded-lg hover:border-indigo-300 transition-colors">
                  {Object.values(Ethnicity).map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div title={descriptions.maritalStatus}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Marital Status</label>
                <select name="maritalStatus" value={data.maritalStatus} onChange={handleChange} className="w-full p-2 border rounded-lg hover:border-indigo-300 transition-colors">
                  <option value="Single">Single</option><option value="Married">Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option>
                </select>
              </div>
              <div className="col-span-2" title={descriptions.location}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Location</label>
                <select name="location" value={data.location} onChange={handleChange} className="w-full p-2 border rounded-lg hover:border-indigo-300 transition-colors">
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <div title={descriptions.educationLevel}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Education</label>
                <select name="educationLevel" value={data.educationLevel} onChange={handleChange} className="w-full p-2 border rounded-lg hover:border-indigo-300 transition-colors">
                  {Object.values(Education).map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div title={descriptions.employmentType}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Employment</label>
                <select name="employmentType" value={data.employmentType} onChange={handleChange} className="w-full p-2 border rounded-lg hover:border-indigo-300 transition-colors">
                  <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Self-employed">Self-employed</option><option value="Unemployed">Unemployed</option><option value="Retired">Retired</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'habits' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifestyle & Habits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2" title={descriptions.dietaryPattern}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dietary Pattern</label>
                <select name="dietaryPattern" value={data.dietaryPattern} onChange={handleChange} className="w-full p-2 border rounded-lg">
                  {dietOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div title={descriptions.dietScore}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Diet Quality (1-10)</label>
                <input type="number" min="1" max="10" name="dietScore" value={data.dietScore} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.exerciseHours}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Exercise (Hrs/Wk)</label>
                <input type="number" name="exerciseHours" value={data.exerciseHours} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.sleepHours}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sleep (Hrs/Night)</label>
                <input type="number" name="sleepHours" value={data.sleepHours} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.sleepQuality}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sleep Quality (1-10)</label>
                <input type="number" min="1" max="10" name="sleepQuality" value={data.sleepQuality} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.alcoholUnits}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alcohol (Units/Wk)</label>
                <input type="number" name="alcoholUnits" value={data.alcoholUnits} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.recreationalDrugUse}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Drug Use</label>
                <select name="recreationalDrugUse" value={data.recreationalDrugUse} onChange={handleChange} className="w-full p-2 border rounded-lg">
                  <option value="None">None</option><option value="Occasional">Occasional</option><option value="Regular">Regular</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 py-2">
              <label className="flex items-center gap-2 cursor-pointer" title={descriptions.smoker}>
                <input type="checkbox" name="smoker" checked={data.smoker} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
                <span className="text-[11px] font-bold text-slate-600 uppercase">Active Smoker</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer" title={descriptions.religiousSpiritualPractice}>
                <input type="checkbox" name="religiousSpiritualPractice" checked={data.religiousSpiritualPractice} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
                <span className="text-[11px] font-bold text-slate-600 uppercase">Spiritual/Community</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biometric & Physiological</h3>
            <div className="grid grid-cols-2 gap-4">
              <div title={descriptions.bmi}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">BMI</label>
                <input type="number" step="0.1" name="bmi" value={data.bmi} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.waistToHipRatio}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Waist-to-Hip</label>
                <input type="number" step="0.01" name="waistToHipRatio" value={data.waistToHipRatio} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.bloodPressure}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">BP Sys/Dia</label>
                <div className="flex gap-1">
                  <input type="number" name="bloodPressureSys" value={data.bloodPressureSys} onChange={handleChange} placeholder="Sys" className="w-1/2 p-2 border rounded-lg" />
                  <input type="number" name="bloodPressureDia" value={data.bloodPressureDia} onChange={handleChange} placeholder="Dia" className="w-1/2 p-2 border rounded-lg" />
                </div>
              </div>
              <div title={descriptions.cholesterolLevel}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cholesterol</label>
                <input type="number" name="cholesterolLevel" value={data.cholesterolLevel} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.bloodSugarLevel}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sugar (mg/dL)</label>
                <input type="number" name="bloodSugarLevel" value={data.bloodSugarLevel} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.restingHeartRate}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Resting HR</label>
                <input type="number" name="restingHeartRate" value={data.restingHeartRate} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.vo2Max}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">VO2 Max</label>
                <input type="number" name="vo2Max" value={data.vo2Max} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.heartRateVariability}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">HRV (ms)</label>
                <input type="number" name="heartRateVariability" value={data.heartRateVariability} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="col-span-2" title={descriptions.dailySteps}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Daily Steps</label>
                <input type="number" name="dailySteps" value={data.dailySteps} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">History & Genetics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div title={descriptions.geneticPredisposition}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Genetic Predisp. (1-10)</label>
                <input type="number" min="1" max="10" name="geneticPredisposition" value={data.geneticPredisposition} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.familyLongevity}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Family Longevity</label>
                <input type="number" name="familyLongevity" value={data.familyLongevity} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.epigeneticAgeDelta}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bio-Age Delta</label>
                <input type="number" step="0.5" name="epigeneticAgeDelta" value={data.epigeneticAgeDelta} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.telomereLengthScale}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Telomere Scale (1-10)</label>
                <input type="number" min="1" max="10" name="telomereLengthScale" value={data.telomereLengthScale} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.mentalHealthStatus}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mental Health (1-10)</label>
                <input type="number" min="1" max="10" name="mentalHealthStatus" value={data.mentalHealthStatus} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.cognitiveFunctionScore}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cognitive Score (1-100)</label>
                <input type="number" min="1" max="100" name="cognitiveFunctionScore" value={data.cognitiveFunctionScore} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer" title={descriptions.hasChronicDisease}>
                <input type="checkbox" name="hasChronicDisease" checked={data.hasChronicDisease} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
                <span className="text-[11px] font-bold text-slate-700 uppercase">Chronic Disease History</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer" title={descriptions.hasGeneticMutations}>
                <input type="checkbox" name="hasGeneticMutations" checked={data.hasGeneticMutations} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
                <span className="text-[11px] font-bold text-slate-700 uppercase">Known Genetic Mutations</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'env' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment & Systems</h3>
            <div className="grid grid-cols-2 gap-4">
              <div title={descriptions.airQualityRating}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Air Quality (1-5)</label>
                <input type="number" min="1" max="5" name="airQualityRating" value={data.airQualityRating} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.pollutionExposure}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pollution Exp. (1-5)</label>
                <input type="number" min="1" max="5" name="pollutionExposure" value={data.pollutionExposure} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.healthcareAccess}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Healthcare Access (1-5)</label>
                <input type="number" min="1" max="5" name="healthcareAccess" value={data.healthcareAccess} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.occupationalHazard}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Occu. Hazard (1-5)</label>
                <input type="number" min="1" max="5" name="occupationalHazard" value={data.occupationalHazard} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.stressLevel}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stress Level (1-10)</label>
                <input type="number" min="1" max="10" name="stressLevel" value={data.stressLevel} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.socialConnectionLevel}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Social Connection (1-10)</label>
                <input type="number" min="1" max="10" name="socialConnectionLevel" value={data.socialConnectionLevel} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.medicationAdherence}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Med. Adherence (1-10)</label>
                <input type="number" min="1" max="10" name="medicationAdherence" value={data.medicationAdherence} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.riskTakingBehavior}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Risk Taking (1-10)</label>
                <input type="number" min="1" max="10" name="riskTakingBehavior" value={data.riskTakingBehavior} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.climateChangeImpactRisk}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Climate Risk (1-5)</label>
                <input type="number" min="1" max="5" name="climateChangeImpactRisk" value={data.climateChangeImpactRisk} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div title={descriptions.checkupFrequency}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Checkups/Yr</label>
                <input type="number" name="checkupFrequency" value={data.checkupFrequency} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wealth' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Core</h3>
              <div className="grid grid-cols-2 gap-4">
                <div title={descriptions.income}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annual Income ($)</label>
                  <input type="number" name="income" value={data.income} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div title={descriptions.savings}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Savings ($)</label>
                  <input type="number" name="savings" value={data.savings} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div title={descriptions.monthlyInvestment}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Monthly Invest ($)</label>
                  <input type="number" name="monthlyInvestment" value={data.monthlyInvestment} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div title={descriptions.retirementAgeGoal}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Retirement Goal</label>
                  <input type="number" name="retirementAgeGoal" value={data.retirementAgeGoal} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div title={descriptions.monthlyExpenses}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Monthly Expenses ($)</label>
                  <input type="number" name="monthlyExpenses" value={data.monthlyExpenses} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div title={descriptions.riskTolerance}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Risk tolerance (1-10)</label>
                  <input type="number" min="1" max="10" name="riskTolerance" value={data.riskTolerance} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurance Breakdown ($)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div title={descriptions.insuranceLife}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Life Insurance</label>
                  <input type="number" name="insurance_life" value={data.insuranceCoverage.life} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div title={descriptions.insuranceHealth}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Health Coverage</label>
                  <input type="number" name="insurance_health" value={data.insuranceCoverage.health} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div title={descriptions.insuranceDisability}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Disability</label>
                  <input type="number" name="insurance_disability" value={data.insuranceCoverage.disability} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div title={descriptions.insuranceCritical}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Critical Illness</label>
                  <input type="number" name="insurance_criticalIllness" value={data.insuranceCoverage.criticalIllness} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="col-span-2" title={descriptions.insuranceLTC}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Long-term Care</label>
                  <input type="number" name="insurance_longTermCare" value={data.insuranceCoverage.longTermCare} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputForm;
