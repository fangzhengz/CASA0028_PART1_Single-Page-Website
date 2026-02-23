// src/components/TrendChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';

// The selectedMonth and setSelectedMonth properties
const TrendChart = ({ trendData, selectedMonth, setSelectedMonth }) => {
  // === Chart.js Line chart ===
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: false }, 
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { 
        grid: { display: false }, // Hide X-axis gridlines
        ticks: { font: { size: 11 } } 
      },
      y: { 
        border: { display: false }, // Hide Y-axis gridlines
        ticks: { 
          font: { size: 11 }, 
          // When the value exceeds 1000, automatically formatted as ‘1.5k’.
          callback: (v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v 
        } 
      }
    },
    interaction: { 
      mode: 'nearest', 
      axis: 'x', 
      intersect: false 
    },
    
    // Click the line point to switch months 
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        // Retrieve the specific month tag for the click
        const clickedMonth = trendData.labels[dataIndex];
        
        
        if (selectedMonth === clickedMonth) {
          setSelectedMonth('All');
        } else {
          setSelectedMonth(clickedMonth);
        }
      }
    },
    
    // When the mouse hovers over the point, it changes to a “hand” cursor.
    onHover: (event, elements) => {
      if (event.native) {
        event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
      }
    }
  };

  return (
    // Outer container style
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-grow basis-1/2 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span> 
          Monthly changes of crime incident
        </h4>
        {/* Display the current filtered time status */}
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md tracking-widest uppercase">
          {selectedMonth === 'All' ? '2025 Full Year' : selectedMonth}
        </span>
      </div>
      
      {/* Core chart area*/}
      <div className="flex-grow min-h-0 relative">
        {trendData && trendData.labels && trendData.labels.length > 0 ? (
          <Line options={lineOptions} data={trendData} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            No trend data available
          </div>
        )}
      </div>

      {/* Bottom note */}
      <div className="mt-3 text-center border-t border-slate-50 pt-2">
        <p className="text-[10px] text-slate-400 italic">
          * Hint: Click on any data point to filter dashboard by month.
        </p>
      </div>
    </div>
  );
};

export default TrendChart;