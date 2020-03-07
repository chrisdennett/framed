import React from "react";

export const generateBoxes = ({
  boxWidth,
  boxHeight,
  boxesWide,
  boxesHigh,
  maxXOffset = 20,
  maxYOffset = 10,
  maxRotationOffset = 20
}) => {
  let boxes = [];

  const gridHeight = boxHeight * boxesHigh;
  const halfBoxWidth = boxWidth / 2;
  const halfBoxHeight = boxHeight / 2;

  for (let y = 0; y < boxesHigh; y++) {
    for (let x = 0; x < boxesWide; x++) {
      const boxX = x * boxWidth;
      const boxY = y * boxHeight;

      var rotation = getPositionBasedRandom({
        y: boxY,
        gridHeight,
        maxOffset: maxRotationOffset
      });
      var xOffset = getPositionBasedRandom({
        y: boxY,
        gridHeight,
        maxOffset: maxXOffset
      });
      var yOffset = getPositionBasedRandom({
        y: boxY,
        gridHeight,
        maxOffset: maxYOffset
      });

      boxes.push(
        <g transform={`translate(${boxX} ${boxY})`} key={`x${boxX}y${boxY}`}>
          <g
            transform={`translate(${xOffset} ${yOffset}) rotate(${rotation} ${halfBoxWidth} ${halfBoxHeight})`}
          >
            <rect
              x={0}
              y={0}
              width={boxWidth}
              height={boxHeight}
              fill={"#fff"}
            />
          </g>
        </g>
      );
    }
  }

  return boxes;
};

const getPositionBasedRandom = ({ y, gridHeight, maxOffset }) => {
  const distancefractionFromTop = y / gridHeight;
  const distanceBasedMaxOffset = maxOffset * distancefractionFromTop;

  return getRandomBetween(-distanceBasedMaxOffset, distanceBasedMaxOffset);
};

const getRandomBetween = (min, max) => {
  const randFraction = Math.random();
  return min + randFraction * (max - min);
};
