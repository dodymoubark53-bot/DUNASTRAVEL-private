import { useEffect, useRef, useState, useMemo } from 'react';
import { FaGlobe, FaRoute, FaArrowRight } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { journeysRoutesData } from '../../data/journeys_routes_data';
import { useTours } from '../../hooks/useTours';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Bezier curve calculations for curved flight paths
const getCurvePoints = (from, to, numPoints = 50) => {
  const points = [];
  const lat1 = from[0];
  const lng1 = from[1];
  const lat2 = to[0];
  const lng2 = to[1];

  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  // Curvature amount: scale perpendicular vector by distance
  const curvature = 0.15;
  const pLat = -dLng * curvature;
  const pLng = dLat * curvature;

  const cLat = midLat + pLat;
  const cLng = midLng + pLng;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * cLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * cLng + t * t * lat2;
    points.push([lat, lng]);
  }
  return points;
};

const InteractiveJourneyMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const animationRef = useRef(null);
  const polylineRef = useRef(null);
  const planeMarkerRef = useRef(null);
  const markersRef = useRef([]);

  // Hardcoded English categories for destinations
  const categories = [
    "All",
    "Egypt",
    "Turkey",
    "Jordan",
    "Dubai (UAE)",
    "Tunisia",
    "Morocco",
    "Greece",
    "Holy Land",
    "Multi-Country Tours"
  ];

  const { tours: _liveTours } = useTours({ limit: 50 });

  const [activeCategory, setActiveCategory] = useState(() => {
    try {
      return localStorage.getItem('dunas_travel_map_category') || "All";
    } catch {
      return "All";
    }
  });
  const [selectedJourneyId, setSelectedJourneyId] = useState(() => {
    try {
      const cached = localStorage.getItem('dunas_travel_map_journey_id');
      if (cached && journeysRoutesData.some(j => j.id === cached)) return cached;
    } catch {
      // ignore
    }
    return journeysRoutesData[0]?.id || '';
  });

  // Filter journeys by destination
  const filteredJourneys = useMemo(() => {
    if (activeCategory === "All") return journeysRoutesData;
    return journeysRoutesData.filter(j => j.destination === activeCategory);
  }, [activeCategory]);

  // Active selected journey object
  const activeJourney = useMemo(() => {
    const found = journeysRoutesData.find(j => j.id === selectedJourneyId);
    if (found && (activeCategory === "All" || found.destination === activeCategory)) return found;
    // Fallback to first filtered journey
    if (filteredJourneys.length > 0) return filteredJourneys[0];
    return journeysRoutesData[0];
  }, [selectedJourneyId, filteredJourneys, activeCategory]);

  // Persist selections
  useEffect(() => {
    try {
      localStorage.setItem('dunas_travel_map_category', activeCategory);
    } catch {
      // ignore
    }
  }, [activeCategory]);

  useEffect(() => {
    try {
      if (selectedJourneyId) {
        localStorage.setItem('dunas_travel_map_journey_id', selectedJourneyId);
      }
    } catch {
      // ignore
    }
  }, [selectedJourneyId]);

  // Leaflet Map Initialization and Update
  useEffect(() => {
    if (!mapContainerRef.current || !activeJourney || activeJourney.stops.length === 0) return;

    // Clean up previous map if exists
    if (mapRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Initialize Leaflet Map
    const firstStopCoords = activeJourney.stops[0].coords;
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      zoomSnap: 0.5,
      zoomDelta: 0.5
    }).setView(firstStopCoords, 6);

    // Leaflet Voyage tiles locked to English locale
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;
    markersRef.current = [];

    // Render Stops Custom Markers
    activeJourney.stops.forEach((stop, index) => {
      // Golden circle custom div icon with index number
      const customIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: `
          <div style="
            width: 26px;
            height: 26px;
            background-color: #F5A623;
            border: 2px solid #041446;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #041446;
            font-weight: 800;
            font-size: 11px;
            box-shadow: 0px 3px 8px rgba(0,0,0,0.3);
            transition: transform 0.2s ease;
          " class="stop-marker-circle">
            ${index + 1}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      // Bind English-only tooltips and popups
      const marker = L.marker(stop.coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; color: #041446; padding: 4px; direction: ltr; text-align: left;">
            <div style="font-weight: bold; font-size: 13px; color: #C07D0A; margin-bottom: 2px;">Stop ${index + 1}</div>
            <div style="font-weight: 800; font-size: 14px; margin-bottom: 4px;">${stop.name}</div>
            <div style="font-size: 12px; opacity: 0.9; display: flex; align-items: center; gap: 4px;">
              <span>📍</span> <b>${stop.city}, ${stop.country}</b>
            </div>
            <div style="font-size: 11px; margin-top: 5px; color: #666;">Visited on Day ${stop.day}</div>
          </div>
        `);
      
      markersRef.current.push(marker);
    });

    // Zoom map to fit all stops
    const latlngs = activeJourney.stops.map(s => s.coords);
    if (latlngs.length > 0) {
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }

    // Draw paths and animate plane if there is more than 1 stop
    if (latlngs.length > 1) {
      const pathPoints = [];
      for (let i = 0; i < latlngs.length - 1; i++) {
        const segmentPoints = getCurvePoints(latlngs[i], latlngs[i + 1], 40);
        if (i > 0) segmentPoints.shift(); // Avoid duplicates at connection points
        pathPoints.push(...segmentPoints);
      }

      // Add segment back to start if it loops
      const loopSegment = getCurvePoints(latlngs[latlngs.length - 1], latlngs[0], 40);
      loopSegment.shift();
      pathPoints.push(...loopSegment);

      // Render dotted golden path
      const polyline = L.polyline(pathPoints, {
        color: '#F5A623',
        weight: 2.5,
        opacity: 0.85,
        dashArray: '6, 6',
      }).addTo(map);
      polylineRef.current = polyline;

      // Plane icon (DivIcon containing SVG of a plane)
      const planeIcon = L.divIcon({
        className: 'plane-flight-marker',
        html: `
          <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; transition: transform 0.08s ease;">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#F5A623" stroke="#041446" stroke-width="1" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));">
              <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
            </svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const plane = L.marker(pathPoints[0], { icon: planeIcon }).addTo(map);
      planeMarkerRef.current = plane;

      let currentIndex = 0;
      const speed = 0.22; // Plane flight speed
      
      const animate = () => {
        if (pathPoints.length < 2) return;

        if (currentIndex >= pathPoints.length) {
          currentIndex = 0;
        }

        const indexToUse = Math.floor(currentIndex);
        const currentPoint = pathPoints[indexToUse];
        plane.setLatLng(currentPoint);

        const nextPoint = pathPoints[Math.floor(currentIndex) + 1] || pathPoints[0];
        if (nextPoint) {
          const dLat = nextPoint[0] - currentPoint[0];
          const dLng = nextPoint[1] - currentPoint[1];
          // Calculate heading angle (with 90 deg offset to face direction of travel)
          const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
          const planeDiv = plane.getElement()?.querySelector('div');
          if (planeDiv) {
            planeDiv.style.transform = `rotate(${angle}deg)`;
          }
        }

        currentIndex += speed;
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeJourney]);

  // Click handler to zoom to specific stop
  const handleStopClick = (stopIndex) => {
    if (mapRef.current && markersRef.current[stopIndex]) {
      const marker = markersRef.current[stopIndex];
      mapRef.current.setView(marker.getLatLng(), 9, { animate: true, duration: 1 });
      marker.openPopup();
    }
  };

  return (
    <div dir="ltr" lang="en" className="w-full bg-obsidian-950 py-20 lg:py-28 text-ivory-50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1E3A8A]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title Section */}
        <div className="text-center mb-16">
          <span className="text-gold-500 uppercase tracking-[4px] font-semibold block mb-3 text-caption">
            EXPLORE THE JOURNEY ROUTE
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-display leading-tight tracking-wide gold-text-glow font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Interactive Itinerary Map
          </h2>
          <div className="w-24 h-[3px] bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          
          {/* Left Panel: Selectors & Steps */}
          <div className="lg:col-span-4 p-6 md:p-8 flex flex-col h-[550px] lg:h-[600px] border-b lg:border-b-0 lg:border-r border-white/10">
            
            {/* 1. Destination Filter */}
            <div className="mb-5">
              <label htmlFor="map-dest-select" className="block text-[11px] text-gold-400 uppercase tracking-widest mb-2 font-bold flex items-center gap-1.5">
                <FaGlobe className="text-gold-500" /> Destination Region
              </label>
              <select
                id="map-dest-select"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-obsidian-900/60 text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-obsidian-950 text-white">{cat}</option>
                ))}
              </select>
            </div>

            {/* 2. Journey Selector */}
            <div className="mb-6">
              <label htmlFor="map-journey-select" className="block text-[11px] text-gold-400 uppercase tracking-widest mb-2 font-bold flex items-center gap-1.5">
                <FaRoute className="text-gold-500" /> Select a Journey
              </label>
              <select
                id="map-journey-select"
                value={selectedJourneyId}
                onChange={(e) => setSelectedJourneyId(e.target.value)}
                disabled={filteredJourneys.length === 0}
                className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-obsidian-900/60 text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {filteredJourneys.map((j) => (
                  <option key={j.id} value={j.id} className="bg-obsidian-950 text-white">{j.title}</option>
                ))}
              </select>
            </div>

            {/* 3. stops list Timeline */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <h4 className="text-[10px] text-ivory-400 uppercase tracking-wider mb-4 font-bold border-b border-white/10 pb-2">
                Stops Timeline ({activeJourney?.stops.length || 0})
              </h4>
              
              <div className="relative pl-6 border-l border-white/15 ml-3 space-y-5">
                {activeJourney?.stops.map((stop, index) => (
                  <div
                    key={index}
                    onClick={() => handleStopClick(index)}
                    className="relative group cursor-pointer transition-all duration-300 hover:translate-x-1"
                  >
                    {/* Timeline bullet */}
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-obsidian-900 border-2 border-gold-500 flex items-center justify-center text-[9px] text-gold-400 font-bold group-hover:scale-125 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition-all duration-200 shadow-md">
                    </div>
                    
                    <div>
                      <span className="text-[10px] text-gold-500 font-bold block">Day {stop.day}</span>
                      <h5 className="font-semibold text-body-sm text-white group-hover:text-gold-400 transition-colors">
                        {stop.name}
                      </h5>
                      <span className="text-[11px] text-ivory-400 block">{stop.city}, {stop.country}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive hint */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-caption text-gold-500">
              <span>Click stops to locate on map</span>
              <FaArrowRight className="animate-pulse" />
            </div>

          </div>

          {/* Right Panel: Leaflet Map */}
          <div className="lg:col-span-8 h-[550px] lg:h-[600px] relative z-10">
            <div ref={mapContainerRef} className="w-full h-full" style={{ outline: 'none' }} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default InteractiveJourneyMap;
