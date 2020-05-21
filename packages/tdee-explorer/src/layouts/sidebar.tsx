import React from "react";
import * as layoutStyles from "./sidebar.module.css";

const Sidebar = ({
  children,
}: {
  children: React.ReactElement[];
}): JSX.Element => (
  <div className={layoutStyles.sidebar}>
    <div>
      {children.map((child, i) => (
        <div key={`sidebar-item-${i}`}>{child}</div>
      ))}
    </div>
  </div>
);

export default Sidebar;
