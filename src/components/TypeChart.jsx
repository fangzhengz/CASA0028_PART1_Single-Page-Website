// src/components/TypeChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

// Receive selectedTypes and setSelectedTypes, the two states used for multiple selections
const TypeChart = ({ typeData, selectedTypes, setSelectedTypes }) => {
  
  // === Chart.js Horizontal bar chart ===
  const barOptions = {
    indexAxis: 'y', 
    responsive: true,
    maintainAspectRatio: false,

    //  Implementing multi-select filtering by monitoring click events
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clickedType = typeData.labels[index];
        
        
        setSelectedTypes(prev => 
          prev.includes(clickedType) 
            ? prev.filter(t => t !== clickedType) 
            : [...prev, clickedType]
        );
      }
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 13 },
        bodyFont: { size: 13, weight: 'bold' },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => ` Offences: ${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: { 
        display: false, 
        grid: { display: false } 
      },
      y: { 
        grid: { display: false }, 
        border: { display: false },
        ticks: { 
          font: { size: 10, weight: 'bold' }, 
          autoSkip: false,
          color: '#475569'
        } 
      }
    },
    // When the mouse hovers over the pillar, changes to a ‘hand’ shape.
    onHover: (event, chartElement) => {
      event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-grow basis-1/2 flex flex-col transition-all">
      
      {/* Title bar*/}
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span> 
          Crime Categories
        </h4>
        
        {selectedTypes.length > 0 && (
          <button 
            onClick={() => setSelectedTypes([])}
            className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition font-black border border-blue-100"
          >
            CLEAR ({selectedTypes.length})
          </button>
        )}
      </div>
      
      <div className="flex-grow min-h-0 relative">
        {typeData && typeData.labels && typeData.labels.length > 0 ? (
          <Bar options={barOptions} data={typeData} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm italic">
            No categories available
          </div>
        )}
      </div>

      {/* Bottom operation note */}
      <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
        <span>Click bars to filter dashboard</span>
        <span className={selectedTypes.length > 0 ? "text-blue-500" : ""}>
          {selectedTypes.length > 0 ? "Filtering Active" : "Showing All"}
        </span>
      </div>
    </div>
  );
};

export default TypeChart;