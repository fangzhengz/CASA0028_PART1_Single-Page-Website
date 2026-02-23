// src/components/CrimeMap.jsx
import React, { useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import SocioEconomicPanel from './SocioEconomicPanel';

const CrimeMap = ({ geoData, areaTotals, maxCrimes, selectedArea, setSelectedArea, stats, socioData }) => {
  const geoJsonLayerRef = useRef();

  const getFeatureStyle = (feature) => {
    const code = feature.properties.GSS_CODE; 
    const count = areaTotals[code] || 0;
    const intensity = count === 0 ? 0 : 0.1 + (count / maxCrimes) * 0.8;
    const isSelected = selectedArea === feature.properties.NAME;

    return {
      fillColor: count === 0 ? '#e2e8f0' : '#ef4444',
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#1e293b' : 'white',
      fillOpacity: isSelected ? 0.9 : intensity
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.NAME;
    layer.on({
      click: () => setSelectedArea(prev => prev === name ? 'All' : name),
      mouseover: (e) => {
        if (selectedArea !== name) e.target.setStyle({ weight: 2, color: '#64748b' });
      },
      mouseout: (e) => {
        if (geoJsonLayerRef.current) geoJsonLayerRef.current.resetStyle(e.target);
      }
    });
  };

  const currentSocioData = selectedArea !== 'All' ? socioData?.[selectedArea] : null;

  return (
    <section className="w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col">
      
      {/* Case Panel */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 p-5 rounded-xl shadow-xl border border-slate-100 min-w-[240px] backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Sector</h2>
            <div className="text-3xl font-black text-slate-800 tracking-tight">
              {selectedArea === 'All' ? 'Greater London' : selectedArea}
            </div>
          </div>
          {selectedArea !== 'All' && (
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedArea('All'); }} 
              className="text-[11px] bg-slate-100 text-slate-800 px-2 py-1 rounded hover:bg-slate-200 transition font-bold"
            >
              RESET
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-4xl font-black text-slate-700 tracking-tighter">
              {(stats?.totalOffences || 0).toLocaleString()}
            </span>
            <span className="text-[13px] font-bold text-slate-500">
              crimes were recorded
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-4xl font-black text-blue-600 tracking-tighter">
              {(stats?.totalOutcomes || 0).toLocaleString()}
            </span>
            <span className="text-[13px] font-bold text-blue-500">
              cases resulted in positive outcomes
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mb-1">
                Efficiency Rate
              </span>
              <span className="text-2xl font-black text-red-500 leading-none">
                {stats?.efficiency || 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-red-500 h-full transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                style={{ width: `${stats?.efficiency || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <SocioEconomicPanel selectedArea={selectedArea} socioData={currentSocioData} />

      {/* Map component */}
      <MapContainer center={[51.505, -0.09]} zoom={10} className="w-full flex-grow z-0" zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
        {geoData && (
          <GeoJSON 
            ref={geoJsonLayerRef}
            data={geoData} 
            style={getFeatureStyle} 
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </section>
  );
};

export default CrimeMap;