type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};

type GraphQLResult = {
  data: { bdt: { posts: { pageInfo: PageInfo } } };
};

type GraphQLParams = {
  first: number;
  after: string;
};

const pageInfosCollector = async (
  perPage: number,
  graphql: (query: string, params: GraphQLParams) => Promise<GraphQLResult>
): Promise<PageInfo[]> => {
  const result = await graphql(
    `
      query PaginatedFilmsQuery($first: Int, $after: String) {
        bdt {
          posts(where: { tag: "film" }, after: $after, first: $first) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `,
    { first: perPage, after: "" }
  );

  return [{ ...result.data.bdt.posts.pageInfo }];
};

export default pageInfosCollector;
