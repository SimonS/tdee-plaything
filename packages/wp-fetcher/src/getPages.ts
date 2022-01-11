import { request, gql } from "graphql-request";
import { PageInfo } from "@tdee/types/src/bdt";

interface WPPage {
  id: string;
  title: string;
  content: string;
  slug: string;
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
        id
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

export const getPage = async (id: string): Promise<WPPage> => {
  const query = gql`
  {page(id: "${id}") {
    id
    title
    content
    slug
  }}`;

  return await request("https://breakfastdinnertea.co.uk/graphql", query).then(
    (data: { page: WPPage }) => {
      return data.page;
    }
  );
};

export default getPages;
