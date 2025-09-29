const tomtom_api = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || process.env.TOMTOM_API_KEY;
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import React, { useEffect, useRef } from 'react';

interface EventMapModalProps {
  show: boolean;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
  eventList: any[];
}


const EventMapModal: React.FC<EventMapModalProps> = ({ show, onClose, userLocation, eventList }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const ttMapInstance = useRef<any>(null);
  const [mapError, setMapError] = React.useState<string | null>(null);

  useEffect(() => {
    if (show && mapRef.current && userLocation) {
      try {
        if (ttMapInstance.current) {
          ttMapInstance.current.remove();
        }
        if (!tomtom_api || typeof tomtom_api !== 'string' || tomtom_api.length === 0) {
          setMapError('TomTom API key is missing or invalid.');
          return;
        }
        ttMapInstance.current = tt.map({
          key: tomtom_api,
          container: mapRef.current,
          center: [userLocation.lng, userLocation.lat],
          zoom: 12
        });
        // Add user geolocation marker
        if (userLocation) {
          const userMarker = new tt.Marker({
            element: document.createElement('div'),
          })
            .setLngLat([userLocation.lng, userLocation.lat])
            .addTo(ttMapInstance.current);
          userMarker.getElement().style.background = '#007AFF';
          userMarker.getElement().style.width = '16px';
          userMarker.getElement().style.height = '16px';
          userMarker.getElement().style.borderRadius = '50%';
          userMarker.getElement().title = 'Your Location';
        }
        eventList.forEach(ev => {
          if (ev.lat && ev.lng) {
            const marker = new tt.Marker().setLngLat([ev.lng, ev.lat]).addTo(ttMapInstance.current);
            marker.getElement().title = ev.title;
          }
        });
        setMapError(null);
      } catch (err: any) {
        setMapError(err?.message || 'Failed to load map.');
      }
    }
    return () => {
      if (ttMapInstance.current) {
        ttMapInstance.current.remove();
        ttMapInstance.current = null;
      }
    };
  }, [show, userLocation, eventList]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#f2e9e4] rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
        <button
          className="absolute top-4 right-4 px-3 py-1 bg-[#9a8c98] text-[#f2e9e4] rounded"
          onClick={onClose}
        >
          Close
        </button>
        <h3 className="text-2xl font-bold mb-4 text-[#22223b]">Events Map</h3>
        {mapError ? (
          <div className="text-red-600 mb-4">{mapError}</div>
        ) : null}
        <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '1rem', marginBottom: '1rem' }} />
        <div className="mb-2 text-[#22223b]">Filters coming soon...</div>
      </div>
    </div>
  );
};

export default EventMapModal;
