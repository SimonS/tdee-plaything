import React, { useState, useRef, useEffect } from "react";

const Path: React.FunctionComponent<{
  line: string;
  color: string;
  legend: { x: number; y: number; text: string };
  initiallyHidden?: Boolean;
  activeDate?: Date;
  selected?: {
    date: Date;
    value: number;
    yPosition: number;
    xPosition: number;
  };
}> = ({ line, color, legend, initiallyHidden = false, selected = null }) => {
  const [isVisible, setVisible] = useState(!initiallyHidden);
  const [width, setWidth] = useState(0);
  const padding = 30;
  const size = 20;
  const labelRef = useRef(null);

  useEffect(() => {
    if (labelRef.current !== null) {
      setWidth(labelRef.current.getBBox().width);
    }
  }, [width])

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
      {selected && selected.value && isVisible && (
        <g
          transform={`translate(${selected.xPosition}, ${selected.yPosition})`}
        >
          <circle
            r={7}
            fill="none"
            stroke={isVisible ? color : "none"}
            strokeWidth={2}
          />

          <rect
            width={width}
            height={16}
            y="-8"
            x="10"
            stroke={color}
            strokeWidth={2}
            fill={color}
          ></rect>
          <text y="6" x="10" ref={labelRef} color="#fff">
            {selected.value}
          </text>
        </g>
      )}
    </>
  );
};

export default Path;
