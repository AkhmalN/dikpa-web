"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "./constants/map-style";

type LocationPoint = {
  username: string;
  lng: number;
  lat: number;
};

type Props = {
  locations: LocationPoint[];
};

export const MapLive = ({ locations }: Props) => {
  // console.log("MapLive component received locations:", locations);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<maplibregl.Map | null>(null);

  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  const routeGeoJsonRef = useRef<GeoJSON.Feature<GeoJSON.LineString>>({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [],
    },
    properties: {},
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES.SATELLITE.style as maplibregl.StyleSpecification,
      center: [106.8186, -6.4025],
      zoom: 15,
    });

    mapRef.current = map;

    // Initialize markers will be created when locations arrive

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: routeGeoJsonRef.current,
      });

      // map.addLayer({
      //   id: "route-line",
      //   type: "line",
      //   source: "route",
      //   paint: {
      //     "line-color": "#22c55e",
      //     "line-width": 4,
      //     "line-opacity": 0.8,
      //   },
      // });
    });

    return () => {
      map.remove();
    };
  }, []);

  // HANDLE LOCATION UPDATE
  useEffect(() => {
    if (!locations.length) return;

    const map = mapRef.current;
    if (!map) return;

    // Update or create markers for each user location
    locations.forEach((loc) => {
      const existingMarker = markersRef.current.get(loc.username);

      if (existingMarker) {
        // Update existing marker
        existingMarker.setLngLat([loc.lng, loc.lat]);
      } else {
        // Create popup with username
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<div class="text-sm font-medium text-gray-800">${loc.username}</div>`,
        );

        // Create new marker
        const marker = new maplibregl.Marker({
          color: "#22c55e",
        })
          .setLngLat([loc.lng, loc.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.set(loc.username, marker);
      }
    });

    // Update route with all current locations
    const coordinates = locations.map((loc) => [loc.lng, loc.lat]);
    routeGeoJsonRef.current.geometry.coordinates = coordinates;

    // Refresh source
    const source = map.getSource("route") as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(routeGeoJsonRef.current);
    }
  }, [locations]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div ref={mapContainer} className="map-height w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
};
