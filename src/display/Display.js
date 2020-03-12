import React from "react";
import styled from "styled-components";

const Display = ({ appData, sizeInfo, onClick }) => {
  const {
    outlineOnly,
    diffMountainColour,
    mountainColour,
    bgColour,
    lineColour,
    lineThickness,
    totalPeakWiggles,
    totalFlatWiggles,
    totalLines,
    wiggleWidth,
    lineSpacing,
    maxPeakHeight,
    maxFlatWiggleHeight
  } = appData;

  const totalWiggles = totalPeakWiggles + totalFlatWiggles * 2 + 2;
  const svgWidth = totalWiggles * wiggleWidth;
  const svgHeight = lineSpacing * totalLines + maxPeakHeight;

  const { height: maxHeight, width: maxWidth } = sizeInfo; // holding element dimensions
  const svgPadding = 0.07 * maxHeight; // padding around edge of
  const svgHeightToWidthRatio = svgWidth / svgHeight;
  const svgWidthHeightRatio = svgHeight / svgWidth;

  // // Figure out holder dimensions to surround SVG
  let holderHeight, holderWidth;
  holderWidth = maxWidth - svgPadding;
  holderHeight = holderWidth * svgWidthHeightRatio;

  if (holderHeight > maxHeight) {
    holderHeight = maxHeight - svgPadding;
    holderWidth = holderHeight * svgHeightToWidthRatio;
  }

  const lineData = generateLinePoints({
    wiggleWidth,
    lineSpacing,
    totalPeakWiggles,
    totalFlatWiggles,
    totalLines,
    maxPeakHeight,
    maxFlatWiggleHeight
  });

  const lines = generateLines({ lineData, lineSpacing, wiggleWidth });
  let fillColour = diffMountainColour ? mountainColour : bgColour;
  if (outlineOnly) fillColour = "none";

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
          style={{
            background: bgColour
          }}
        >
          <g
            stroke={lineColour}
            fill={fillColour}
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
  padding: 20px;
  background: white;
  border-radius: 5px;
  flex: 1;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  max-width: 100%;
  max-height: 100%;
`;

const generateLinePoints = ({
  wiggleWidth,
  lineSpacing,
  totalPeakWiggles,
  totalFlatWiggles,
  totalLines,
  maxPeakHeight,
  maxFlatWiggleHeight
}) => {
  let points = [];
  let ptData, line;

  for (let y = 0; y < totalLines; y++) {
    // for each row add the point data
    line = [];
    const boxY = y * lineSpacing;

    // START FLAT WIGGLES
    for (let i = 0; i <= totalFlatWiggles; i++) {
      const boxX = i * wiggleWidth;
      let offset = maxFlatWiggleHeight * Math.random();
      ptData = { x: boxX, y: boxY - offset };
      line.push(ptData);
    }

    // MIDDLE PEAK WIGGLES
    const flatWigglesEndX = ptData.x;
    const halfPeakWiggles = totalPeakWiggles / 2;
    for (let i = 0; i <= totalPeakWiggles; i++) {
      const boxX = flatWigglesEndX + (i + 1) * wiggleWidth;

      //   // get random based on dist from center
      const distFromCenter = Math.abs(halfPeakWiggles - i);
      const frac = 1 - distFromCenter / halfPeakWiggles;
      let offset = maxPeakHeight * frac * Math.random();
      ptData = { x: boxX, y: boxY - offset };
      line.push(ptData);
    }

    // END FLAT WIGGLES
    const peakWigglesEndX = ptData.x;
    for (let i = 0; i <= totalFlatWiggles; i++) {
      const boxX = peakWigglesEndX + (i + 1) * wiggleWidth;
      let offset = maxFlatWiggleHeight * Math.random();
      ptData = { x: boxX, y: boxY - offset };
      line.push(ptData);
    }

    points.push(line);
  }

  return points;
};

const generateLines = ({ lineData, lineSpacing, wiggleWidth }) => {
  const cPtSize = wiggleWidth / 2.5;

  return lineData.map((ptsArr, index) => {
    let d = `M ${0} ${index * lineSpacing}`;

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
