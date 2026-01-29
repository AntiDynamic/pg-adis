import { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Mess {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: number;
  rating: number;
  veg: boolean;
}

const fallbackLocation: [number, number] = [18.5204, 73.8567]; // Pune city center

function generateDummyMesses(center: [number, number]): Mess[] {
  const names = [
    'Annapurna Tiffin',
    'Sai Mess',
    'Maa Kitchen',
    'Healthy Bites',
    'Home Food Hub',
    'Spicy Treat',
    'Veggie Delight',
    'Non-Veg Express',
    'Tiffin Junction',
    'Urban Meals',
  ];
  const messes: Mess[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 1 + Math.random() * 2; // 1-3 km
    const dLat = (radius / 111) * Math.cos(angle);
    const dLng = (radius / (111 * Math.cos(center[0] * Math.PI / 180))) * Math.sin(angle);
    const lat = center[0] + dLat;
    const lng = center[1] + dLng;
    messes.push({
      id: `mess-${i}`,
      name: names[Math.floor(Math.random() * names.length)],
      lat,
      lng,
      distance: parseFloat(radius.toFixed(2)),
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      veg: Math.random() > 0.4,
    });
  }
  return messes;
}

export default function MessMap({ trigger }: { trigger: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const messMarkersRef = useRef<L.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [showMess, setShowMess] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    if (!navigator.geolocation) {
      setUserLocation(fallbackLocation);
      setMesses(generateDummyMesses(fallbackLocation));
      setShowMess(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setMesses(generateDummyMesses(loc));
        setShowMess(true);
      },
      () => {
        setUserLocation(fallbackLocation);
        setMesses(generateDummyMesses(fallbackLocation));
        setShowMess(true);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [trigger]);

  useEffect(() => {
    if (!mapRef.current || !showMess) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    const map = L.map(mapRef.current).setView(userLocation || fallbackLocation, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    mapInstanceRef.current = map;
    messMarkersRef.current.forEach((marker) => marker.remove());
    messMarkersRef.current = [];
    if (userLocation) {
      const userMarker = L.marker(userLocation, {
        icon: L.divIcon({
          className: 'custom-user-marker',
          html: `<div style="background:#2563eb;color:white;font-weight:bold;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:15px;">📍</div>`
        }),
        title: 'You are here',
      }).addTo(map);
      userMarker.bindPopup('<b>You are here</b>');
      messMarkersRef.current.push(userMarker);
    }
    if (messes.length > 0) {
      messes.forEach((mess) => {
        const marker = L.marker([mess.lat, mess.lng], {
          icon: L.divIcon({
            className: 'custom-mess-marker',
            html: `<div style="background:${mess.veg ? '#22c55e' : '#f87171'};color:white;font-weight:bold;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.2);font-size:15px;">${mess.veg ? '🥦' : '🍗'}</div>`
          }),
          title: mess.name,
        }).addTo(map);
        marker.bindPopup(`
          <div style='min-width:180px;font-family:system-ui;'>
            <b>${mess.name}</b><br/>
            ${mess.veg ? 'Veg' : 'Non-Veg'}<br/>
            ⭐ ${mess.rating} &nbsp; | &nbsp; ${mess.distance} km<br/>
            <span style='color:#6b7280;font-size:12px;'>${mess.lat.toFixed(4)}, ${mess.lng.toFixed(4)}</span>
          </div>
        `);
        messMarkersRef.current.push(marker);
      });
      if (userLocation) {
        const group = L.featureGroup([
          ...messMarkersRef.current
        ]);
        map.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: 15 });
      }
    }
    // Clean up on unmount
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [showMess, userLocation, messes]);

  return (
    <div className="w-full rounded-lg shadow-lg" style={{ minHeight: 400 }}>
      <div ref={mapRef} style={{ width: '100%', height: 400, borderRadius: 12 }} />
      {showMess && messes.length > 0 && (
        <div className="w-full max-w-lg mx-auto mt-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
            <div className="font-bold text-lg mb-2 text-gray-800">Nearby Mess / Tiffin Services</div>
            <ul className="divide-y divide-gray-100">
              {messes.map((mess) => (
                <li key={mess.id} className="py-3 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <span className={`inline-block w-10 h-10 rounded-full text-2xl flex items-center justify-center ${mess.veg ? 'bg-green-100' : 'bg-red-100'}`}>{mess.veg ? '🥦' : '🍗'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{mess.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{mess.distance} km</span>
                      <span>·</span>
                      <span>{mess.veg ? 'Veg' : 'Non-Veg'}</span>
                      <span>·</span>
                      <span>⭐ {mess.rating}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{mess.lat.toFixed(3)}, {mess.lng.toFixed(3)}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
