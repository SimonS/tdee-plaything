import { WPPost } from "@tdee/types/src/bdt";
import getPosts from "./getPosts";

const getAllPosts = async (): Promise<WPPost[]> => {
  const allPosts: WPPost[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const { posts, meta } = await getPosts(cursor, "100");
    allPosts.push(...posts);
    hasMore = meta.hasNextPage;
    cursor = meta.endCursor;
  }

  return allPosts;
};

export default getAllPosts;
