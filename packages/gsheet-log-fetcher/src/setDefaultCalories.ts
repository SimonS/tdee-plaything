import { CheckIn } from '@tdee/types/src/checkins';

const setDefaultCalories = (checkIns: CheckIn[], calories = 6000): CheckIn[] => checkIns
  .map((checkIn) => ({
    ...checkIn,
    calories: checkIn.calories || calories,
  }));

export default setDefaultCalories;
