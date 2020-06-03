import React from "react";
import { highlighted, logo } from "./logo.module.css";

type LogoState = "Breakfast" | "Dinner" | "Tea" | undefined;
type LogoProps = { highlight?: LogoState };

const Logo = ({ highlight }: LogoProps): JSX.Element => (
  <div className={logo}>
    <span className={highlight === "Breakfast" ? highlighted : ""}>
      Breakfast
    </span>
    <span className={highlight === "Dinner" ? highlighted : ""}>Dinner</span>
    <span className={highlight === "Tea" ? highlighted : ""}>Tea</span>
  </div>
);

export default Logo;
