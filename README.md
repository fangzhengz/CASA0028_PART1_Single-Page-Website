# London Crime Situation Showcase

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-success?style=for-the-badge&logo=github)](https://fangzhengz.github.io/CASA0028_PART1_Single-Page-Website/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

An interactive, single-page geospatial dashboard designed to visualize and analyze crime data across Greater London. Built as part of the **CASA0028** module, this platform provides actionable insights by seamlessly combining crime incident reports with local socio-economic demographics.

## Live Application
**[Access the Live Dashboard Here](https://fangzhengz.github.io/CASA0028_PART1_Single-Page-Website/)**

---

## Key Features & Interactions

* **Interactive Choropleth Map**: A dynamic Leaflet map rendering London boroughs using GeoJSON. Color intensity scales automatically based on crime volume. Features hover states and click-to-select interactions.
* **Cross-Dimensional Filtering**: 
    * **Temporal Filter**: Filter data by specific months via the navigation bar or by clicking data points directly on the Trend Line Chart.
    * **Categorical Filter**: Multi-select specific crime categories from the Bar Chart to update the map and overall statistics in real-time.
* **Record of Criminal Incidents and Disposition Status**: A floating top-left panel instantly calculates and displays total offences, positive outcomes, and policing efficiency rates for the selected combination of area, time, and crime types.
* **Socio-Economic Profiling**: Clicking on a specific borough triggers a rich bottom-right panel revealing local demographic context, including median weekly pay, unemployment rates, and household deprivation metrics.
* **Modern UI/UX**: Built with Tailwind CSS, featuring a sleek layout and glassmorphism (backdrop-blur) effects for floating UI panels.

---

## Technology Stack

* **Frontend Framework**: [React](https://react.dev/) (v19) 
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
* **Geospatial Mapping**: [Leaflet](https://leafletjs.com/) & `react-leaflet`
* **Data Visualization**: [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
* **Deployment & Hosting**: GitHub Pages (`gh-pages`)

---

## Data Sources
* **Crime Data**: data.police.uk (Street-level crime data for Metropolitan Police Service).
* **Geospatial Boundaries**: London Borough boundaries provided in standard GeoJSON format.
* **Demographics**: Open data from the Greater London Authority (GLA) / London Datastore.