// src/components/SocioEconomicPanel.jsx
import React from 'react';

// 1. Internal auxiliary component: Progress bar
const MiniBarChart = ({ label, value, colorClass, bgClass, isCurrency = false }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span className={`text-sm font-black ${colorClass}`}>
        {isCurrency ? `£${value}` : `${value}%`}
      </span>
    </div>
    {!isCurrency && (
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${bgClass}`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    )}
  </div>
);

// 2. Internal auxiliary component: Pie chart
const EducationPieChart = ({ noQual, highQual }) => {
  const otherQual = Math.max(0, 100 - noQual - highQual).toFixed(1);
  return (
    <div className="mb-2 pt-3 border-t border-slate-100">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Education Profile</p>
      <div className="flex items-center gap-5">
        <div 
          className="w-14 h-14 rounded-full shrink-0 shadow-sm border border-slate-200"
          style={{ background: `conic-gradient(#f97316 0% ${noQual}%, #10b981 ${noQual}% ${noQual + highQual}%, #e2e8f0 ${noQual + highQual}% 100%)` }}
        ></div>
        <div className="flex flex-col gap-1.5 text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span className="text-slate-500">No Qual: <span className="text-orange-600">{noQual}%</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-500">Level 4+: <span className="text-emerald-600">{highQual}%</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span className="text-slate-400">Other: {otherQual}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Main Panel Components
const SocioEconomicPanel = ({ selectedArea, socioData }) => {
  if (selectedArea === 'All' || !socioData) return null;

  return (
    <div className="absolute bottom-6 right-6 z-[400] bg-white/95 p-5 rounded-xl shadow-2xl border border-slate-200 w-72 backdrop-blur-md">
      <h3 className="text-lg font-black text-slate-800 mb-1 border-b pb-2 border-slate-100">Socio-Economic Profile</h3>
      <p className="text-[11px] text-slate-400 font-bold uppercase mb-4 tracking-wider">{selectedArea} Demographics</p>
      
      <div className="space-y-3">
        <MiniBarChart 
          label="Median Weekly Pay" 
          value={socioData.weekly_pay === '#' ? 'N/A' : socioData.weekly_pay} 
          colorClass="text-indigo-600"
          isCurrency={socioData.weekly_pay !== '#'} 
        />
        <MiniBarChart label="Unemployment Rate" value={socioData.unemployment} colorClass="text-purple-600" bgClass="bg-purple-500" />
        <MiniBarChart label="Household Deprivation" value={socioData.deprived} colorClass="text-red-600" bgClass="bg-red-500" />
        <EducationPieChart noQual={socioData.noQual} highQual={socioData.highQual} />
      </div>
    </div>
  );
};

export default SocioEconomicPanel;