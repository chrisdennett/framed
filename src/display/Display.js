import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Display = ({ appData, sizeInfo, onClick }) => {
  const canvasRef = useRef(null);
  const [sourceImg, setSourceImg] = useState(null);
  const {
    frameColour,
    mountColour,
    frameThickness,
    mountThickness,
    cropTop,
    cropBottom,
    cropLeft
  } = appData;

  useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);
      };
      image.src = "./img/doug.png";
    }

    if (sourceImg) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = sourceImg.width;
      canvasRef.current.height = sourceImg.height;
      ctx.drawImage(sourceImg, 0, 0);
    }
  });

  return (
    <Container>
      <CanvasStyled ref={canvasRef} />

      {/* <SvgHolder
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
      </SvgHolder> */}
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

const CanvasStyled = styled.canvas`
  width: 100%;
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
