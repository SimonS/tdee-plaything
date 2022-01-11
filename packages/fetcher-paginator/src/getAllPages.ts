import { request, gql } from "graphql-request";

export const getAllPages = async (
  pageSize: number,
  nodeName: string,
  whereClause: string
): Promise<{ params: { pagenum: string }; props?: { after: string } }[]> => {
  const query = gql`
    query nextPage($first: Int, $after: String) {
      ${nodeName}(
        where: ${whereClause}
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
      return { meta: data.films.pageInfo };
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

export default getAllPages;
