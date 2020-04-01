import calculateRollingAverage from "./calculateRollingAverage";

const checkIns = [
  {
    date: new Date(0),
    weight: 200,
  },
  {
    date: new Date(1),
    weight: 300,
  },
  {
    date: new Date(2),
    weight: 400,
  },
  {
    date: new Date(3),
    weight: 400,
  },
  {
    date: new Date(4),
  },
];

test("first average weight should be same as weight", () => {
  expect(calculateRollingAverage(checkIns)[0]).toMatchObject({
    averageWeight: 200,
  });
});

test("basic averaging works", () => {
  expect(calculateRollingAverage(checkIns)[2]).toMatchObject({
    averageWeight: 300,
  });
});

test("we can add a window for averaging", () => {
  const averages = calculateRollingAverage(checkIns, 2);
  expect(averages[2]).toMatchObject({
    averageWeight: 350,
  });
  expect(averages[3]).toMatchObject({
    averageWeight: 400,
  });
});

test("it doesn't count missing weights in the average", () => {
  const averages = calculateRollingAverage(checkIns, 2);
  expect(averages[4]).toMatchObject({
    averageWeight: 400,
  });
});
