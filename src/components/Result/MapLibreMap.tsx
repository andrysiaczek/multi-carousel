import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

interface MapLibreMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  title?: string;
}

export const MapLibreMap = ({
  latitude,
  longitude,
  zoom = 15,
}: MapLibreMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${
        import.meta.env.VITE_MAP_TILER_API_KEY
      }`,
      center: [longitude, latitude],
      zoom: zoom,
    });

    // Add the marker after the map has fully loaded
    map.on('load', () => {
      // Get the map container size dynamically
      const mapWidth = map.getContainer().clientWidth;
      const mapHeight = map.getContainer().clientHeight;

      // Calculate the offset based on map size
      const offsetX = mapWidth / 2;
      const offsetY = -mapHeight;

      new maplibregl.Marker({
        offset: [offsetX, offsetY],
        color: '#006D77',
      })
        .setLngLat([longitude, latitude])
        .addTo(map);
    });

    return () => map.remove();
  }, [latitude, longitude, zoom]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '100%' }}
      className="rounded-lg shadow-md"
    />
  );
};
