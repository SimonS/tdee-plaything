import { request, gql } from "graphql-request";
import { PageInfo, WPPage } from "@tdee/types/src/bdt";
import getData from "@tdee/graphql-fetcher/src/getData";

const getPages = async (
  after?: string
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

  return await request("https://breakfastdinnertea.co.uk/graphql", query).then(
    (data: { page: WPPage }) => {
      return data.page;
    }
  );
};

export default getPages;
