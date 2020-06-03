import React, { useState, useEffect } from "react";
import { highlighted, logo } from "./logo.module.css";

type LogoState = "Breakfast" | "Dinner" | "Tea" | undefined;
type LogoProps = { highlight?: LogoState };

const Logo = ({ highlight }: LogoProps): JSX.Element => {
  const [highlightedMeal, setHighlightedMeal] = useState(highlight);

  useEffect(() => {
    if (highlight === undefined) {
      const hour = new Date().getHours();
      if (hour > 5 && hour <= 11) {
        setHighlightedMeal("Breakfast");
      } else if (hour <= 15) {
        setHighlightedMeal("Dinner");
      } else if (hour <= 22) {
        setHighlightedMeal("Tea");
      }
    }
  }, []);

  return (
    <div className={logo}>
      <span className={highlightedMeal === "Breakfast" ? highlighted : ""}>
        Breakfast
      </span>
      <span className={highlightedMeal === "Dinner" ? highlighted : ""}>
        Dinner
      </span>
      <span className={highlightedMeal === "Tea" ? highlighted : ""}>Tea</span>
    </div>
  );
};

export default Logo;
