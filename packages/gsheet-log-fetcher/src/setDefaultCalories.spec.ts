import setDefaultCalories from './setDefaultCalories';

const checkIn = {
  date: new Date(),
  weight: 200,
};

test('default calories to 6000', () => {
  expect(setDefaultCalories([checkIn])[0]).toMatchObject({ calories: 6000 });
});

test('accept alternate default amount', () => {
  expect(setDefaultCalories([checkIn], 420)[0]).toMatchObject({
    calories: 420,
  });
});
