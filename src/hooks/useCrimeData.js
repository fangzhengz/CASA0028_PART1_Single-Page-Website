// src/hooks/useCrimeData.js
import { useState, useEffect, useMemo } from 'react';

// Add the selectedTypes parameter, defaulting to an empty array.
export const useCrimeData = (selectedMonth, selectedArea, selectedTypes = []) => {
  // === 1. Basic State Management ===
  const [geoData, setGeoData] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socioData, setSocioData] = useState({}); 

  // === 2. Data extraction ===
  useEffect(() => {
    Promise.all([
      fetch('/Final_Borough_Map.geojson').then(res => res.json()),
      fetch('/london_crimes_2025_flexible.json').then(res => res.json()),
      fetch('/socio_data.json').then(res => res.json()), 
    ])
      .then(([geo, crime, socio]) => {
        setGeoData(geo);
        setRawData(crime);
        setSocioData(socio);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Data loading error:", err);
        setIsLoading(false);
      });
  }, []);

  // === 3. Core processing section ===
  const processedData = useMemo(() => {
    if (rawData.length === 0) {
      return { 
        areaTotals: {}, trendData: { labels: [], datasets: [] }, 
        typeData: { labels: [], datasets: [] }, maxCrimes: 1,
        stats: { totalOffences: 0, totalOutcomes: 0, efficiency: 0 } 
      };
    }

    // A. Basic filtering
    const baseData = rawData.filter(d => d.type !== 'KNIFE CRIME');

    // Calculate the Stats in the top-left corner (influenced by month, region, and selected type)
    let statsFiltered = baseData;
    if (selectedMonth !== 'All') statsFiltered = statsFiltered.filter(d => d.month === selectedMonth);
    if (selectedArea !== 'All') statsFiltered = statsFiltered.filter(d => d.area === selectedArea);
    if (selectedTypes.length > 0) statsFiltered = statsFiltered.filter(d => selectedTypes.includes(d.type));

    // 1. Filter offences and sum them
    const totalOffences = statsFiltered
      .filter(d => d.Measure === 'Offences')
      .reduce((sum, d) => sum + (Number(d.count) || 0), 0);
      
    // 2. Filter out positive outcomes and sum them
    const totalOutcomes = statsFiltered
      .filter(d => d.Measure === 'Positive Outcomes')
      .reduce((sum, d) => sum + (Number(d.count) || 0), 0);

    // 3. Calculate efficiency rate
    const efficiency = totalOffences > 0 
      ? ((totalOutcomes / totalOffences) * 100).toFixed(1) 
      : 0;

    // B. Calculate heatmap 
    let mapData = baseData.filter(d => d.Measure === 'Offences');
    if (mapData.length === 0) mapData = baseData;

    if (selectedMonth !== 'All') mapData = mapData.filter(d => d.month === selectedMonth);
    if (selectedTypes.length > 0) mapData = mapData.filter(d => selectedTypes.includes(d.type));

    const areaTotals = mapData.reduce((acc, curr) => {
      acc[curr.area_code] = (acc[curr.area_code] || 0) + (Number(curr.count) || 0);
      return acc;
    }, {});
    const maxCrimes = Math.max(...Object.values(areaTotals), 1);

    // C. Assembled Line Chart 
    let trendBase = baseData.filter(d => d.Measure === 'Offences');
    if (trendBase.length === 0) trendBase = baseData; 

    if (selectedArea !== 'All') trendBase = trendBase.filter(d => d.area === selectedArea);
    if (selectedTypes.length > 0) trendBase = trendBase.filter(d => selectedTypes.includes(d.type));

    const trendMap = trendBase.reduce((acc, curr) => {
      acc[curr.month] = (acc[curr.month] || 0) + (Number(curr.count) || 0);
      return acc;
    }, {});
    const months = Object.keys(trendMap).sort();
    const trendData = {
      labels: months,
      datasets: [{
        label: 'Offences',
        data: months.map(m => trendMap[m]),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    // D. Assembling a column chart
    let panelData = baseData.filter(d => d.Measure === 'Offences');
    if (panelData.length === 0) panelData = baseData; 

    if (selectedMonth !== 'All') panelData = panelData.filter(d => d.month === selectedMonth);
    if (selectedArea !== 'All') panelData = panelData.filter(d => d.area === selectedArea);

    const typeMap = panelData.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + (Number(curr.count) || 0);
      return acc;
    }, {});

    const sortedTypes = Object.keys(typeMap)
      .map(t => ({ type: t, count: typeMap[t] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const typeData = {
      labels: sortedTypes.map(d => d.type),
      datasets: [{
        label: 'Offences Number',
        data: sortedTypes.map(d => d.count),
        backgroundColor: sortedTypes.map(d => 
          selectedTypes.includes(d.type) ? '#2563eb' : '#ef4444'
        ),
        borderRadius: 4
      }]
    };

    return { 
      areaTotals, trendData, typeData, maxCrimes,
      totalCrimes: totalOffences,
      stats: { totalOffences, totalOutcomes, efficiency } 
    };
  }, [rawData, selectedMonth, selectedArea, selectedTypes]);

  // === 4. exposed data ===
  return { 
    geoData, rawData, socioData, isLoading, ...processedData 
  };
};