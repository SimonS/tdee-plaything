import { Weighin, CalculatedWeighin } from "@tdee/types/src/bdt";
import getWeighins from "./getWeighins";
import calculateTrends from "./calculateTrends";

const getAllWeighins = async (processWeights = false) => {
  let morePages = true;
  let allWeighins: Weighin[] | CalculatedWeighin[] = [];
  let next;

  while (morePages) {
    const { weighins, meta } = await getWeighins(next, "100");
    allWeighins = [...allWeighins, ...weighins];
    morePages = meta.hasNextPage;
    next = meta.endCursor;
  }

  allWeighins.sort((a, b) =>
    new Date(a.weighinTime) < new Date(b.weighinTime) ? -1 : 1
  );

  return processWeights ? calculateTrends(allWeighins) : allWeighins;
};

export default getAllWeighins;
