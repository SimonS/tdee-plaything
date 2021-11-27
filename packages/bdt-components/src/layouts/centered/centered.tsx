import React, { ReactNode } from "react";
import { centered } from "./centered.module.css";

type CenteredProps = {
  children: ReactNode;
  className?: string;
};

const Centered = ({ children, className = "" }: CenteredProps): JSX.Element => (
  <div className={`${className} ${centered}`}>{children}</div>
);

export default Centered;
