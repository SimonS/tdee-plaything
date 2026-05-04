import { PageInfo, Activity } from "@tdee/types/src/bdt";
import getData from "@tdee/graphql-fetcher/src/getData";

export const whereClause =
  "{orderby: {field: START_DATE_LOCAL_ISO, order: DESC}}";

const getActivities = async (
  after?: string,
  first?: string,
): Promise<{ activities: Activity[]; meta: PageInfo }> => {
  const nodeName = "exercises";
  const fields = [
    "title",
    "activityType",
    "distanceMeters",
    "movingTimeSeconds",
    "startDateLocalIso",
  ];

  const { data: activities, meta } = await getData<Activity>(
    nodeName,
    fields,
    after,
    whereClause,
    first ?? "10",
  );

  return { activities, meta };
};

export default getActivities;
