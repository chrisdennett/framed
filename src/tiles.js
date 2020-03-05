import React from "react";

//
// FIVE
//
export const getTileFive = ({
  width,
  height,
  x,
  y,
  lineColour = "#000",
  lineThickness
}) => {
  const halfHeight = height / 2;
  const halfWidth = width / 2;

  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={lineThickness}
    >
      <path
        d={`M ${0} ${halfHeight}
            Q ${halfWidth} ${halfHeight}
            , ${halfWidth} ${0}
          `}
      />

      <path
        d={`M ${halfWidth} ${height}
            Q ${halfWidth} ${halfHeight}
            , ${width} ${halfHeight}
          `}
      />
    </g>
  );
};

//
// FOUR
//
export const getTileFour = ({
  width,
  height,
  x,
  y,
  lineColour = "#000",
  lineThickness
}) => {
  const halfHeight = height / 2;
  const halfWidth = width / 2;

  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={lineThickness}
    >
      <path
        d={`M ${0} ${halfHeight}
            Q ${halfWidth} ${halfHeight}
            , ${halfWidth} ${height}
          `}
      />

      <path
        d={`M ${halfWidth} ${0}
            Q ${halfWidth} ${halfHeight}
            , ${width} ${halfHeight}
          `}
      />
    </g>
  );
};

//
// THREE
//
export const getTileThree = ({
  width,
  height,
  x,
  y,
  lineColour = "#000",
  lineThickness
}) => {
  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={lineThickness}
    >
      <line x1={width / 2} y1={0} x2={width / 2} y2={height} />
      <line x1={0} y1={height / 2} x2={width} y2={height / 2} />
    </g>
  );
};

//
// TWO
//
export const getTileTwo = ({
  width,
  height,
  x,
  y,
  lineColour = "#000",
  lineThickness
}) => {
  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={lineThickness}
    >
      <line x1={0} y1={height} x2={width} y2={0} />
    </g>
  );
};

//
// ONE
//
export const getTileOne = ({
  width,
  height,
  x,
  y,
  lineColour = "#000",
  lineThickness
}) => {
  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={lineThickness}
    >
      <line x1={0} y1={0} x2={width} y2={height} />
    </g>
  );
};
