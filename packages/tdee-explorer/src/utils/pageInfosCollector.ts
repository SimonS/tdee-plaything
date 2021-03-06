type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  after?: string;
};

type GraphQLResult = {
  data: { bdt: { films: { pageInfo: PageInfo } } };
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
        films(
            where: { orderby: { field: DATE_WATCHED, order: DESC } },
            after: $after, 
            first: $first
        ) {
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
    { ...result.data.bdt.films.pageInfo, after: "" },
  ];

  while (result.data.bdt.films.pageInfo.hasNextPage) {
    const after = pageInfos[pageInfos.length - 1].endCursor;

    result = await getNextPage(result.data.bdt.films.pageInfo.endCursor);
    pageInfos = [
      ...pageInfos,
      { ...result.data.bdt.films.pageInfo, after: after },
    ];
  }

  return pageInfos;
};

export default pageInfosCollector;
