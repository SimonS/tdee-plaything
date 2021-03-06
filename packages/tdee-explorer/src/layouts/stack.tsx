import React, { ReactNode } from "react";
import * as layoutStyles from "./stack.module.css";

interface StackProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: ReactNode;
}

const Stack = ({
  as = "div",
  className,
  children,
}: StackProps): JSX.Element => {
  const Tag = as;

  return <Tag className={`${layoutStyles.stack} ${className}`}>{children}</Tag>;
};

export default Stack;
