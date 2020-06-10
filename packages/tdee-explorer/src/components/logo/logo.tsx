import React, { useState, useEffect } from "react";
import { highlighted, logo } from "./logo.module.css";
import { Link } from "gatsby";

export type LogoState = "Breakfast" | "Dinner" | "Tea" | undefined;
type LogoProps = { highlight?: LogoState };

const useHighlightedMeal = (highlight: LogoState): LogoState => {
  const [highlightedMeal, setHighlightedMeal] = useState(highlight);

  useEffect(() => {
    if (highlight === undefined) {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) {
        setHighlightedMeal("Breakfast");
      } else if (hour < 15) {
        setHighlightedMeal("Dinner");
      } else if (hour < 22) {
        setHighlightedMeal("Tea");
      }
    } else {
      setHighlightedMeal(highlight);
    }
  }, [highlight]);

  return highlightedMeal;
};

export const Logo = ({ highlight }: LogoProps): JSX.Element => {
  const highlightedMeal = useHighlightedMeal(highlight);

  return (
    <Link to="/" className={logo}>
      <span className={highlightedMeal === "Breakfast" ? highlighted : ""}>
        Breakfast
      </span>
      <span className={highlightedMeal === "Dinner" ? highlighted : ""}>
        Dinner
      </span>
      <span className={highlightedMeal === "Tea" ? highlighted : ""}>Tea</span>
    </Link>
  );
};

export default Logo;
