
import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, ReferenceLine, BarChart, Bar, Cell, Legend } from 'recharts';
import { AnalysisResults, UserInput } from '../types';
import { ANNUAL_RETURN_RATE } from '../constants';

interface Props {
  results: AnalysisResults;
  input: UserInput;
}

const Dashboard: React.FC<Props> = ({ results, input }) => {
  const wealthData = useMemo(() => {
    const data = [];
    let currentWealth = input.savings;
    const adjustedReturn = 0.03 + (input.riskTolerance / 10) * 0.07;
    const yearsToProject = Math.max(results.baselineLongevity, results.financialRunwayAge, 90) - input.age + 10;
    
    for (let y = 0; y <= yearsToProject; y++) {
      const age = input.age + y;
      const isRetirement = age >= input.retirementAgeGoal;
      
      if (!isRetirement) {
        currentWealth = currentWealth * (1 + adjustedReturn) + (input.monthlyInvestment * 12);
      } else {
        currentWealth = currentWealth * (1 + adjustedReturn) - (input.monthlyExpenses * 0.85 * 12 * Math.pow(1.025, y));
      }
      
      data.push({
        age,
        wealth: Math.max(0, Math.round(currentWealth)),
      });
      if (age > 105) break;
    }
    return data;
  }, [input, results]);

  const incomeAllocationData = [
    { name: 'Taxes', value: results.incomeBreakdown.taxes, color: '#94a3b8' },
    { name: 'Essential', value: results.incomeBreakdown.essential, color: '#f43f5e' },
    { name: 'Savings', value: results.incomeBreakdown.savings, color: '#6366f1' },
    { name: 'Lifestyle', value: results.incomeBreakdown.discretionary, color: '#10b981' },
  ];

  const healthRadar = [
    { subject: 'Diet/Habits', A: input.dietScore * 10, fullMark: 100 },
    { subject: 'Environment', A: input.airQualityRating * 20, fullMark: 100 },
    { subject: 'Socio-Econ', A: 100 - (input.stressLevel * 10), fullMark: 100 },
    { subject: 'Vices', A: (input.smoker ? 0 : 50) + (input.recreationalDrugUse === 'None' ? 50 : 20), fullMark: 100 },
    { subject: 'Activity', A: Math.min(100, input.exerciseHours * 15), fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Lifespan</p>
          <h4 className="text-2xl font-black text-slate-900">{results.baselineLongevity.toFixed(1)} <span className="text-xs font-normal text-slate-400">YRS</span></h4>
          <div className={`text-[10px] font-bold mt-1 inline-flex items-center px-2 py-0.5 rounded ${results.estimatedLongevityShift >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {results.estimatedLongevityShift >= 0 ? '↑' : '↓'} {Math.abs(results.estimatedLongevityShift).toFixed(1)} vs baseline
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Runway Age</p>
          <h4 className="text-2xl font-black text-slate-900">{results.financialRunwayAge.toFixed(1)} <span className="text-xs font-normal text-slate-400">AGE</span></h4>
          <p className={`text-[10px] font-bold mt-1 ${results.financialRunwayAge < results.baselineLongevity ? 'text-rose-500' : 'text-emerald-600'}`}>
            {results.financialRunwayAge < results.baselineLongevity ? '⚠️ Longevity Gap' : '✓ Sufficient'}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Insurance Gap</p>
          <h4 className="text-2xl font-black text-slate-900">${(results.insuranceGap / 1000).toFixed(0)}k</h4>
          <p className="text-[10px] mt-1 text-slate-500">{results.insuranceGap > 0 ? 'Unmet coverage target' : 'Adequately covered'}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retirement Prob.</p>
          <h4 className="text-2xl font-black text-slate-900">{(results.probabilityOfSurvivalToRetirement * 100).toFixed(0)}%</h4>
          <p className="text-[10px] mt-1 text-slate-500">Survival to target age</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wealth Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Wealth vs Longevity</h3>
            <span className="text-[10px] text-slate-400">Monte Carlo Adjusted</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wealthData}>
                <defs>
                  <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="age" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Portfolio']}
                />
                <Area type="stepAfter" dataKey="wealth" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWealth)" />
                <ReferenceLine x={results.baselineLongevity} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'top', value: 'Est. Death', fill: '#f43f5e', fontSize: 10 }} />
                <ReferenceLine x={input.retirementAgeGoal} stroke="#10b981" strokeDasharray="5 5" label={{ position: 'top', value: 'Retirement', fill: '#10b981', fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Monthly Income Allocation</h3>
            <span className="text-[10px] text-slate-400">Cash Flow Distribution</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeAllocationData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`$${Math.round(value).toLocaleString()}/mo`, 'Amount']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {incomeAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Health Radar */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Risk Profile</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={healthRadar}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} />
                <Radar name="User Risk Profile" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Risk Breakdown List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Vulnerability Assessment</h3>
           <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Cardiovascular', value: results.healthRiskBreakdown.cardiovascular, icon: '❤️' },
                { label: 'Metabolic', value: results.healthRiskBreakdown.metabolic, icon: '🧪' },
                { label: 'Psychological', value: results.healthRiskBreakdown.psychological, icon: '🧠' },
                { label: 'Environmental', value: results.healthRiskBreakdown.environmental, icon: '🌍' },
              ].map((risk) => (
                <div key={risk.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span>{risk.icon}</span> {risk.label}
                    </span>
                    <span className={`text-[10px] font-bold ${risk.value > 60 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {risk.value}% Risk
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${risk.value > 60 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${risk.value}%` }}
                    />
                  </div>
                </div>
              ))}
           </div>
           <div className="mt-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                {/* Fixed arithmetic operation error by casting entries to [string, number][] to ensure values are treated as numbers */}
                <strong>Strategy Insight:</strong> Your greatest longevity lever is currently 
                <span className="font-black"> {
                  (Object.entries(results.healthRiskBreakdown) as [string, number][]).sort((a,b) => b[1] - a[1])[0][0].toUpperCase()
                } risk mitigation</span>. Small adjustments in this quadrant yield a non-linear positive impact on both quality of life and total lifespan.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
