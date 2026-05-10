import React from "react";
import { decodePolyline } from "./decodePolyline";
import { normalisePolyline } from "./normalisePolyline";
import { ramerDouglasPeucker } from "./ramerDouglasPeucker";
import { BDT_RED } from "./colours";

interface RoutePreviewProps {
  encodedPolyline: string;
}

const VIEWBOX_SIZE = 100;
const EPSILON = 0.0001;

export const RoutePreview = ({
  encodedPolyline,
}: RoutePreviewProps): JSX.Element => {
  const decoded = decodePolyline(encodedPolyline);
  const points = ramerDouglasPeucker(decoded, EPSILON);
  const pointsAttr = normalisePolyline(points);

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
