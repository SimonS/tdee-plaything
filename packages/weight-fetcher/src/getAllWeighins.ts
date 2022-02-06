import { PageInfo, Weighin } from "@tdee/types/src/bdt";
import getWeighins from "./getWeighins";

const getAllWeighins = async () => {
  let morePages = true;
  let allWeighins: Weighin[] = [];
  let next;

  while (morePages) {
    const { weighins, meta } = await getWeighins(next);
    allWeighins = [...allWeighins, ...weighins];
    morePages = meta.hasNextPage;
    next = meta.endCursor;
  }

  return allWeighins;
};

export default getAllWeighins;
