import calculateTrends from "./calculateTrends";

test("given a one item array, returns only the extra field", () => {
  expect(
    calculateTrends([
      { weight: 170, weighinTime: "", bodyFatPercentage: 20 },
    ])[0]
  ).toMatchObject({
    weight: 170,
    weighinTime: "",
    bodyFatPercentage: 20,
    weightTrend: 170,
  });
});

test("calculates the trend line based on basic source data", () => {
  expect(
    calculateTrends([
      { weight: 173.6, weighinTime: "", bodyFatPercentage: 20 },
      { weight: 172.5, weighinTime: "", bodyFatPercentage: 20 },
      { weight: 171.5, weighinTime: "", bodyFatPercentage: 20 },
      { weight: 172, weighinTime: "", bodyFatPercentage: 20 },
      { weight: 171.5, weighinTime: "", bodyFatPercentage: 20 },
    ]).map((weight) => weight.weightTrend)
  ).toEqual([173.6, 173.5, 173.3, 173.2, 173]);
});
