import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Display = ({ appData, sizeInfo, setCanvasRef }) => {
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

  setCanvasRef(canvasRef.current);

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
      const framedCanvas = createFramedCanvas({ sourceCanvas: sourceImg });
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = framedCanvas.width;
      canvasRef.current.height = framedCanvas.height;
      ctx.drawImage(framedCanvas, 0, 0);
    }
  });

  return (
    <Container>
      <CanvasStyled ref={canvasRef} class={"framedCanvas"} />

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
  max-width: 100%;
  max-height: 100%;
  /* border: red 1px solid; */
`;

// helper functions

const createFramedCanvas = ({ sourceCanvas, frameThickness = 20 }) => {
  const outputCanvas = document.createElement("canvas");

  outputCanvas.width = sourceCanvas.width + frameThickness * 2;
  outputCanvas.height = sourceCanvas.height + frameThickness * 2;

  const frameWidth = sourceCanvas.width + frameThickness * 2;
  const frameHeight = sourceCanvas.height + frameThickness * 2;
  const frameInnerWidth = frameWidth - frameThickness * 2;
  const frameInnerHeight = frameHeight - frameThickness * 2;

  const imgX = frameThickness;
  const imgY = frameThickness;

  const ctx = outputCanvas.getContext("2d");

  ctx.drawImage(sourceCanvas, imgX, imgY);

  drawFrameSections({
    ctx,
    thickness: frameThickness,
    width: frameWidth,
    height: frameHeight
  });

  drawFrameSections({
    ctx,
    thickness: frameThickness,
    width: frameWidth,
    height: frameHeight,
    baseHue: 265
  });

  drawFrameSections({
    ctx,
    thickness: 5,
    x: frameThickness,
    y: frameThickness,
    width: frameInnerWidth,
    height: frameInnerHeight,
    baseHue: 80
  });

  return outputCanvas;
};

const drawFrameSections = ({
  ctx,
  x = 0,
  y = 0,
  baseHue = 265,
  baseSaturation = 50,
  baseLightness = 40,
  thickness,
  width,
  height
}) => {
  // top
  ctx.fillStyle = `hsl(${baseHue}, ${baseSaturation}%, ${baseLightness + 20}%)`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width - thickness, y + thickness);
  ctx.lineTo(x + thickness, y + thickness);
  ctx.closePath();
  ctx.fill();

  // right
  ctx.fillStyle = `hsl(${baseHue}, ${baseSaturation}%, ${baseLightness}%)`;
  ctx.beginPath();
  ctx.moveTo(x + width, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width - thickness, y + height - thickness);
  ctx.lineTo(x + width - thickness, y + thickness);
  ctx.closePath();
  ctx.fill();

  // bottom
  ctx.fillStyle = `hsl(${baseHue}, ${baseSaturation}%, ${baseLightness - 5}%)`;
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width - thickness, y + height - thickness);
  ctx.lineTo(x + thickness, y + height - thickness);
  ctx.closePath();
  ctx.fill();

  // left
  ctx.fillStyle = `hsl(${baseHue}, ${baseSaturation}%, ${baseLightness + 15}%)`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x + thickness, y + height - thickness);
  ctx.lineTo(x + thickness, y + thickness);
  ctx.closePath();
  ctx.fill();
};
