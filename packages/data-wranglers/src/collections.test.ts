import { groupBy } from "./collections";

test("groupBy groups by key", () => {
  const data = [
    { a: "1", val: "foo" },
    { a: "2", val: "foo" },
    { a: "1", val: "bar" },
  ];

  const result = groupBy(data, "a");

  expect(result["1"]).toHaveLength(2);
});
