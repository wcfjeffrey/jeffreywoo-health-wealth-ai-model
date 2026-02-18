
import React, { useState, useEffect } from 'react';
import { UserInput, AnalysisResults } from '../types';
import { runFullAnalysis } from '../services/calculator';

interface Props {
  currentInput: UserInput;
  currentResults: AnalysisResults;
}

const ScenarioPlanner: React.FC<Props> = ({ currentInput, currentResults }) => {
  const [scenarioInput, setScenarioInput] = useState<UserInput>({ ...currentInput });
  const [scenarioResults, setScenarioResults] = useState<AnalysisResults>({ ...currentResults });

  useEffect(() => {
    setScenarioResults(runFullAnalysis(scenarioInput));
  }, [scenarioInput]);

  const handleSliderChange = (name: string, value: number) => {
    setScenarioInput(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setScenarioInput({ ...currentInput });
  };

  const longevityDelta = scenarioResults.baselineLongevity - currentResults.baselineLongevity;
  const wealthDelta = scenarioResults.wealthAtRetirement - currentResults.wealthAtRetirement;

  const exportReport = () => {
    const report = `
JEFFREYWOO HEALTH & WEALTH IMPACT REPORT
----------------------------------------
Current Est. Lifespan: ${currentResults.baselineLongevity.toFixed(1)} years
Simulated Est. Lifespan: ${scenarioResults.baselineLongevity.toFixed(1)} years
Longevity Change: ${longevityDelta >= 0 ? '+' : ''}${longevityDelta.toFixed(1)} years

Current Wealth at Retirement: $${currentResults.wealthAtRetirement.toLocaleString()}
Simulated Wealth at Retirement: $${scenarioResults.wealthAtRetirement.toLocaleString()}
Wealth Change: ${wealthDelta >= 0 ? '+' : ''}$${wealthDelta.toLocaleString()}

KEY SIMULATION ADJUSTMENTS:
- Weekly Exercise: ${scenarioInput.exerciseHours} hrs
- Sleep Quality: ${scenarioInput.sleepQuality}/10
- Monthly Investment: $${scenarioInput.monthlyInvestment}
- Retirement Age: ${scenarioInput.retirementAgeGoal}
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Impact_Report.txt';
    link.click();
  };

  return (
    <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <div className="text-8xl font-black">WHAT IF?</div>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest mb-1">Scenario Simulation</h2>
            <p className="text-indigo-300 text-xs font-medium">Real-time compounded actuarial impact analysis.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Reset</button>
            <button onClick={exportReport} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-indigo-900/50">Export Report</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Exercise Hours</span>
                  <span className="text-white">{scenarioInput.exerciseHours} hrs/wk</span>
                </label>
                <input 
                  type="range" min="0" max="20" step="1"
                  value={scenarioInput.exerciseHours}
                  onChange={(e) => handleSliderChange('exerciseHours', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="space-y-3">
                <label className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Diet Quality</span>
                  <span className="text-white">{scenarioInput.dietScore}/10</span>
                </label>
                <input 
                  type="range" min="1" max="10" step="1"
                  value={scenarioInput.dietScore}
                  onChange={(e) => handleSliderChange('dietScore', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="space-y-3">
                <label className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Monthly Saving</span>
                  <span className="text-white">${scenarioInput.monthlyInvestment}</span>
                </label>
                <input 
                  type="range" min="0" max="10000" step="100"
                  value={scenarioInput.monthlyInvestment}
                  onChange={(e) => handleSliderChange('monthlyInvestment', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="space-y-3">
                <label className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Retirement Age</span>
                  <span className="text-white">Age {scenarioInput.retirementAgeGoal}</span>
                </label>
                <input 
                  type="range" min="40" max="85" step="1"
                  value={scenarioInput.retirementAgeGoal}
                  onChange={(e) => handleSliderChange('retirementAgeGoal', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase text-slate-500 mb-2">Longevity Impact</span>
              <div className={`text-3xl font-black ${longevityDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {longevityDelta >= 0 ? '+' : ''}{longevityDelta.toFixed(1)} <span className="text-sm font-normal text-slate-400">Yrs</span>
              </div>
              <p className="text-[9px] text-slate-500 mt-2 leading-tight">Projected shift in physiological end-point.</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase text-slate-500 mb-2">Wealth Impact</span>
              <div className={`text-2xl font-black ${wealthDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {wealthDelta >= 0 ? '+' : ''}${(Math.abs(wealthDelta) / 1000).toFixed(0)}k
              </div>
              <p className="text-[9px] text-slate-500 mt-2 leading-tight">Portfolio variance at point of exit.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScenarioPlanner;
