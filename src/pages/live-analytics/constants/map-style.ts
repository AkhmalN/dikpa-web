export type MapStyleKey = "LIGHT" | "DARK" | "OUTDOOR" | "STREET" | "SATELLITE";

export interface MapStyleConfig {
  name: string;
  description: string;
  style: string | object;
}

/**
 * CENTRALIZED MAP STYLES
 *
 * Tujuan:
 * - Menghindari hardcoded URL di component
 * - Mempermudah maintenance style map
 * - Mempermudah pergantian tema map
 * - Menjadi dokumentasi internal style yang digunakan
 */
export const MAP_STYLES: Record<MapStyleKey, MapStyleConfig> = {
  /**
   * LIGHT
   * ------------------------------------------------
   * Tampilan terang dan minimalis.
   *
   * Cocok untuk:
   * - Dashboard admin siang hari
   * - Tampilan clean
   * - Fokus ke marker/data overlay
   *
   * Kelebihan:
   * - Label jelas
   * - Tidak melelahkan saat print/screenshot
   */
  LIGHT: {
    name: "Light",
    description: "Map terang minimalis untuk dashboard umum.",
    style: "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
  },

  /**
   * DARK
   * ------------------------------------------------
   * Tampilan gelap modern.
   *
   * Cocok untuk:
   * - Live monitoring
   * - Realtime tracking
   * - Dashboard operation center
   * - Tampilan malam hari
   *
   * Kelebihan:
   * - Marker lebih menonjol
   * - Nyaman dilihat lama
   */
  DARK: {
    name: "Dark",
    description: "Map dark mode untuk live monitoring realtime.",
    style: "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json",
  },

  /**
   * OUTDOOR
   * ------------------------------------------------
   * Menampilkan kontur dan nuansa outdoor.
   *
   * Cocok untuk:
   * - Tracking lapangan
   * - Monitoring area luas
   * - Survey lokasi
   * - Operasional outdoor
   */
  OUTDOOR: {
    name: "Outdoor",
    description: "Map outdoor dengan detail area dan kontur.",
    style: "https://tiles.stadiamaps.com/styles/outdoors.json",
  },

  /**
   * STREET
   * ------------------------------------------------
   * Style default ala OpenStreetMap.
   *
   * Cocok untuk:
   * - Pengembangan awal
   * - Testing
   * - Kebutuhan general map
   */
  STREET: {
    name: "Street",
    description: "Style standar OpenStreetMap.",
    style: "https://demotiles.maplibre.org/style.json",
  },

  /**
   * SATELLITE
   * ------------------------------------------------
   * Tampilan citra satelit.
   *
   * Cocok untuk:
   * - Analisis lokasi real
   * - Survey bangunan
   * - Monitoring area fisik
   * - Tracking lapangan
   *
   * Catatan:
   * Menggunakan raster tiles ESRI.
   */
  SATELLITE: {
    name: "Satellite",
    description: "Tampilan citra satelit dunia.",
    style: {
      version: 8,
      sources: {
        esri: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: "esri-layer",
          type: "raster",
          source: "esri",
        },
      ],
    },
  },
};
