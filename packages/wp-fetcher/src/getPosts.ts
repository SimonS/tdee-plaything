import getData from "@tdee/graphql-fetcher/src/getData";
import { PageInfo, WPPost } from "@tdee/types/src/bdt";

const whereClause = "{orderby: {field: DATE, order: DESC}}";
const fields = [
  "id",
  "title",
  "slug",
  "date",
  "excerpt",
  "content",
  "tags { nodes { name slug } }",
  "categories { nodes { name slug } }",
];

const getPosts = async (
  after?: string,
  first?: string,
): Promise<{ posts: WPPost[]; meta: PageInfo }> => {
  const { data: posts, meta } = await getData<WPPost>(
    "posts",
    fields,
    after,
    whereClause,
    first ?? "10",
  );

  return { posts, meta };
};

export default getPosts;
