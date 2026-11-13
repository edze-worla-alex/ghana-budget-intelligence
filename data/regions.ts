import type { RegionId } from "./types";

// Tile-grid cartogram: one tile per region, laid out roughly north→south, west→east.
// Deliberately geometry-free so it works offline; swap for a GeoJSON choropleth later without touching the data.
export const REGIONS: { id: RegionId; name: string; col: number; row: number }[] = [
  { id: "upper-west", name: "Upper West", col: 1, row: 0 },
  { id: "upper-east", name: "Upper East", col: 3, row: 0 },
  { id: "savannah", name: "Savannah", col: 1, row: 1 },
  { id: "northern", name: "Northern", col: 2, row: 1 },
  { id: "north-east", name: "North East", col: 3, row: 1 },
  { id: "bono", name: "Bono", col: 1, row: 2 },
  { id: "bono-east", name: "Bono East", col: 2, row: 2 },
  { id: "oti", name: "Oti", col: 4, row: 2 },
  { id: "western-north", name: "Western North", col: 0, row: 3 },
  { id: "ahafo", name: "Ahafo", col: 1, row: 3 },
  { id: "ashanti", name: "Ashanti", col: 2, row: 3 },
  { id: "eastern", name: "Eastern", col: 3, row: 3 },
  { id: "volta", name: "Volta", col: 4, row: 3 },
  { id: "western", name: "Western", col: 1, row: 4 },
  { id: "central", name: "Central", col: 2, row: 4 },
  { id: "greater-accra", name: "Greater Accra", col: 3, row: 4 },
];
