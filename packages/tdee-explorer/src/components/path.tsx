import React, { useState } from "react";

const Path: React.FunctionComponent<{
  line: string;
  color: string;
  legend: { x: number; y: number; text: string };
  initiallyHidden?: Boolean;
}> = ({ line, color, legend, initiallyHidden = false }) => {
  const [isVisible, setVisible] = useState(!initiallyHidden);
  const padding = 30;
  const size = 20;

  return (
    <>
      <rect
        x={legend.x}
        y={legend.y}
        width={size}
        height={size}
        fill={isVisible ? color : "transparent"}
        stroke={color}
        onClick={() => {
          setVisible(!isVisible);
        }}
      />
      <text x={legend.x + padding} y={legend.y + size * 0.75} fill={color}>
        {legend.text}
      </text>
      <path
        fill="none"
        stroke={isVisible ? color : "none"}
        strokeWidth="3"
        d={line}
        pointerEvents="none"
      />
    </>
  );
};

export default Path;
