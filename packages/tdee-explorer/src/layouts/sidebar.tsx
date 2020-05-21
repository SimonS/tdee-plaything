import React from "react";
import layoutStyles from "./sidebar.module.css";

const Sidebar = ({ children }): JSX.Element => (
  <div className={layoutStyles.sidebar}>
    <div>
      {children.map((child, i) => (
        <div key={`sidebar-item-${i}`}>{child}</div>
      ))}
    </div>
  </div>
);

export default Sidebar;
