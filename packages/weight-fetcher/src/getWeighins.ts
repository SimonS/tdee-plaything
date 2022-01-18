import { PageInfo, Weighin } from "@tdee/types/src/bdt";
import getData from "@tdee/graphql-fetcher/src/getData";

export const whereClause = "{orderby: {field: WEIGHIN_TIME, order: DESC}}";

const getWeighins = async (
  after?: string
): Promise<{ weighins: Weighin[]; meta: PageInfo }> => {
  const nodeName = "weighins";
  const fields = ["weighinTime", "weight", "bodyFatPercentage"];

  const { data: weighins, meta } = await getData<Weighin>(
    nodeName,
    fields,
    after,
    whereClause
  );

  return {
    weighins,
    meta,
  };
};

export default getWeighins;
