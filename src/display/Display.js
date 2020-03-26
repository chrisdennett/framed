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

const createFramedCanvas = ({
  sourceCanvas,
  frameColour = "#333",
  mountColour = "#eeeeee",
  frameThickness = 15,
  mountThickness = 50,
  frameBevel = 3,
  mountBevel = 3
}) => {
  const outputCanvas = document.createElement("canvas");

  const { width: imgW, height: imgH } = sourceCanvas;
  const doubleFrame = frameThickness * 2;
  const doubleMount = mountThickness * 2;
  const doubleFrameBevel = frameBevel * 2;
  const doubleMountBevel = mountBevel * 2;

  const mountBevelWidth = imgW + doubleMountBevel;
  const mountBevelHeight = imgH + doubleMountBevel;
  const mountWidth = mountBevelWidth + doubleMount;
  const mountHeight = mountBevelHeight + doubleMount;

  const frameWidth = mountWidth + doubleFrame + doubleFrameBevel;
  const frameHeight = mountHeight + doubleFrame + doubleFrameBevel;
  const frameBevelWidth = frameWidth - doubleFrame;
  const frameBevelHeight = frameHeight - doubleFrame;

  outputCanvas.width = frameWidth;
  outputCanvas.height = frameHeight;

  const frameBevelX = frameThickness;
  const frameBevelY = frameThickness;

  const mountX = frameBevelX + frameBevel;
  const mountY = frameBevelY + frameBevel;

  const mountBevelX = mountX + mountThickness;
  const mountBevelY = mountY + mountThickness;

  const imgX = mountBevelX + mountBevel;
  const imgY = mountBevelY + mountBevel;

  const ctx = outputCanvas.getContext("2d");

  // frame bg
  ctx.fillStyle = frameColour;
  ctx.fillRect(0, 0, frameWidth, frameHeight);

  // mount
  ctx.fillStyle = mountColour;
  ctx.fillRect(mountX, mountY, mountWidth, mountHeight);

  ctx.drawImage(sourceCanvas, imgX, imgY);

  // mount bevel
  drawFrameSections({
    ctx,
    isInner: true,
    thickness: mountBevel,
    x: mountBevelX,
    y: mountBevelY,
    width: mountBevelWidth,
    height: mountBevelHeight,
    colour: mountColour
  });

  // frame
  drawFrameSections({
    ctx,
    thickness: frameThickness,
    width: frameWidth,
    height: frameHeight,
    colour: frameColour
  });

  drawFrameSections({
    ctx,
    isInner: true,
    thickness: frameBevel,
    x: frameBevelX,
    y: frameBevelY,
    width: frameBevelWidth,
    height: frameBevelHeight,
    colour: frameColour
  });

  return outputCanvas;
};

// draw sections onto canvas
const drawFrameSections = ({
  ctx,
  isInner = false,
  x = 0,
  y = 0,
  colour,
  thickness,
  width,
  height
}) => {
  const brightnessAdjust = isInner ? -10 : 10;

  const { h: baseHue, s: baseSaturation, l: baseLightness } = hexToHSL(colour);

  // top
  ctx.fillStyle = `hsl(${baseHue}, ${baseSaturation}%, ${baseLightness +
    brightnessAdjust}%)`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width - thickness, y + thickness);
  ctx.lineTo(x + thickness, y + thickness);
  ctx.closePath();
  ctx.fill();

  // right
  ctx.fillStyle = `hsl(${baseHue}, ${baseSaturation}%, ${baseLightness -
    brightnessAdjust / 1.5}%)`;
  ctx.beginPath();
  ctx.moveTo(x + width, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width - thickness, y + height - thickness);
  ctx.lineTo(x + width - thickness, y + thickness);
  ctx.closePath();
  ctx.fill();

  // bottom
  ctx.fillStyle = `hsl(${baseHue}, ${baseSaturation}%, ${baseLightness -
    brightnessAdjust}%)`;
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width - thickness, y + height - thickness);
  ctx.lineTo(x + thickness, y + height - thickness);
  ctx.closePath();
  ctx.fill();

  // left
  ctx.fillStyle = `hsl(${baseHue}, ${baseSaturation}%, ${baseLightness +
    brightnessAdjust / 1.5}%)`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x + thickness, y + height - thickness);
  ctx.lineTo(x + thickness, y + thickness);
  ctx.closePath();
  ctx.fill();
};

const hexToHSL = H => {
  console.log("H: ", H);

  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
};
