import React from "react";
import styled from "styled-components";

const Display = ({ appData, sizeInfo, onClick }) => {
  const {
    outlineOnly,
    mountainColour,
    bgColour,
    lineColour,
    lineThickness,
    boxWidth,
    boxHeight,
    boxesWide,
    boxesHigh,
    maxPeakHeightFraction,
    flatWidthFraction
  } = appData;

  const maxPeakHeight = boxesHigh * 20 * maxPeakHeightFraction;
  const svgWidth = boxesWide * boxWidth;
  const svgHeight = boxHeight * boxesHigh + maxPeakHeight;
  const flatWidth = flatWidthFraction * svgWidth;

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

  const lineData = generateLinePoints({
    boxWidth,
    boxHeight,
    boxesWide,
    boxesHigh,
    maxPeakHeight,
    flatWidth
  });

  const lines = generateLines({ lineData, boxHeight, boxWidth });

  return (
    <Container>
      <SvgHolder
        id="svgHolder"
        style={{ width: holderWidth, height: holderHeight }}
      >
        <MainSVG
          onClick={onClick}
          className="mainSVG"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ background: bgColour, padding: "0 40px" }}
        >
          <g
            stroke={lineColour}
            fill={mountainColour}
            strokeWidth={lineThickness}
            transform={`translate(${0} ${maxPeakHeight})`}
          >
            {lines}
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

const generateLinePoints = ({
  boxWidth,
  boxHeight,
  boxesWide,
  boxesHigh,
  maxPeakHeight,
  flatWidth
}) => {
  let points = [];
  let ptData, line;
  const fullWidth = boxWidth * boxesWide;
  const halfWidth = fullWidth / 2;

  for (let y = 0; y < boxesHigh; y++) {
    // for each row add the point data
    line = [];
    for (let x = 0; x <= boxesWide; x++) {
      const boxX = x * boxWidth;
      const boxY = y * boxHeight;
      // get random based on dist from center
      const distFromCenter = Math.abs(halfWidth - boxX) + flatWidth;
      const frac = 1 - distFromCenter / halfWidth;
      let offset = maxPeakHeight * frac * Math.random();

      if (boxX < flatWidth || boxX > fullWidth - flatWidth) {
        offset *= 0.2;
      }

      ptData = {
        x: boxX,
        y: boxY - offset,
        boxWidth,
        boxHeight
      };

      line.push(ptData);
    }

    points.push(line);
  }

  return points;
};

const generateLines = ({ lineData, boxHeight, boxWidth }) => {
  const cPtSize = boxWidth / 2.5;

  return lineData.map((ptsArr, index) => {
    let d = `M ${0} ${index * boxHeight}`;

    for (let i = 1; i < ptsArr.length; i++) {
      const prevPt = ptsArr[i - 1];
      const pt = ptsArr[i];

      d += `C ${prevPt.x + cPtSize},${prevPt.y}
              ${pt.x - cPtSize},${pt.y}
              ${pt.x}, ${pt.y}
            `;
    }

    return (
      <g key={index}>
        <path d={d} />
      </g>
    );
  });
};
