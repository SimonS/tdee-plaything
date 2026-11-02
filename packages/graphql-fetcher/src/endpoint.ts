// Override to build against another copy of the site, e.g. a local restore.
const graphqlEndpoint =
  process.env.BDT_GRAPHQL_URL ?? "https://breakfastdinnertea.co.uk/graphql";

export default graphqlEndpoint;
