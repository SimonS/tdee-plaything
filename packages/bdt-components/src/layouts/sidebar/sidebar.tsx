import React from "react";
import * as layoutStyles from "./sidebar.module.css";

export type Side = "left" | "right";

const Sidebar = ({
  as = "div",
  children,
  side = "left",
  sideWidth,
}: {
  children: React.ReactElement[];
  side?: Side;
  sideWidth?: string;
  as?: keyof JSX.IntrinsicElements;
}): JSX.Element => {
  const Tag = as;
  return (
    <Tag
      className={`${layoutStyles.sidebar} ${
        side === "left" ? layoutStyles.left : layoutStyles.right
      }`}
    >
      <div>
        {children.map((child, i) => (
          <div
            key={`sidebar-item-${i}`}
            style={
              sideWidth && ((side === "left" && i === 0) || i === 1)
                ? { maxWidth: sideWidth }
                : undefined
            }
          >
            {child}
          </div>
        ))}
      </div>
    </Tag>
  );
};

export default Sidebar;
