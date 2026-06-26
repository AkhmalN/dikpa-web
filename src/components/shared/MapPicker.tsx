"use client";

import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "@/pages/live-analytics/constants/map-style";

interface MapPickerProps {
  lat: number;
  lon: number;
  onChange: (lat: number, lon: number) => void;
  height?: string;
}

export function MapPicker({
  lat,
  lon,
  onChange,
  height = "320px",
}: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const updateMarker = useCallback((lng: number, latVal: number) => {
    if (!markerRef.current) return;
    markerRef.current.setLngLat([lng, latVal]);
  }, []);

  // Init map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLES.SATELLITE.style as maplibregl.StyleSpecification,
      center: [lon, lat],
      zoom: 16,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Add click handler
      map.on("click", (e) => {
        const { lng, lat: clickedLat } = e.lngLat;
        onChange(parseFloat(clickedLat.toFixed(6)), parseFloat(lng.toFixed(6)));
      });

      // Add cursor style
      map.getCanvas().style.cursor = "crosshair";

      // Create marker
      markerRef.current = new maplibregl.Marker({
        color: "#FB2C36",
        draggable: false,
      })
        .setLngLat([lon, lat])
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync marker when lat/lon change externally
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    markerRef.current.setLngLat([lon, lat]);
    mapRef.current.flyTo({
      center: [lon, lat],
      duration: 600,
    });
  }, [lat, lon]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
          Pilih Lokasi di Peta
        </span>
        <span className="text-[11px] text-muted-foreground">
          Klik pada peta untuk memilih titik
        </span>
      </div>
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full rounded-[8px] border border-border overflow-hidden"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-[6px] border border-border bg-muted/30 px-3 py-2">
          <span className="text-[11px] font-medium text-muted-foreground shrink-0">
            LAT
          </span>
          <span className="text-[13px] font-mono text-foreground tabular-nums">
            {lat.toFixed(6)}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-[6px] border border-border bg-muted/30 px-3 py-2">
          <span className="text-[11px] font-medium text-muted-foreground shrink-0">
            LON
          </span>
          <span className="text-[13px] font-mono text-foreground tabular-nums">
            {lon.toFixed(6)}
          </span>
        </div>
      </div>
    </div>
  );
}
