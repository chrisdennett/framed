import React from "react";
import styled from "styled-components";
import { generateBoxes } from "../utils";

const Display = ({ appData, sizeInfo, onClick }) => {
  const {
    outlineOnly,
    lineColour,
    lineThickness,
    boxWidth,
    boxHeight,
    boxesWide,
    boxesHigh,
    maxXOffset,
    maxYOffset,
    maxRotationOffset,
    effectMultipler
  } = appData;

  const extraWidthForRotations = boxWidth; // half box each side (rough guess)
  const extraWidthForXOffset = maxXOffset * 2;
  const totalExtraHeight =
    maxYOffset * 2 * effectMultipler + extraWidthForRotations;
  const totalExtraWidth =
    extraWidthForRotations + extraWidthForXOffset * effectMultipler;
  const halfExtraWidth = totalExtraWidth / 2;
  const halfExtraHeight = totalExtraHeight / 2;

  const boxes = generateBoxes({
    outlineOnly,
    boxWidth,
    boxHeight,
    boxesWide,
    boxesHigh,
    maxXOffset,
    maxYOffset,
    maxRotationOffset,
    effectMultipler
  });

  const svgWidth = totalExtraWidth + boxWidth * boxesWide;
  const svgHeight = totalExtraHeight + boxHeight * boxesHigh;

  const { height: maxHeight, width: maxWidth } = sizeInfo; // holding element dimensions
  const svgPadding = 0.07 * maxHeight; // padding around edge of
  const svgHeightToWidthRatio = svgWidth / svgHeight;
  const svgWidthHeightRatio = svgHeight / svgWidth;

  // Figure out holder dimensions to surround SVG
  let holderHeight, holderWidth;
  holderWidth = maxWidth - svgPadding;
  holderHeight = holderWidth * svgWidthHeightRatio;

  if (holderHeight > maxHeight) {
    holderHeight = maxHeight - svgPadding;
    holderWidth = holderHeight * svgHeightToWidthRatio;
  }

  return (
    <Container>
      <SvgHolder
        id="svgHolder"
        style={{ width: holderWidth, height: holderHeight }}
      >
        <MainSVG
          style={{ padding: 20 }}
          onClick={onClick}
          className="mainSVG"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <g
            stroke={lineColour}
            fill={"none"}
            strokeWidth={lineThickness}
            transform={`translate(${halfExtraWidth} ${halfExtraHeight / 2})`}
          >
            {boxes}
          </g>
        </MainSVG>
      </SvgHolder>
    </Container>
  );
};

export default Display;

// STYLES
const Container = styled.div`
  background: #fff;
  border-radius: 10px;
  background-image: url(./img/cutting-mat-tile.png);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SvgHolder = styled.div`
  display: flex;
`;

const MainSVG = styled.svg`
  background: white;
  border-radius: 5px;
  flex: 1;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
`;
