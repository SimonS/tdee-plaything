import React from "react";

// abstract paths that are turn offable via checkbox. Maybe look in to d3 legends?
const Path: React.FunctionComponent<{
  line: string;
  color: string;
}> = ({ line, color }) => {
  return <path fill="none" stroke={color} strokeWidth="3" d={line} />;
};

export default Path;
