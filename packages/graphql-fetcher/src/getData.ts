import { request, gql } from "graphql-request";
import { PageInfo } from "@tdee/types/src/bdt";

const getData = async <T>(
  nodeName: string,
  whereClause: string,
  fields: string[],
  after?: string
): Promise<{ data: T[]; meta: PageInfo }> => {
  const query = gql`
  {
    ${nodeName}(where: ${whereClause}, first: 10, after: "${
    after ? after : ""
  }") {
      nodes {
        ${fields.join("\n")}
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

  const { data, meta } = await request(
    "https://breakfastdinnertea.co.uk/graphql",
    query
  ).then((data: { [nodeName: string]: { nodes: T[]; pageInfo: PageInfo } }) => {
    return { data: data[nodeName].nodes, meta: data[nodeName].pageInfo };
  });

  return {
    data,
    meta,
  };
};

export default getData;
