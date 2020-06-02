type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  after?: string;
};

type GraphQLResult = {
  data: { bdt: { posts: { pageInfo: PageInfo } } };
};

type GraphQLParams = {
  first: number;
  after: string;
};

// For static publishing, we need to have a fair understanding of what the
// cursor links will be pre-runtime. This helper function cycles through ahead
// of time to amass what each page will look like. I expect we could do
// everything more efficiently all at once, but I quite like the separation of
// concerns.
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

  const getNextPage = async (after = ""): Promise<GraphQLResult> =>
    await graphql(queryString, { first: perPage, after: after });

  let result = await getNextPage();
  let pageInfos: PageInfo[] = [
    { ...result.data.bdt.posts.pageInfo, after: "" },
  ];

  while (result.data.bdt.posts.pageInfo.hasNextPage) {
    const after = pageInfos[pageInfos.length - 1].endCursor;

    result = await getNextPage(result.data.bdt.posts.pageInfo.endCursor);
    pageInfos = [
      ...pageInfos,
      { ...result.data.bdt.posts.pageInfo, after: after },
    ];
  }

  return pageInfos;
};

export default pageInfosCollector;
