import React from "react";
import Centered from "./centered";
import Sidebar from "./sidebar";
import Stack from "./stack";

import "../styles/global.css";

const Layout = ({ children }): JSX.Element => (
  <Centered className="layout">
    <Sidebar>
      <div className="logo">BreakfastDinnerTea</div>
      <Stack as="main">{children}</Stack>
    </Sidebar>
  </Centered>
);

export default Layout;
