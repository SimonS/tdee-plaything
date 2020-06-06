import React from "react";
import Layout from "../layouts/layout";

import BinDay from "../components/bin-day";

const IndexPage = ({
  location,
}: {
  location?: { pathname: string };
}): JSX.Element => (
  <Layout pathname={location?.pathname}>
    <BinDay />
  </Layout>
);

export default IndexPage;
