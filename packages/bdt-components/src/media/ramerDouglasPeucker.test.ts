import { ramerDouglasPeucker } from "./ramerDouglasPeucker";
import { LatLng } from "./decodePolyline";

describe("ramerDouglasPeucker", () => {
  it("returns empty array for empty input", () => {
    expect(ramerDouglasPeucker([], 0.0001)).toEqual([]);
  });

  it("returns a single point unchanged", () => {
    expect(ramerDouglasPeucker([[51.5, -0.1]], 0.0001)).toEqual([[51.5, -0.1]]);
  });

  it("returns two points unchanged", () => {
    const points: LatLng[] = [
      [0, 0],
      [1, 1],
    ];
    expect(ramerDouglasPeucker(points, 0.0001)).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it("removes a collinear intermediate point", () => {
    // [1,0] lies exactly on the line [0,0]→[2,0]; perpendicular distance = 0
    const points: LatLng[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    expect(ramerDouglasPeucker(points, 0.0001)).toEqual([
      [0, 0],
      [2, 0],
    ]);
  });

  it("preserves a point that deviates significantly from the line", () => {
    // Perpendicular distance of [1,1] from line [0,0]→[2,0] is 1.0, >> epsilon
    const points: LatLng[] = [
      [0, 0],
      [1, 1],
      [2, 0],
    ];
    expect(ramerDouglasPeucker(points, 0.0001)).toEqual([
      [0, 0],
      [1, 1],
      [2, 0],
    ]);
  });

  it("removes intermediate points whose deviation is below epsilon", () => {
    // [1, 0.00001] is 0.00001 from line [0,0]→[2,0], which is below epsilon=0.0001
    const points: LatLng[] = [
      [0, 0],
      [1, 0.00001],
      [2, 0],
    ];
    expect(ramerDouglasPeucker(points, 0.0001)).toEqual([
      [0, 0],
      [2, 0],
    ]);
  });

  it("preserves a point that deviates from a degenerate segment (start equals end)", () => {
    // When start === end the segment is degenerate; distance is straight Euclidean from start
    // [0,0] is sqrt(2) from [1,1], far above epsilon, so it must be preserved
    const points: LatLng[] = [
      [1, 1],
      [0, 0],
      [1, 1],
    ];
    expect(ramerDouglasPeucker(points, 0.0001)).toEqual([
      [1, 1],
      [0, 0],
      [1, 1],
    ]);
  });

  it("removes a point whose deviation equals epsilon exactly", () => {
    // [1, 0.0001] is exactly epsilon=0.0001 from line [0,0]→[2,0]; epsilon-boundary is exclusive
    const points: LatLng[] = [
      [0, 0],
      [1, 0.0001],
      [2, 0],
    ];
    expect(ramerDouglasPeucker(points, 0.0001)).toEqual([
      [0, 0],
      [2, 0],
    ]);
  });

  it("reduces a route with many collinear points to just the endpoints", () => {
    const points: LatLng[] = [
      [0, 0],
      [0, 0.5],
      [0, 1],
      [0, 1.5],
      [0, 2],
    ];
    expect(ramerDouglasPeucker(points, 0.0001)).toEqual([
      [0, 0],
      [0, 2],
    ]);
  });
});
