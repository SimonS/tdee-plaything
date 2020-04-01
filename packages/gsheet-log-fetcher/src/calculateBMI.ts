import { ComputedCheckIn } from "@tdee/types/src/checkins";

const calculateBMI = (checkIns: ComputedCheckIn[]): ComputedCheckIn[] =>
  checkIns.map((checkIn) =>
    checkIn.weight
      ? {
          ...checkIn,
          BMI: parseFloat((checkIn.weight / (1.75 * 1.75)).toFixed(2)),
        }
      : checkIn
  );

export default calculateBMI;
