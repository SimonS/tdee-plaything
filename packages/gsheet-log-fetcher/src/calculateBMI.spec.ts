import calculateBMI from "./calculateBMI";

const checkIns = [
  {
    date: new Date(0),
    weight: 100,
  },
];

test("BMI is kg/m2, assuming default height of 1.75, calculate happy path", () => {
  expect(calculateBMI(checkIns)[0]).toMatchObject({
    BMI: 32.65,
  });
});
