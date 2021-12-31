import { request, gql } from "graphql-request";

interface WPPage {
  title: string;
  content: string;
  slug: string;
}

interface PageInfo {
  endCursor: string;
  startCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const getPages = async (
  after?: string
): Promise<{ pages: WPPage[]; meta: PageInfo }> => {
  const query = gql`
  {
    pages(where: {playground: "true"}, first: 10, after: "${
      after ? after : ""
    }") {
      nodes {
        title
        content(format: RENDERED)
        slug
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

  const { pages, meta } = await request(
    "https://breakfastdinnertea.co.uk/graphql",
    query
  ).then((data: { pages: { nodes: WPPage[]; pageInfo: PageInfo } }) => {
    return { pages: data.pages.nodes, meta: data.pages.pageInfo };
  });

  return {
    pages,
    meta,
  };
};

export const getAllPages = async (
  pageSize: number
): Promise<{ params: { pagenum: string }; props?: { after: string } }[]> => {
  const query = gql`
    query nextPage($first: Int, $after: String) {
      pages(
        where: { orderby: { field: LISTEN_DATE, order: DESC } }
        first: $first
        after: $after
      ) {
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `;

  const getNextPage = async (after?: string) =>
    await request("https://breakfastdinnertea.co.uk/graphql", query, {
      first: pageSize,
      after: after ? after : "",
    }).then((data) => {
      return { meta: data.pages.pageInfo };
    });

  const countToObject = (count: number, meta: { endCursor: string }) => {
    return {
      params: { pagenum: count.toString() },
      props: { after: meta.endCursor },
    };
  };

  let count = 2;
  let { meta } = await getNextPage();

  const paths = [];
  paths.push({ params: { pagenum: "1" } });

  while (meta.hasNextPage) {
    paths.push(countToObject(count++, meta));
    ({ meta } = await getNextPage(meta.endCursor));
  }

  return paths;
};

export default getPages;
