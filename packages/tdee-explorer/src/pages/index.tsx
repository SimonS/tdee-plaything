import React from "react";
import BinDay from "../components/bin-day";
import Centered from "../layouts/centered";
import Sidebar from "../layouts/sidebar";
import "../styles/global.css";

const IndexPage = (): JSX.Element => (
  <Centered>
    <Sidebar>
      <div className="logo">BreakfastDinnerTea</div>
      <BinDay />
    </Sidebar>
  </Centered>
);

export default IndexPage;
