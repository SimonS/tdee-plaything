/* source for this calculation: https://www.fourmilab.ch/hackdiet/e4/
 * calculates a weighted moving average day to day, with a 10% noise factor
 */

import { Weighin, CalculatedWeighin } from "@tdee/types/src/bdt";

/* floating point arithmetic is the worst */
const precisionRound = (number: number, precision: number) => {
  const factor = Math.pow(10, precision);
  const n = precision < 0 ? number : 0.01 / factor + number;
  return Math.round(n * factor) / factor;
};

const calculateTrends = (weighins: Weighin[]) =>
  weighins.reduce((acc: CalculatedWeighin[], today: Weighin, i) => {
    const sevenDaysAgo: Date = new Date(
      new Date(today.weighinTime).getTime() - 7 * 24 * 60 * 60 * 1000
    );

    const window = weighins
      .slice(i - 7 >= 0 ? i - 7 : 0, i + 1)
      .filter((day) => new Date(day.weighinTime) >= sevenDaysAgo);

    const newAcc = [...acc];

    newAcc.push({
      ...today,
      weightTrend: precisionRound(
        window.reduce((a, b) => a + b.weight, 0) / window.length,
        1
      ),
    });

    return newAcc;
  }, []);

export default calculateTrends;
