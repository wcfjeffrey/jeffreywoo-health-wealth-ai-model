
import React from 'react';
import { AnalysisResults, UserInput } from '../types';

interface Props {
  results: AnalysisResults;
  input: UserInput;
}

const ImprovementTips: React.FC<Props> = ({ results, input }) => {
  const getTips = () => {
    const tips = [];

    // Health Tips
    if (input.smoker) {
      tips.push({
        category: 'Health',
        title: 'Cessation Multiplier',
        text: 'Quitting smoking is the single highest ROI action for your longevity, potentially restoring up to 10 years of life expectancy.',
        priority: 'High'
      });
    }
    
    if (input.vo2Max < 35 && input.age < 50) {
      tips.push({
        category: 'Health',
        title: 'Cardiovascular Reserve',
        text: 'Your VO2 Max is below the longevity optimal range. Progressive aerobic training is highly recommended.',
        priority: 'High'
      });
    }

    if (input.sleepQuality < 6) {
      tips.push({
        category: 'Health',
        title: 'Neural Restoration',
        text: 'Poor sleep quality impacts cognitive reserve. Consider a digital sunset 60 mins before bed.',
        priority: 'Medium'
      });
    }

    if (input.dietaryPattern === 'Western') {
      tips.push({
        category: 'Health',
        title: 'Metabolic Pivot',
        text: 'Transitioning from a Western to a Mediterranean or DASH pattern reduces systemic inflammation significantly.',
        priority: 'High'
      });
    }

    // Wealth Tips
    if (results.insuranceGap > 500000) {
      tips.push({
        category: 'Wealth',
        title: 'Catastrophic Risk Gap',
        text: `Your coverage gap ($${(results.insuranceGap / 1000).toFixed(0)}k) poses a significant risk to your family's future standard of living.`,
        priority: 'High'
      });
    }

    const savingsRate = (input.monthlyInvestment * 12) / input.income;
    if (savingsRate < 0.15 && input.age < 55) {
      tips.push({
        category: 'Wealth',
        title: 'Saving Rate Calibration',
        text: `Your current savings rate of ${(savingsRate * 100).toFixed(1)}% is below the 15% actuarial benchmark for long-term security.`,
        priority: 'Medium'
      });
    }

    if (results.savingsShortfall > 100000) {
      tips.push({
        category: 'Wealth',
        title: 'Longevity Funding Shortfall',
        text: `The 'Longevity Gap' between your lifespan and your funds is substantial. Consider a 'Phased Retirement' strategy.`,
        priority: 'High'
      });
    }

    // Environmental
    if (input.airQualityRating < 3) {
      tips.push({
        category: 'Environment',
        title: 'Particulate Mitigation',
        text: 'Low local air quality correlates with respiratory stress. HEPA filtration at home could reduce inflammatory markers.',
        priority: 'Medium'
      });
    }

    return tips;
  };

  const tips = getTips();

  if (tips.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Actuarial Interventions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex gap-4 items-start hover:border-indigo-200 transition-colors">
            <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${tip.priority === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase text-slate-400">{tip.category}</span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${tip.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                  {tip.priority}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-900 mb-1">{tip.title}</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed">{tip.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImprovementTips;
