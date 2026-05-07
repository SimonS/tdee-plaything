import React from "react";
import { decodePolyline, LatLng } from "./decodePolyline";
import { BDT_RED } from "./colours";

interface RoutePreviewProps {
  encodedPolyline: string;
}

const VIEWBOX_SIZE = 100;
const PADDING = 5;

const normalise = (points: LatLng[]): string => {
  const lats = points.map(([lat]) => lat);
  const lngs = points.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;
  const scale = VIEWBOX_SIZE - PADDING * 2;

  return points
    .map(([lat, lng]) => {
      const x = PADDING + ((lng - minLng) / lngRange) * scale;
      const y = PADDING + ((maxLat - lat) / latRange) * scale;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
};

export const RoutePreview = ({
  encodedPolyline,
}: RoutePreviewProps): JSX.Element => {
  const points = decodePolyline(encodedPolyline);
  const pointsAttr = normalise(points);

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      preserveAspectRatio="xMidYMid meet"
      width="154"
      height="154"
      aria-hidden="true"
    >
      <polyline
        points={pointsAttr}
        fill="none"
        stroke={BDT_RED}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
