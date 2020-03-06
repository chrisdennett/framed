import React from "react";

//
// WORMS
//
// worm helpers
const getWormNums = ({ width, height }) => {
  const oneThirdWidth = width / 3;
  const oneThirdHeight = height / 3;
  const twoThirdsWidth = oneThirdWidth * 2;
  const twoThirdsHeight = oneThirdHeight * 2;
  return { oneThirdWidth, twoThirdsWidth, oneThirdHeight, twoThirdsHeight };
};
const getVerticalWorm = ({ oneThirdWidth, twoThirdsWidth, height }) => (
  <g>
    <rect
      stroke={"none"}
      x={oneThirdWidth}
      y={0}
      width={twoThirdsWidth - oneThirdWidth}
      height={height}
    />
    <line x1={oneThirdWidth} x2={oneThirdWidth} y1={0} y2={height} />
    <line x1={twoThirdsWidth} x2={twoThirdsWidth} y1={0} y2={height} />
  </g>
);
const getHorizontalWorm = ({ oneThirdHeight, twoThirdsHeight, width }) => (
  <g>
    <rect
      stroke={"none"}
      x={0}
      y={oneThirdHeight}
      width={width}
      height={twoThirdsHeight - oneThirdHeight}
    />
    <line x1={0} x2={width} y1={oneThirdHeight} y2={oneThirdHeight} />
    <line x1={0} x2={width} y1={twoThirdsHeight} y2={twoThirdsHeight} />
  </g>
);
const getTopWormEnd = ({ oneThirdWidth, twoThirdsWidth, oneThirdHeight }) => (
  <g>
    <path
      d={` M ${oneThirdWidth} 0 
        C ${oneThirdWidth} ${oneThirdHeight}
          ${twoThirdsWidth} ${oneThirdHeight}
          ${twoThirdsWidth} 0
      `}
    />
  </g>
);
const getBottomWormEnd = ({
  height,
  oneThirdWidth,
  twoThirdsWidth,
  oneThirdHeight
}) => (
  <g>
    <path
      d={` M ${oneThirdWidth} ${height} 
        C ${oneThirdWidth} ${height - oneThirdHeight}
          ${twoThirdsWidth} ${height - oneThirdHeight}
          ${twoThirdsWidth} ${height}
      `}
    />
  </g>
);
const getLeftWormEnd = ({ oneThirdHeight, twoThirdsHeight, oneThirdWidth }) => (
  <g>
    <path
      d={` 
        M ${0} ${oneThirdHeight}
        C ${oneThirdWidth} ${oneThirdHeight}
          ${oneThirdWidth} ${twoThirdsHeight}
          ${0} ${twoThirdsHeight}
      `}
    />
  </g>
);
const getRightWormEnd = ({
  width,
  oneThirdHeight,
  twoThirdsHeight,
  oneThirdWidth
}) => (
  <g>
    <path
      d={` 
        M ${width} ${oneThirdHeight}
        C ${width - oneThirdWidth} ${oneThirdHeight}
          ${width - oneThirdWidth} ${twoThirdsHeight}
          ${width} ${twoThirdsHeight}
      `}
    />
  </g>
);

export const getWormLine2 = ({
  width,
  height,
  x,
  y,
  lineColour = "#000",
  fill = "#fff"
}) => {
  const {
    oneThirdWidth,
    twoThirdsWidth,
    oneThirdHeight,
    twoThirdsHeight
  } = getWormNums({ width, height });

  const vertWorm = getVerticalWorm({
    oneThirdWidth,
    twoThirdsWidth,
    height
  });

  const leftEnd = getLeftWormEnd({
    oneThirdHeight,
    twoThirdsHeight,
    oneThirdWidth
  });
  const rightEnd = getRightWormEnd({
    width,
    oneThirdHeight,
    twoThirdsHeight,
    oneThirdWidth
  });

  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={10}
      strokeLinejoin="round"
      fill={fill}
    >
      {leftEnd}
      {vertWorm}
      {rightEnd}
    </g>
  );
};
export const getWormLine1 = ({
  width,
  height,
  x,
  y,
  lineColour = "#000",
  fill = "#fff"
}) => {
  const {
    oneThirdWidth,
    twoThirdsWidth,
    oneThirdHeight,
    twoThirdsHeight
  } = getWormNums({ width, height });

  const horzWorm = getHorizontalWorm({
    oneThirdHeight,
    twoThirdsHeight,
    width
  });

  const topEnd = getTopWormEnd({
    oneThirdWidth,
    twoThirdsWidth,
    oneThirdHeight
  });
  const bottomEnd = getBottomWormEnd({
    height,
    oneThirdWidth,
    twoThirdsWidth,
    oneThirdHeight
  });

  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={10}
      strokeLinejoin="round"
      fill={fill}
    >
      {topEnd}
      {horzWorm}
      {bottomEnd}
    </g>
  );
};
export const getWormCross2 = ({
  width,
  height,
  x,
  y,
  lineColour = "#000",
  fill = "#fff"
}) => {
  const {
    oneThirdWidth,
    twoThirdsWidth,
    oneThirdHeight,
    twoThirdsHeight
  } = getWormNums({ width, height });

  const vertWorm = getVerticalWorm({ oneThirdWidth, twoThirdsWidth, height });
  const horzWorm = getHorizontalWorm({
    oneThirdHeight,
    twoThirdsHeight,
    width
  });

  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={10}
      strokeLinejoin="round"
      fill={fill}
    >
      {horzWorm}
      {vertWorm}
    </g>
  );
};
export const getWormCross1 = ({
  width,
  height,
  x,
  y,
  lineColour = "#000",
  fill = "#fff"
}) => {
  const {
    oneThirdWidth,
    twoThirdsWidth,
    oneThirdHeight,
    twoThirdsHeight
  } = getWormNums({ width, height });

  const vertWorm = getVerticalWorm({ oneThirdWidth, twoThirdsWidth, height });
  const horzWorm = getHorizontalWorm({
    oneThirdHeight,
    twoThirdsHeight,
    width
  });

  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={10}
      strokeLinejoin="round"
      fill={fill}
    >
      {vertWorm}
      {horzWorm}
    </g>
  );
};

//
// NINE
//
export const getTileNine = ({ width, height, x, y, lineColour = "#000" }) => {
  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={10}
      strokeLinejoin="round"
      fill={lineColour}
    >
      <polygon points={`${0},${0} ${width},${height} ${0},${height}`} />
    </g>
  );
};

//
// EIGHT
//
export const getTileEight = ({ width, height, x, y, lineColour = "#000" }) => {
  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={10}
      fill={lineColour}
    >
      <polygon points={`${0},${height} ${width},${0} ${width},${height}`} />
    </g>
  );
};

//
// SEVEN
//
export const getTileSeven = ({ width, height, x, y, lineColour = "#000" }) => {
  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={10}
      fill={lineColour}
    >
      <polygon points={`0,0 ${width},${0} ${0},${height}`} />
    </g>
  );
};

//
// SIX
//
export const getTileSix = ({ width, height, x, y, lineColour = "#000" }) => {
  return (
    <g
      key={`x${x},y${y}`}
      transform={`translate(${x} ${y})`}
      stroke={lineColour}
      strokeWidth={10}
      fill={lineColour}
    >
      <polygon points={`0,0 ${width},${0} ${width},${height}`} />
    </g>
  );
};

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
