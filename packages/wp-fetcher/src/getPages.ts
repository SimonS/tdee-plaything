import { request, gql } from "graphql-request";
import { PageInfo, WPPage } from "@tdee/types/src/bdt";
import getData from "@tdee/graphql-fetcher/src/getData";
import graphqlEndpoint from "@tdee/graphql-fetcher/src/endpoint";

const getPages = async (
  after?: string,
): Promise<{ pages: WPPage[]; meta: PageInfo }> => {
  const nodeName = "pages";
  const fields = ["id", "title", "content", "slug"];

  const { data: pages, meta } = await getData<WPPage>(nodeName, fields, after);

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

  return await request(graphqlEndpoint, query).then(
    (data: { page: WPPage }) => {
      return data.page;
    },
  );
};

export default getPages;
