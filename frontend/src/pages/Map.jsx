import { useState, useEffect } from "react";
import { getCenters } from "../services/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaTrash, FaRecycle } from "react-icons/fa";

export default function Map() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await getCenters();
        if (res.success) {
          setCenters(res.data);
        }
      } catch (err) {
        console.error("Failed to load map collection centers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setLocating(false);
        },
        (error) => {
          console.error("Geolocation failed or denied:", error);
          // Fallback to Bhimavaram region: [16.5449, 81.5212]
          setMapCenter([16.5449, 81.5212]);
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      console.warn("Geolocation not supported by browser.");
      setMapCenter([16.5449, 81.5212]);
      setLocating(false);
    }
  }, []);

  // Mapping category colors to hex values
  const getMarkerColor = (colorName) => {
    switch (colorName) {
      case "blue": return "#3b82f6"; // Blue = Recycling
      case "red": return "#ef4444";  // Red = Hazardous
      case "green": return "#10b981"; // Green = Organic
      case "yellow": return "#f59e0b"; // Yellow = E-waste
      default: return "#71717a";
    }
  };

  // Custom marker generator using L.divIcon (prevents Leaflet asset import bugs)
  const createMarkerIcon = (colorName) => {
    const colorHex = getMarkerColor(colorName);
    const html = `
      <div style="
        background-color: ${colorHex};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -14px;
        margin-top: -28px;
      ">
        <div style="
          background-color: #ffffff;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `;

    return L.divIcon({
      html: html,
      className: "custom-leaflet-marker",
      iconSize: [28, 28],
      iconAnchor: [0, 0],
      popupAnchor: [0, -28]
    });
  };

  if (loading || locating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <FaRecycle className="animate-spin text-5xl text-emerald-400" />
        <p className="text-zinc-500 font-semibold animate-pulse">
          {locating ? "Locating your position..." : "Mapping collection centers..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Waste Collection Centers</h1>
        <p className="text-zinc-400 text-sm">Locate nearby recycling hubs, hazardous drop-offs, and organic composting points.</p>
      </div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Column: Center List */}
        <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-5 space-y-4 max-h-[600px] overflow-y-auto lg:col-span-1 shadow-lg">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-900 pb-3 flex items-center gap-2">
            <FaMapMarkerAlt className="text-emerald-400" /> Available Centers ({centers.length})
          </h2>

          <div className="space-y-3">
            {centers.map((center) => {
              const borderCol = getMarkerColor(center.color);
              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col gap-2 ${
                    selectedCenter?.id === center.id
                      ? "bg-zinc-800/40 border-zinc-700"
                      : "bg-zinc-950/40 border-zinc-900/80 hover:bg-zinc-900/40 hover:border-zinc-800"
                  }`}
                  style={{ borderLeft: `4px solid ${borderCol}` }}
                >
                  <div>
                    <h3 className="font-extrabold text-zinc-200 text-sm capitalize">{center.name}</h3>
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider mt-1 inline-block"
                      style={{ color: borderCol }}
                    >
                      {center.category} Hub
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs">{center.address}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Leaflet Map Container */}
        <div className="lg:col-span-2 border border-zinc-900 rounded-3xl overflow-hidden relative shadow-2xl h-[500px] lg:h-[600px] z-10">
          <MapContainer 
            center={mapCenter} 
            zoom={12} 
            className="w-full h-full"
            style={{ background: "#18181b" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              // Dark mode map filter for premium aesthetic
              className="map-tiles-dark"
            />

            {centers.map((center) => (
              <Marker
                key={center.id}
                position={[center.latitude, center.longitude]}
                icon={createMarkerIcon(center.color)}
                eventHandlers={{
                  click: () => {
                    setSelectedCenter(center);
                  },
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-2 text-zinc-900 max-w-[220px]">
                    <h4 className="font-bold text-zinc-900 text-sm border-b border-zinc-200 pb-1">{center.name}</h4>
                    <p className="text-zinc-600 text-xs font-semibold">{center.address}</p>
                    <div className="text-[10px] text-zinc-500 space-y-1">
                      <p className="flex items-center gap-1"><FaClock /> {center.hours}</p>
                      <p className="flex items-center gap-1"><FaPhoneAlt /> {center.phone}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Selected Center Info Overlay (Overlay on Mobile/Side HUD on Large Screens) */}
          {selectedCenter && (
            <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/95 border border-zinc-800 backdrop-blur-md p-5 rounded-2xl z-20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slideUp">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: getMarkerColor(selectedCenter.color) }}
                  ></span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    {selectedCenter.category} Center
                  </span>
                </div>
                <h4 className="font-extrabold text-white text-base">{selectedCenter.name}</h4>
                <p className="text-zinc-400 text-xs">{selectedCenter.address}</p>
              </div>

              <div className="flex flex-col gap-1 text-xs text-zinc-400 border-t border-zinc-900 pt-3 md:border-t-0 md:pt-0">
                <p className="flex items-center gap-2"><FaClock className="text-zinc-600" /> {selectedCenter.hours}</p>
                <p className="flex items-center gap-2"><FaPhoneAlt className="text-zinc-600" /> {selectedCenter.phone}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedCenter.acceptedWaste.map((waste, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-bold">
                      {waste}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
