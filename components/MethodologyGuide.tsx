
import React from 'react';

const MethodologyGuide: React.FC = () => {
  const categories = [
    {
      icon: '🧍',
      title: 'Demographics',
      health: 'Age, gender, ethnicity, and marital status influence average life expectancy and disease risks.',
      wealth: 'These also affect insurance premiums, retirement planning needs, and household financial responsibilities.'
    },
    {
      icon: '🍎',
      title: 'Lifestyle Habits',
      health: 'Diet, exercise, sleep, smoking, alcohol, and drug use directly impact longevity and risk of chronic illness.',
      wealth: 'Healthy habits reduce medical costs over time, while risky habits increase healthcare expenses and insurance costs.'
    },
    {
      icon: '🩺',
      title: 'Medical/Family History',
      health: 'Chronic diseases or genetic predispositions raise health risks. Family longevity can be a positive indicator.',
      wealth: 'Higher health risks mean greater need for savings, insurance, and long-term care planning.'
    },
    {
      icon: '🌍',
      title: 'Environmental Factors',
      health: 'Pollution, workplace hazards, and access to healthcare affect overall wellbeing.',
      wealth: 'Living in high-risk environments can increase medical costs and reduce earning potential.'
    },
    {
      icon: '💼',
      title: 'Socio-Economic Factors',
      health: 'Education, income, and stress levels influence lifestyle choices and access to healthcare.',
      wealth: 'Higher income and education usually mean better financial security, while stress can reduce productivity and savings.'
    },
    {
      icon: '💰',
      title: 'Financial Data',
      health: 'Financial stability reduces stress, which supports better health.',
      wealth: 'Income, savings, investments, and insurance coverage determine retirement readiness and resilience against unexpected health costs.'
    },
    {
      icon: '➕',
      title: 'Additional Factors',
      health: 'Biometric Data (BMI, BP) shows current status. Psychological/Social health improves longevity. Regular check-ups enable early detection. Macro risks like climate change affect job security and savings.',
      wealth: 'Poor metrics lead to higher costs. Better mental health boosts productivity. Early detection saves money. Macro factors affect investment returns.'
    }
  ];

  return (
    <section className="mt-12 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Methodology & Factor Guide</h2>
        <div className="h-px bg-slate-200 flex-grow mx-4"></div>
      </div>

      <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden mb-8">
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2 flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500 rounded-lg text-lg">🛡️</span>
            Professional Actuarial Integration
          </h3>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-3xl">
            This application applies <strong>professional actuarial models</strong> (such as the Gompertz–Makeham law of mortality) 
            cross-referenced with medical research and financial planning simulations. Our engine calculates 
            probabilistic shifts in lifespan based on multivariate inputs, providing an integrated view of 
            your biological and financial capital.
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{cat.icon}</span>
              <h4 className="font-black text-slate-900 uppercase tracking-wide text-xs">{cat.title}</h4>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <span className="text-[10px] font-black text-emerald-600 uppercase mt-0.5">Health</span>
                <p className="text-xs text-slate-600 leading-relaxed">{cat.health}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase mt-0.5">Wealth</span>
                <p className="text-xs text-slate-600 leading-relaxed">{cat.wealth}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MethodologyGuide;
