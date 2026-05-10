import { chaikinSmooth } from "./chaikin";
import { LatLng } from "./decodePolyline";

describe("chaikinSmooth", () => {
  it("returns empty array for empty input", () => {
    expect(chaikinSmooth([], 3)).toEqual([]);
  });

  it("returns a single point unchanged", () => {
    expect(chaikinSmooth([[51.5, -0.1]], 3)).toEqual([[51.5, -0.1]]);
  });

  it("returns two points unchanged", () => {
    const points: LatLng[] = [
      [0, 0],
      [1, 1],
    ];
    expect(chaikinSmooth(points, 3)).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it("returns input unchanged when iterations is 0", () => {
    const points: LatLng[] = [
      [0, 0],
      [2, 2],
      [4, 0],
    ];
    expect(chaikinSmooth(points, 0)).toEqual([
      [0, 0],
      [2, 2],
      [4, 0],
    ]);
  });

  it("produces correct coordinates for 1 iteration on a 3-point route", () => {
    // Input: [0,0] → [2,2] → [4,0]
    // Edge [0,0]→[2,2]: Q=0.75·[0,0]+0.25·[2,2]=[0.5,0.5], R=0.25·[0,0]+0.75·[2,2]=[1.5,1.5]
    // Edge [2,2]→[4,0]: Q=0.75·[2,2]+0.25·[4,0]=[2.5,1.5], R=0.25·[2,2]+0.75·[4,0]=[3.5,0.5]
    // Endpoints preserved: [0,0] at start, [4,0] at end
    const points: LatLng[] = [
      [0, 0],
      [2, 2],
      [4, 0],
    ];
    expect(chaikinSmooth(points, 1)).toEqual([
      [0, 0],
      [0.5, 0.5],
      [1.5, 1.5],
      [2.5, 1.5],
      [3.5, 0.5],
      [4, 0],
    ]);
  });

  it("preserves the first and last points after multiple iterations", () => {
    const points: LatLng[] = [
      [10, 20],
      [30, 40],
      [50, 60],
    ];
    const result = chaikinSmooth(points, 5);
    expect(result[0]).toEqual([10, 20]);
    expect(result[result.length - 1]).toEqual([50, 60]);
  });

  it("doubles the point count per iteration for a 3-point input", () => {
    const points: LatLng[] = [
      [0, 0],
      [1, 1],
      [2, 0],
    ];
    expect(chaikinSmooth(points, 1)).toHaveLength(6); // 3 → 6
    expect(chaikinSmooth(points, 2)).toHaveLength(12); // 6 → 12
    expect(chaikinSmooth(points, 3)).toHaveLength(24); // 12 → 24
  });
});
