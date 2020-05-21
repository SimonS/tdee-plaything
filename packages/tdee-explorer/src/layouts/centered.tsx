import React from "react";
import layoutStyles from "./centered.module.css";

const Layout = ({ children, className }): JSX.Element => (
  <div className={`${className} ${layoutStyles.centered}`}>{children}</div>
);

export default Layout;
