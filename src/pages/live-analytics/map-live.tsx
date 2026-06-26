"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "./constants/map-style";
import type { IPatrolLogs } from "@/types";

type Props = {
  patrols: IPatrolLogs[];
};

const OFFICE_CENTER: [number, number] = [106.8186, -6.4025];
const OFFICE_RADIUS_METERS = 500;

const createCirclePolygon = (
  center: [number, number],
  radiusMeters: number,
  steps = 64,
): GeoJSON.Feature<GeoJSON.Polygon> => {
  const [lng, lat] = center;
  const earthRadius = 6371008.8;
  const latRadians = (lat * Math.PI) / 180;

  const coordinates: [number, number][] = [];

  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = radiusMeters * Math.cos(angle);
    const dy = radiusMeters * Math.sin(angle);

    const lngOffset =
      (dx / (earthRadius * Math.cos(latRadians))) * (180 / Math.PI);
    const latOffset = (dy / earthRadius) * (180 / Math.PI);

    coordinates.push([lng + lngOffset, lat + latOffset]);
  }

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [coordinates],
    },
  };
};

export const MapLive = ({ patrols }: Props) => {
  console.log("MapLive component received patrols:", patrols);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<maplibregl.Map | null>(null);

  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  const routeGeoJsonRef = useRef<GeoJSON.FeatureCollection<GeoJSON.LineString>>(
    {
      type: "FeatureCollection",
      features: [],
    },
  );

  const officeAreaGeoJsonRef = useRef<GeoJSON.Feature<GeoJSON.Polygon>>(
    createCirclePolygon(OFFICE_CENTER, OFFICE_RADIUS_METERS),
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES.SATELLITE.style as maplibregl.StyleSpecification,
      center: OFFICE_CENTER,
      zoom: 15,
    });

    mapRef.current = map;

    // Initialize markers will be created when locations arrive

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: routeGeoJsonRef.current,
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#22c55e",
          "line-width": 4,
          "line-opacity": 0.8,
          "line-dasharray": [1.5, 1.5],
        },
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // HANDLE LOCATION UPDATE
  useEffect(() => {
    if (!patrols.length) return;

    const map = mapRef.current;
    if (!map) return;

    const routeFeatures: GeoJSON.Feature<GeoJSON.LineString>[] = [];

    // Update or create markers for each user location
    patrols.forEach((patrol) => {
      const historyCoordinates =
        patrol.current_history_location
          ?.map(
            (location) =>
              [location.gps_lon, location.gps_lat] as [number, number],
          )
          .filter(([lng, lat]) => lng !== 0 && lat !== 0) ?? [];

      const latestCoordinate =
        historyCoordinates.at(-1) ??
        (patrol.last_heartbeat_location?.gps_lon &&
        patrol.last_heartbeat_location?.gps_lat
          ? ([
              patrol.last_heartbeat_location.gps_lon,
              patrol.last_heartbeat_location.gps_lat,
            ] as [number, number])
          : null);

      if (historyCoordinates.length >= 2) {
        routeFeatures.push({
          type: "Feature",
          properties: {
            user_id: patrol.user_id,
          },
          geometry: {
            type: "LineString",
            coordinates: historyCoordinates,
          },
        });
      }

      if (!latestCoordinate) return;

      const existingMarker = markersRef.current.get(patrol.user_id.toString());

      if (existingMarker) {
        // Update existing marker
        existingMarker.setLngLat(latestCoordinate);
      } else {
        // Create popup with username
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<div class="text-sm font-medium text-gray-800">${patrol.user_id}</div>`,
        );

        // Create new marker
        const marker = new maplibregl.Marker({
          color: "#22c55e",
        })
          .setLngLat(latestCoordinate)
          .setPopup(popup)
          .addTo(map);

        markersRef.current.set(patrol.user_id.toString(), marker);
      }
    });

    routeGeoJsonRef.current.features = routeFeatures;

    // Refresh source
    const source = map.getSource("route") as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(routeGeoJsonRef.current);
    }
  }, [patrols]);

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
