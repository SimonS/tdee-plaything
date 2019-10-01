import calculateRollingAverage from "./calculateRollingAverage";

const checkIns = [
  {
    date: new Date(),
    weight: 200
  },
  {
    date: new Date(),
    weight: 300
  },
  {
    date: new Date(),
    weight: 400
  },
  {
    date: new Date(),
    weight: 400
  }
];

test("first average weight should be same as weight", () => {
  expect(calculateRollingAverage(checkIns)[0]).toMatchObject({
    averageWeight: 200
  });
});

test("basic averaging works", () => {
  expect(calculateRollingAverage(checkIns)[2]).toMatchObject({
    averageWeight: 300
  });
});

test("we can add a window for averaging", () => {
  expect(calculateRollingAverage(checkIns, 2)[2]).toMatchObject({
    averageWeight: 350
  });
  expect(calculateRollingAverage(checkIns, 2)[3]).toMatchObject({
    averageWeight: 400
  });
});
