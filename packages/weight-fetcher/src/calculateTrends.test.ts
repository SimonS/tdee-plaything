import calculateTrends from "./calculateTrends";

test("given a one item array, returns only the extra field", () => {
  expect(
    calculateTrends([
      {
        weight: 170,
        weighinTime: "2021-12-22T08:02:00+0000",
        bodyFatPercentage: 20,
      },
    ])[0]
  ).toMatchObject({
    weight: 170,
    weighinTime: "2021-12-22T08:02:00+0000",
    bodyFatPercentage: 20,
    weightTrend: 170,
  });
});

test("calculates the trend line based on basic source data", () => {
  expect(
    calculateTrends([
      {
        weight: 173.6,
        weighinTime: "2021-12-21T08:02:00+0000",
        bodyFatPercentage: 20,
      },
      {
        weight: 172.5,
        weighinTime: "2021-12-22T08:02:00+0000",
        bodyFatPercentage: 20,
      },
      {
        weight: 171.5,
        weighinTime: "2021-12-23T08:02:00+0000",
        bodyFatPercentage: 20,
      },
      {
        weight: 172,
        weighinTime: "2021-12-24T08:02:00+0000",
        bodyFatPercentage: 20,
      },
      {
        weight: 171.5,
        weighinTime: "2021-12-25T08:02:00+0000",
        bodyFatPercentage: 20,
      },
    ]).map((weight) => weight.weightTrend)
  ).toEqual([173.6, 173.1, 172.5, 172.4, 172.2]);
});

test("trend line ignores values more than a week ago", () => {
  expect(
    calculateTrends([
      {
        weight: 190.6,
        weighinTime: "2020-12-21T08:02:00+0000",
        bodyFatPercentage: 20,
      },
      {
        weight: 173.6,
        weighinTime: "2021-12-21T08:02:00+0000",
        bodyFatPercentage: 20,
      },
      {
        weight: 172.5,
        weighinTime: "2021-12-22T08:02:00+0000",
        bodyFatPercentage: 20,
      },
      {
        weight: 171.5,
        weighinTime: "2021-12-23T08:02:00+0000",
        bodyFatPercentage: 20,
      },
      {
        weight: 172,
        weighinTime: "2021-12-24T08:02:00+0000",
        bodyFatPercentage: 20,
      },
      {
        weight: 171.5,
        weighinTime: "2021-12-25T08:02:00+0000",
        bodyFatPercentage: 20,
      },
    ]).map((weight) => weight.weightTrend)
  ).toEqual([190.6, 173.6, 173.1, 172.5, 172.4, 172.2]);
});
