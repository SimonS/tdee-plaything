import { aggregateData, groupBy } from "./collections";

test("groupBy groups by key", () => {
  const data = [
    { a: "1", val: "foo" },
    { a: "2", val: "foo" },
    { a: "1", val: "bar" },
  ];

  const result = groupBy(data, "a");

  expect(result["1"]).toHaveLength(2);
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
