import { LatLng } from "./decodePolyline";

const VIEWBOX_SIZE = 100;
const PADDING = 5;

export const normalisePolyline = (points: LatLng[]): string => {
  if (points.length === 0) return "";

  const lats = points.map(([lat]) => lat);
  const lngs = points.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat;
  const lngRange = maxLng - minLng;
  const midLat = (minLat + maxLat) / 2;
  const cosLat = Math.cos((midLat * Math.PI) / 180);
  const lngRangeCorrected = lngRange * cosLat;
  const available = VIEWBOX_SIZE - PADDING * 2;
  const maxRange = Math.max(latRange, lngRangeCorrected);
  const scale = maxRange > 0 ? available / maxRange : 1;
  const xOffset = (available - lngRangeCorrected * scale) / 2;
  const yOffset = (available - latRange * scale) / 2;

  return points
    .map(([lat, lng]) => {
      const x = PADDING + xOffset + (lng - minLng) * cosLat * scale;
      const y = PADDING + yOffset + (maxLat - lat) * scale;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
};
