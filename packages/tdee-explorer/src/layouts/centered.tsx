import React from "react";
import layoutStyles from "./centered.module.css";

const layout = ({ children }): JSX.Element => (
  <div className={`layout ${layoutStyles.centered}`}>{children}</div>
);

export default layout;
