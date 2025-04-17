import React, { useState, useEffect } from "react";
import { highlighted, logo } from "./logo.module.css";

export type LogoState = "Breakfast" | "Dinner" | "Tea" | undefined;
export type LogoProps = { highlight?: LogoState };

const useHighlightedMeal = (highlight: LogoState): LogoState => {
  const [highlightedMeal, setHighlightedMeal] = useState(highlight);

  useEffect(() => {
    if (highlight === undefined) {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) {
        setHighlightedMeal("Breakfast");
      } else if (hour < 15) {
        setHighlightedMeal("Dinner");
      } else {
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
    <a href="/" className={logo}>
      <span className={highlightedMeal === "Breakfast" ? highlighted : ""}>
        🥣 Breakfast
      </span>
      <span className={highlightedMeal === "Dinner" ? highlighted : ""}>
        🍴 Dinner
      </span>
      <span className={highlightedMeal === "Tea" ? highlighted : ""}>
        🫖 Tea
      </span>
    </a>
  );
};

export default Logo;
