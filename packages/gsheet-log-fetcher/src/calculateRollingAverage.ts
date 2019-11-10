import { CheckIn, ComputedCheckIn } from "@tdee/types/src/checkins";

const calculateRollingAverage = (
  checkIns: CheckIn[],
  windowSize?: number
): ComputedCheckIn[] =>
  checkIns.reduce<ComputedCheckIn[]>(
    (acc: ComputedCheckIn[], curr: CheckIn, i) => {
      const calculationWindow = [
        ...acc.slice(windowSize ? Math.max(0, i - windowSize + 1) : 0),
        curr
      ];

      const sum = calculationWindow.reduce<number>(
        (total, currentCheckIn) =>
          total + (currentCheckIn.weight ? currentCheckIn.weight : 0),
        0
      );

      return [
        ...acc,
        {
          ...curr,
          averageWeight:
            sum / calculationWindow.filter(checkIn => checkIn.weight).length
        }
      ];
    },
    []
  );

export default calculateRollingAverage;
