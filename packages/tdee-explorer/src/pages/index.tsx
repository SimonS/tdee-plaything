import React from "react";
import BinDay from "../components/bin-day";
import Centered from "../layouts/centered";
import "../styles/global.css";

const IndexPage = (): JSX.Element => (
  <Centered>
    <div className="logo">BreakfastDinnerTea</div>
    <BinDay />
  </Centered>
);

export default IndexPage;
