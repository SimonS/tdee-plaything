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
    const newAcc = [...acc];
    const yesterday = i > 0 ? acc[i - 1].weightTrend : today.weight;

    newAcc.push({
      ...today,
      weightTrend: precisionRound(
        yesterday + precisionRound(0.1 * (today.weight - yesterday), 1),
        1
      ),
    });

    return newAcc;
  }, []);

export default calculateTrends;