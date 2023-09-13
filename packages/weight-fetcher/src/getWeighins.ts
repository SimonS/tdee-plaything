import { PageInfo, Weighin } from "@tdee/types/src/bdt";
import getData from "@tdee/graphql-fetcher/src/getData";

export const whereClause = "{orderby: {field: WEIGHIN_TIME, order: DESC}}";

const getWeighins = async (
  after?: string,
  first?: string
): Promise<{ weighins: Weighin[]; meta: PageInfo }> => {
  const nodeName = "weighins";
  const fields = ["weighinTime", "weight", "bodyFatPercentage"];

  const { data: weighins, meta } = await getData<Weighin>(
    nodeName,
    fields,
    after,
    whereClause,
    first ?? "10"
  );

  return {
    weighins,
    meta,
  };
};

export default getWeighins;
