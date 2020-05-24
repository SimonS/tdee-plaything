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
  const queryString = `
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
  `;

  let result = await graphql(queryString, { first: perPage, after: "" });
  let pageInfos = [{ ...result.data.bdt.posts.pageInfo }];

  while (result.data.bdt.posts.pageInfo.hasNextPage) {
    result = await graphql(queryString, {
      first: perPage,
      after: result.data.bdt.posts.pageInfo.endCursor,
    });
    pageInfos = [...pageInfos, { ...result.data.bdt.posts.pageInfo }];
  }

  return pageInfos;
};

export default pageInfosCollector;
