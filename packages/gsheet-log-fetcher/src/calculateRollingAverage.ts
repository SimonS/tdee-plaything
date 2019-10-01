import { ICheckIn, IComputedCheckIn } from "@tdee/types/src/checkins";

const calculateRollingAverage = (checkIns: ICheckIn[], windowSize?: number) =>
  checkIns.reduce<IComputedCheckIn[]>(
    (acc: IComputedCheckIn[], curr: ICheckIn, i) => {
      const calculationWindow = [
        ...acc.slice(windowSize ? Math.max(0, i - windowSize + 1) : 0),
        curr
      ];

      const sum = calculationWindow.reduce<number>(
        (acc, currentCheckIn) =>
          acc + (currentCheckIn.weight ? currentCheckIn.weight : 0),
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
