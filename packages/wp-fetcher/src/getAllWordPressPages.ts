import { WPPage } from "@tdee/types/src/bdt";
import getPages from "./getPages";

const getAllWordPressPages = async (): Promise<WPPage[]> => {
  const allPages: WPPage[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const { pages, meta } = await getPages(cursor);
    allPages.push(...pages);
    hasMore = meta.hasNextPage;
    cursor = meta.endCursor;
  }

  return allPages;
};

export default getAllWordPressPages;
