import React, { useState } from 'react';
// 1. Introducing Hook 
import { useCrimeData } from './hooks/useCrimeData';
// 2. Introducing components
import CrimeMap  from './components/CrimeMap';
import TrendChart from './components/TrendChart';
import TypeChart from './components/TypeChart';
import 'leaflet/dist/leaflet.css';

// 3. Chart.js Core Registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const App = () => {
  // === State Management ===
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  // Multiple-choice crime type status
  const [selectedTypes, setSelectedTypes] = useState([]);

  // === Invoke Hook ===
  const { 
    isLoading, 
    geoData, 
    rawData, 
    areaTotals,
    socioData, 
    trendData, 
    typeData, 
    stats,
    maxCrimes 
  } = useCrimeData(selectedMonth, selectedArea, selectedTypes);

  // Loading screen
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white font-bold text-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          🚀 Loading London crime data...
        </div>
      </div>
    );
  }

  // Obtain a list of all months
  const allMonths = [...new Set(rawData.map(d => d.month))].sort();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* Top navigation bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
             <span className="text-xl font-black">L</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none uppercase">London Crime Tactical</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Intelligence Dashboard 2025</p>
          </div>
        </div>

        {/* Month filter */}
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time Filter</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 px-4 py-2 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="All">Full Year 2025 (All Months)</option>
            {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </header>

      {/* Interaction Zone */}
      <main className="flex-grow flex p-4 gap-4 overflow-hidden h-[calc(100vh-76px)]">
        
        {/* Left-side map component */}
        <CrimeMap 
          geoData={geoData} 
          areaTotals={areaTotals} 
          maxCrimes={maxCrimes} 
          selectedArea={selectedArea} 
          setSelectedArea={setSelectedArea} 
          stats={stats} 
          socioData={socioData}
        />

        {/* Right-side data panel */}
        <aside className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-1">
        
          
          {/* Line Chart Component */}
          <TrendChart trendData={trendData}
          selectedMonth={selectedMonth}      
          setSelectedMonth={setSelectedMonth}   
          />
          
          {/* Category Statistics Component */}
          <TypeChart 
            typeData={typeData} 
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />

          {/* Bottom note */}
          <div className="p-4 bg-white/50 rounded-xl border border-slate-200">
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              * Note: Click the bar chart in the bottom-right corner to select multiple crime types. The panel in the top-left corner will update in real time with the total number of cases filed and the processing efficiency for that combination.
            </p>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default App;