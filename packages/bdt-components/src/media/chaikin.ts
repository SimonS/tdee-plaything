// Algorithm: https://graphics.cs.ucdavis.edu/education/CAGDNotes/Chaikins-Algorithm/Chaikins-Algorithm.html
import { LatLng } from "./decodePolyline";

export const chaikinSmooth = (
  points: LatLng[],
  iterations: number,
): LatLng[] => {
  if (points.length < 3) return points;
  let result = points;
  for (let iter = 0; iter < iterations; iter++) {
    const next: LatLng[] = [result[0]];
    for (let i = 0; i < result.length - 1; i++) {
      const [lat0, lng0] = result[i];
      const [lat1, lng1] = result[i + 1];
      next.push([0.75 * lat0 + 0.25 * lat1, 0.75 * lng0 + 0.25 * lng1]);
      next.push([0.25 * lat0 + 0.75 * lat1, 0.25 * lng0 + 0.75 * lng1]);
    }
    next.push(result[result.length - 1]);
    result = next;
  }
  return result;
};
