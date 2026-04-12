import { aggregateData, groupBy, clamp } from "./collections";

test("groupBy groups by key", () => {
  const data = [
    { a: "1", val: "foo" },
    { a: "2", val: "foo" },
    { a: "1", val: "bar" },
  ];

  const result = groupBy(data, "a");

  expect(result["1"]).toHaveLength(2);
});

test("groupBy handles non-string keys", () => {
  const data = [
    { a: {}, val: "foo" },
    { a: {}, val: "foo2" },
    { a: "2", val: "foo" },
    { a: "1", val: "bar" },
  ];

  const result = groupBy(data, "a");

  expect(result).toStrictEqual({
    "1": [{ a: "1", val: "bar" }],
    "2": [{ a: "2", val: "foo" }],
  });
});

test("clamp returns value when within range", () => {
  expect(clamp(5, 0, 10)).toBe(5);
});

test("clamp returns min at exact lower boundary", () => {
  expect(clamp(0, 0, 10)).toBe(0); // kills value <= min mutation
});

test("clamp clamps to min when below range", () => {
  expect(clamp(-1, 0, 10)).toBe(0);
});

test("clamp returns max at exact upper boundary", () => {
  expect(clamp(10, 0, 10)).toBe(10); // kills value >= max mutation
});

test("clamp clamps to max when above range", () => {
  expect(clamp(11, 0, 10)).toBe(10);
});

test("aggregateData maps array length to value", () => {
  const data = { "1": ["foo", "bar"], "2": ["foo"] };

  const result = aggregateData(data);

  expect(result).toMatchObject([
    {
      day: "1",
      value: 2,
    },
    {
      day: "2",
      value: 1,
    },
  ]);
});
