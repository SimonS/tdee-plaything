import React from "react";
import layoutStyles from "./stack.module.css";

const stack = ({ as = "div", className, children }): JSX.Element => {
  const Tag = as;

  return <Tag className={`${layoutStyles.stack} ${className}`}>{children}</Tag>;
};

export default stack;
