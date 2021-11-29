import React, { ReactNode } from "react";
import * as layoutStyles from "./stack.module.css";

interface StackProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  compressed?: boolean;
  children: ReactNode;
}

const Stack = ({
  as = "div",
  className,
  compressed = false,
  children,
}: StackProps): JSX.Element => {
  const Tag = as;

  return (
    <Tag
      className={`${layoutStyles.stack} ${
        compressed ? layoutStyles.compressed : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Stack;
