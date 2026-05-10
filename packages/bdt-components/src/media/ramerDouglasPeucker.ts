// Algorithm: https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
import { LatLng } from "./decodePolyline";

const perpendicularDistance = (
  point: LatLng,
  start: LatLng,
  end: LatLng,
): number => {
  const [lat, lng] = point;
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;
  const dx = lat2 - lat1;
  const dy = lng2 - lng1;
  if (dx === 0 && dy === 0) {
    return Math.sqrt((lat - lat1) ** 2 + (lng - lng1) ** 2);
  }
  const t = ((lat - lat1) * dx + (lng - lng1) * dy) / (dx * dx + dy * dy);
  return Math.sqrt((lat - (lat1 + t * dx)) ** 2 + (lng - (lng1 + t * dy)) ** 2);
};

export const ramerDouglasPeucker = (
  points: LatLng[],
  epsilon: number,
): LatLng[] => {
  if (points.length <= 2) return points;
  const start = points[0];
  const end = points[points.length - 1];
  let maxDist = 0;
  let maxIndex = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], start, end);
    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }
  if (maxDist > epsilon) {
    const left = ramerDouglasPeucker(points.slice(0, maxIndex + 1), epsilon);
    const right = ramerDouglasPeucker(points.slice(maxIndex), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [start, end];
};
