import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { University, PG } from '../data/mockData';
import { Input } from './ui/Input';
import { SearchIcon } from './ui/Icons';

// Fix for default marker icons in Leaflet
// Use CDN URLs for marker images instead of local imports
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
});

interface MapProps {
  universities: University[];
  pgs?: PG[];
  onUniversityClick?: (university: University) => void;
  onPGClick?: (pg: PG) => void;
  selectedUniversityId?: string | null;
  center?: [number, number];
  zoom?: number;
}

export default function Map({
  universities,
  pgs = [],
  onUniversityClick,
  onPGClick,
  selectedUniversityId,
  center = [20.5937, 78.9629], // Center of India
  zoom = 5,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter universities based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = universities.filter((uni) =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUniversities(filtered);
      setShowDropdown(true);
    } else {
      setFilteredUniversities([]);
      setShowDropdown(false);
    }
  }, [searchQuery, universities]);

  // Handle university selection from dropdown
  const handleUniversitySelect = (university: University) => {
    setSearchQuery(university.name);
    setShowDropdown(false);
    
    // Pan and zoom to selected university
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([university.lat, university.lng], 14, {
        animate: true,
        duration: 1,
      });
    }
    
    // Call the click handler if provided
    if (onUniversityClick) {
      onUniversityClick(university);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map instance
    const map = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when universities or PGs change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Custom icons
    const universityIcon = L.divIcon({
      className: 'custom-university-marker',
      html: `
        <div style="
          background-color: #3b82f6;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
          font-weight: bold;
        ">🎓</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const pgIcon = L.divIcon({
      className: 'custom-pg-marker',
      html: `
        <div style="
          background-color: #10b981;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
        ">🏠</div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const selectedUniversityIcon = L.divIcon({
      className: 'custom-university-marker-selected',
      html: `
        <div style="
          background-color: #ef4444;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;
          font-weight: bold;
          animation: pulse 2s infinite;
        ">🎓</div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Only show selected university marker (don't show any if none selected)
    const universitiesToShow = selectedUniversityId 
      ? universities.filter(uni => uni.id === selectedUniversityId)
      : [];

    // Add university markers (only for selected university)
    universitiesToShow.forEach((university) => {
      const isSelected = university.id === selectedUniversityId;
      const icon = isSelected ? selectedUniversityIcon : universityIcon;

      const marker = L.marker([university.lat, university.lng], {
        icon,
        title: university.name,
      });

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.style.cssText = 'min-width: 200px; font-family: system-ui;';
      popupContent.innerHTML = `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${university.name}
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">
            📍 ${university.city}
          </p>
          <button 
            id="find-pgs-${university.id}" 
            style="
              width: 100%;
              padding: 8px 16px;
              background-color: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            "
            onmouseover="this.style.backgroundColor='#2563eb'"
            onmouseout="this.style.backgroundColor='#3b82f6'"
          >
            Find PGs near this university
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup',
      });

      // Add click handler for the button
      marker.on('popupopen', () => {
        const button = document.getElementById(`find-pgs-${university.id}`);
        if (button && onUniversityClick) {
          button.onclick = () => {
            onUniversityClick(university);
            marker.closePopup();
          };
        }
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // Add PG markers
    pgs.forEach((pg) => {
      const marker = L.marker([pg.lat, pg.lng], {
        icon: pgIcon,
        title: pg.name,
      });

      // Create popup content for PG
      const popupContent = document.createElement('div');
      popupContent.style.cssText = 'min-width: 220px; font-family: system-ui;';
      popupContent.innerHTML = `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${pg.name}
          </h3>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 14px; font-weight: 600; color: #059669;">
              ₹${pg.rent.toLocaleString()}/month
            </span>
            ${
              pg.verified
                ? '<span style="font-size: 12px; color: #10b981;">✓ Verified</span>'
                : ''
            }
          </div>
          <div style="margin-bottom: 8px;">
            <span style="font-size: 14px; color: #f59e0b;">
              ${'⭐'.repeat(Math.round(pg.rating))} ${pg.rating}
            </span>
            <span style="font-size: 12px; color: #6b7280; margin-left: 8px;">
              📍 ${pg.distance} km away
            </span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="
              display: inline-block;
              padding: 2px 8px;
              background-color: ${
                pg.gender === 'male'
                  ? '#dbeafe'
                  : pg.gender === 'female'
                  ? '#fce7f3'
                  : '#e0e7ff'
              };
              color: ${
                pg.gender === 'male'
                  ? '#1e40af'
                  : pg.gender === 'female'
                  ? '#9f1239'
                  : '#4338ca'
              };
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
            ">
              ${pg.gender.charAt(0).toUpperCase() + pg.gender.slice(1)}
            </span>
          </div>
          <div style="font-size: 12px; color: #6b7280;">
            ${pg.amenities.slice(0, 3).join(' • ')}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup',
      });

      if (onPGClick) {
        marker.on('click', () => {
          onPGClick(pg);
        });
      }

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // Adjust map bounds to show selected university and PGs
    if (selectedUniversityId && markersRef.current.length > 0) {
      const selectedUniversity = universities.find(
        (u) => u.id === selectedUniversityId
      );
      if (selectedUniversity) {
        // If there are PGs, fit bounds to show both university and PGs
        if (pgs.length > 0) {
          const group = L.featureGroup(markersRef.current);
          map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 13 });
        } else {
          // Just zoom to the university
          map.setView([selectedUniversity.lat, selectedUniversity.lng], 13, {
            animate: true,
          });
        }
      }
    }
  }, [universities, pgs, onUniversityClick, onPGClick, selectedUniversityId]);

  return (
    <div className="relative w-full h-full">
      {/* University Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md">
        <div className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for universities in Pune..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowDropdown(true)}
              className="pl-10 pr-4 py-3 w-full bg-white shadow-lg border-gray-200 text-base"
            />
          </div>
          
          {/* Dropdown with university list */}
          {showDropdown && filteredUniversities.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-[1001]">
              {filteredUniversities.map((university) => (
                <button
                  key={university.id}
                  onClick={() => handleUniversitySelect(university)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">🎓</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {university.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        📍 {university.city}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* No results message */}
          {showDropdown && searchQuery && filteredUniversities.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-[1001]">
              <p className="text-gray-500 text-center">
                No universities found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
