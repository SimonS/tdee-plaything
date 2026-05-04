import { Activity } from "@tdee/types/src/bdt";
import getActivities from "./getActivities";

const getAllActivities = async (): Promise<Activity[]> => {
  let morePages = true;
  let allActivities: Activity[] = [];
  let next: string | undefined;

  while (morePages) {
    const { activities, meta } = await getActivities(next, "100");
    allActivities = [...allActivities, ...activities];
    morePages = meta.hasNextPage;
    next = meta.endCursor;
  }

  allActivities.sort((a, b) =>
    new Date(a.startDateLocalIso) < new Date(b.startDateLocalIso) ? -1 : 1,
  );

  return allActivities;
};

export default getAllActivities;
