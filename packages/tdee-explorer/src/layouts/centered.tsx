import React, { ReactNode } from "react";
import * as layoutStyles from "./centered.module.css";

type CenteredProps = {
  children: ReactNode;
  className?: string;
};

const Centered = ({ children, className }: CenteredProps): JSX.Element => (
  <div className={`${className} ${layoutStyles.centered}`}>{children}</div>
);

export default Centered;
