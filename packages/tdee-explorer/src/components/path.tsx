import React, { useState } from "react";

const Path: React.FunctionComponent<{
  line: string;
  color: string;
  threshold?: number;
  legend: { x: number; y: number; text: string };
  initiallyHidden?: Boolean;
  activeDate?: Date;
  selected?: {
    date: Date;
    value: number;
    yPosition: number;
    xPosition: number;
  };
}> = ({
  line,
  color,
  legend,
  initiallyHidden = false,
  selected = null,
  threshold = null,
}) => {
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
        {selected && isVisible && ` - ${selected.value}`}
      </text>
      {threshold && (
        <linearGradient
          id="grad"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop stopColor="red" offset={0} />
          <stop stopColor="red" offset={threshold} />
          <stop stopColor="green" offset={threshold} />
          <stop stopColor="green" offset={1} />
        </linearGradient>
      )}
      <path
        fill="none"
        stroke={isVisible ? (threshold ? "url(#grad)" : color) : "none"}
        strokeWidth="2"
        d={line}
        pointerEvents="none"
      />
      {selected && selected.value && isVisible && (
        <circle
          r={7}
          fill="none"
          stroke={isVisible ? color : "none"}
          strokeWidth={2}
          cx={selected.xPosition}
          cy={selected.yPosition}
        />
      )}
    </>
  );
};

export default Path;
