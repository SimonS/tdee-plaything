import { decodePolyline } from "./decodePolyline";

describe("decodePolyline", () => {
  it("decodes an empty string to an empty array", () => {
    expect(decodePolyline("")).toEqual([]);
  });

  it("decodes a single point", () => {
    // Encoded form of [[-17.96584, 0.0]] per Google algorithm
    const result = decodePolyline("n}slB?");
    expect(result).toHaveLength(1);
    expect(result[0][0]).toBeCloseTo(-17.96584, 4);
    expect(result[0][1]).toBeCloseTo(0.0, 4);
  });

  it("decodes two points (Google example)", () => {
    // Google's documented example: [[38.5,-120.2],[40.7,-120.95]]
    // Encoded: "_p~iF~ps|U_ulLnnqC"
    const result = decodePolyline("_p~iF~ps|U_ulLnnqC");
    expect(result).toHaveLength(2);
    expect(result[0][0]).toBeCloseTo(38.5, 4);
    expect(result[0][1]).toBeCloseTo(-120.2, 4);
    expect(result[1][0]).toBeCloseTo(40.7, 4);
    expect(result[1][1]).toBeCloseTo(-120.95, 4);
  });

  it("decodes three points (Google example)", () => {
    // Google's full example: [[38.5,-120.2],[40.7,-120.95],[43.252,-126.453]]
    // Encoded: "_p~iF~ps|U_ulLnnqC_mqNvxq`@"
    const result = decodePolyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@");
    expect(result).toHaveLength(3);
    expect(result[2][0]).toBeCloseTo(43.252, 4);
    expect(result[2][1]).toBeCloseTo(-126.453, 4);
  });

  it("returns lat as first element and lng as second", () => {
    const result = decodePolyline("_p~iF~ps|U");
    const [lat, lng] = result[0];
    expect(lat).toBeCloseTo(38.5, 4);
    expect(lng).toBeCloseTo(-120.2, 4);
  });

  it("decodes a point with zero-valued continuation chunks in the lng", () => {
    // lng=0.16384 encodes to '___@' which has continuation bytes with value exactly 0x20
    // (low 5 bits all zero but continuation bit set) — exercises the >= 0x20 boundary
    const result = decodePolyline("?___@");
    expect(result).toHaveLength(1);
    expect(result[0][0]).toBeCloseTo(0.0, 4);
    expect(result[0][1]).toBeCloseTo(0.16384, 4);
  });
});
