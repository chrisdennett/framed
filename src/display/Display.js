import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import fancyFrameSpriteSheet from "./spritesheet.png";
import { frameOptionSettings } from "../appData";

const Display = ({ appData, sizeInfo, setCanvasRef }) => {
  const canvasRef = useRef(null);
  const [sourceImg, setSourceImg] = useState(null);
  const [spriteSheet, setSpriteSheet] = useState(null);
  setCanvasRef(canvasRef.current);

  const {
    frameOption,
    frameColour,
    mountColour,
    frameThickness,
    mountThickness,
    cropTop,
    cropBottom,
    cropLeft
  } = appData;

  console.log("frameOption: ", frameOption);
  const frameSettings = frameOptionSettings[frameOption];

  useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);
      };
      image.src = "./img/doug.png";
    }

    if (!spriteSheet) {
      loadImage(fancyFrameSpriteSheet, img => {
        setSpriteSheet(img);
      });
    }

    if (sourceImg && spriteSheet) {
      const framedCanvas = createFramedCanvas({
        ...frameSettings,
        sourceCanvas: sourceImg,
        spriteSheet
      });
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = framedCanvas.width;
      canvasRef.current.height = framedCanvas.height;
      ctx.drawImage(framedCanvas, 0, 0);
    }
  });

  return (
    <Container>
      <CanvasStyled ref={canvasRef} />
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
`;

// helper functions

const createFramedCanvas = ({
  sourceCanvas,
  frameColour = "#333",
  mountColour = "#eeeeee",
  frameType = "simple",
  frameThickness = 20,
  mountThickness = 90,
  frameBevel = 5,
  mountBevel = 3,
  spriteSheet
}) => {
  const outputCanvas = document.createElement("canvas");

  const { width: imgW, height: imgH } = sourceCanvas;
  const doubleFrame = frameThickness * 2;
  const doubleMount = mountThickness * 2;
  const doubleFrameBevel = frameBevel * 2;
  const doubleMountBevel = mountBevel * 2;

  const frameX = 0;
  const frameY = 0;

  const mountBevelWidth = imgW + doubleMountBevel;
  const mountBevelHeight = imgH + doubleMountBevel;
  const mountWidth = mountBevelWidth + doubleMount;
  const mountHeight = mountBevelHeight + doubleMount;

  const frameWidth = mountWidth + doubleFrame + doubleFrameBevel;
  const frameHeight = mountHeight + doubleFrame + doubleFrameBevel;

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

  // mount
  ctx.fillStyle = mountColour;
  ctx.fillRect(mountX, mountY, mountWidth, mountHeight);

  ctx.drawImage(sourceCanvas, imgX, imgY);

  const shadowOpacity = frameType === "fancy" ? 0.9 : 0.3;

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

  // frame;
  if (frameType === "fancy") {
    drawFancyFrame({
      ctx,
      startX: frameX,
      startY: frameY,
      width: frameWidth,
      height: frameHeight,
      thickness: frameThickness,
      frameSpriteSheet: spriteSheet,
      frameThickness: 50
    });
  } else {
    drawSimpleFrame({
      ctx,
      startX: frameX,
      startY: frameY,
      width: frameWidth,
      height: frameHeight,
      frameBevel,
      thickness: frameThickness,
      frameThickness: 50,
      colour: frameColour
    });
  }

  // frame shadows
  drawInnerShadow(
    ctx,
    mountX,
    mountY,
    mountWidth,
    mountHeight,
    0.007,
    shadowOpacity
  );
  drawInnerShadow(
    ctx,
    mountX,
    mountY,
    mountWidth,
    mountHeight,
    -0.004,
    shadowOpacity - 0.1
  );

  // mount shadows
  drawInnerShadow(ctx, imgX, imgY, imgW, imgH, 0.003, 0.7);
  drawInnerShadow(ctx, imgX, imgY, imgW, imgH, -0.003, 0.5);

  return outputCanvas;
};

// draw bg colour blocks
const drawBgColourBlocks = ({
  ctx,
  frameColour,
  frameWidth,
  frameHeight,
  frameX,
  frameY
}) => {
  // frame bg
  ctx.fillStyle = frameColour;
  ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
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

// shadows
const drawInnerShadow = (
  ctx,
  startX,
  startY,
  width,
  height,
  offsetFraction,
  opacity = 0.9
) => {
  ctx.shadowOffsetX = offsetFraction * width;
  ctx.shadowOffsetY = offsetFraction * width;
  ctx.shadowBlur = 0.01 * width;
  ctx.shadowColor = `rgba(0, 0, 0, ${opacity})`;

  const sizeDiff = 10;
  const doubleSizeDiff = sizeDiff * 2;

  const bigRectLeft = startX - sizeDiff;
  const bigRectTop = startY - sizeDiff;
  const bigRectRight = bigRectLeft + width + doubleSizeDiff;
  const bigRectBottom = bigRectTop + height + doubleSizeDiff;

  const smallRectLeft = startX;
  const smallRectTop = startY;
  const smallRectRight = smallRectLeft + width;
  const smallRectBottom = smallRectTop + height;

  // hide the frame shape used to generate the shadow
  // could probably use a stroke instead
  ctx.rect(startX, startY, width, height);
  ctx.clip();

  // draw anti-clockwise
  ctx.beginPath();
  ctx.moveTo(bigRectRight, bigRectBottom);
  ctx.lineTo(bigRectRight, bigRectTop);
  ctx.lineTo(bigRectLeft, bigRectTop);
  ctx.lineTo(bigRectLeft, bigRectBottom);
  ctx.lineTo(bigRectRight, bigRectBottom);

  // then clockwise to cut out a frame shape
  // the shadow on the inner edge is what's seen
  ctx.moveTo(smallRectLeft, smallRectTop);
  ctx.lineTo(smallRectRight, smallRectTop);
  ctx.lineTo(smallRectRight, smallRectBottom);
  ctx.lineTo(smallRectLeft, smallRectBottom);

  ctx.closePath();
  ctx.fill();
};

// SIMPLE FRAME
const drawSimpleFrame = ({
  ctx,
  startX,
  startY,
  width,
  height,
  thickness,
  frameBevel,
  depth,
  colour
}) => {
  const doubleFrame = thickness * 2;
  const frameBevelWidth = width - doubleFrame;
  const frameBevelHeight = height - doubleFrame;
  const frameBevelX = thickness;
  const frameBevelY = thickness;

  // main
  drawFrameSections({
    ctx,
    x: startX,
    y: startY,
    thickness,
    width,
    height,
    colour
  });

  // bevel
  drawFrameSections({
    ctx,
    isInner: true,
    thickness: frameBevel,
    x: frameBevelX,
    y: frameBevelY,
    width: frameBevelWidth,
    height: frameBevelHeight,
    colour
  });
};

// FANCY FRAME
// https://www.codeandweb.com/free-sprite-sheet-packer
const fancyFrameJson = {
  "corner-bottom-left": {
    x: 1,
    y: 1,
    w: 153,
    h: 150
  },
  "corner-bottom-right": {
    x: 156,
    y: 1,
    w: 153,
    h: 150
  },
  "corner-extension-bottom-left-horizontal": {
    x: 311,
    y: 1,
    w: 34,
    h: 150
  },
  "corner-extension-bottom-left-vertical": {
    x: 1,
    y: 153,
    w: 153,
    h: 41
  },
  "corner-extension-bottom-right-horizontal": {
    x: 347,
    y: 1,
    w: 34,
    h: 150
  },
  "corner-extension-bottom-right-vertical": {
    x: 157,
    y: 153,
    w: 153,
    h: 41
  },
  "corner-extension-top-left-horizontal": {
    x: 383,
    y: 1,
    w: 34,
    h: 150
  },
  "corner-extension-top-left-vertical": {
    x: 1,
    y: 196,
    w: 153,
    h: 41
  },
  "corner-extension-top-right-horizontal": {
    x: 312,
    y: 153,
    w: 34,
    h: 150
  },
  "corner-extension-top-right-vertical": {
    x: 156,
    y: 196,
    w: 153,
    h: 41
  },
  "corner-top-left": {
    x: 1,
    y: 239,
    w: 153,
    h: 150
  },
  "corner-top-right": {
    x: 156,
    y: 239,
    w: 153,
    h: 150
  },
  "horizontal-slice-bottom": {
    x: 348,
    y: 154,
    w: 82,
    h: 151
  },
  "horizontal-slice-top": {
    x: 432,
    y: 1,
    w: 82,
    h: 150
  },
  "vertical-slice-left": {
    x: 311,
    y: 306,
    w: 153,
    h: 77
  },
  "vertical-slice-right": {
    x: 312,
    y: 385,
    w: 153,
    h: 77
  }
};
const drawFancyFrame = ({
  ctx,
  startX,
  startY,
  width,
  height,
  thickness,
  frameSpriteSheet
}) => {
  // corners
  const { x: tlX, y: tlY, h: tlH, w: tlW } = fancyFrameJson["corner-top-left"];
  const { x: trX, y: trY, h: trH, w: trW } = fancyFrameJson["corner-top-right"];
  const { x: blX, y: blY, h: blH, w: blW } = fancyFrameJson[
    "corner-bottom-left"
  ];
  const { x: brX, y: brY, h: brH, w: brW } = fancyFrameJson[
    "corner-bottom-right"
  ];

  const frameScale = thickness / tlH;

  ctx.drawImage(
    frameSpriteSheet,
    tlX,
    tlY,
    tlW,
    tlH,
    startX,
    startY,
    thickness,
    thickness
  );
  ctx.drawImage(
    frameSpriteSheet,
    trX,
    trY,
    trW,
    trH,
    width - thickness,
    startY,
    thickness,
    thickness
  );
  ctx.drawImage(
    frameSpriteSheet,
    blX,
    blY,
    blW,
    blH,
    startX,
    height - thickness,
    thickness,
    thickness
  );
  ctx.drawImage(
    frameSpriteSheet,
    brX,
    brY,
    brW,
    brH,
    width - thickness,
    height - thickness,
    thickness,
    thickness
  );

  // corner extensions
  const { x: tlhX, y: tlhY, h: tlhH, w: tlhW } = fancyFrameJson[
    "corner-extension-top-left-horizontal"
  ];
  const { x: trhX, y: trhY, h: trhH, w: trhW } = fancyFrameJson[
    "corner-extension-top-right-horizontal"
  ];
  const { x: tlvX, y: tlvY, h: tlvH, w: tlvW } = fancyFrameJson[
    "corner-extension-top-left-vertical"
  ];
  const { x: trvX, y: trvY, h: trvH, w: trvW } = fancyFrameJson[
    "corner-extension-top-right-vertical"
  ];
  const { x: blhX, y: blhY, h: blhH, w: blhW } = fancyFrameJson[
    "corner-extension-bottom-left-horizontal"
  ];
  const { x: brhX, y: brhY, h: brhH, w: brhW } = fancyFrameJson[
    "corner-extension-bottom-right-horizontal"
  ];
  const { x: blvX, y: blvY, h: blvH, w: blvW } = fancyFrameJson[
    "corner-extension-bottom-left-vertical"
  ];
  const { x: brvX, y: brvY, h: brvH, w: brvW } = fancyFrameJson[
    "corner-extension-bottom-right-vertical"
  ];
  const cornerWidth = thickness + tlhW * frameScale;
  const cornerHeight = thickness + tlvH * frameScale;
  const middleWidth = width - cornerWidth * 2;
  const middleHeight = height - cornerHeight * 2;
  // top left
  ctx.drawImage(
    frameSpriteSheet,
    tlhX,
    tlhY,
    tlhW,
    tlhH,
    startX + thickness,
    startY,
    tlhW * frameScale + 1,
    thickness
  );
  ctx.drawImage(
    frameSpriteSheet,
    trhX,
    trhY,
    trhW,
    trhH,
    width - cornerWidth - 1,
    startY,
    trhW * frameScale + 1,
    thickness
  );
  // top right
  ctx.drawImage(
    frameSpriteSheet,
    tlvX,
    tlvY,
    tlvW,
    tlvH,
    startX,
    startY + thickness,
    thickness,
    tlvH * frameScale + 1
  );
  ctx.drawImage(
    frameSpriteSheet,
    trvX,
    trvY,
    trvW,
    trvH,
    width - thickness,
    startY + thickness,
    thickness,
    trvH * frameScale + 1
  );

  // bottom left
  ctx.drawImage(
    frameSpriteSheet,
    blhX,
    blhY,
    blhW,
    blhH,
    startX + thickness,
    height - thickness,
    blhW * frameScale + 1,
    thickness
  );
  ctx.drawImage(
    frameSpriteSheet,
    brhX,
    brhY,
    brhW,
    brhH,
    width - cornerWidth - 1,
    height - thickness,
    brhW * frameScale + 1,
    thickness
  );
  // bottom right
  ctx.drawImage(
    frameSpriteSheet,
    blvX,
    blvY,
    blvW,
    blvH,
    startX,
    height - cornerHeight - 1,
    thickness,
    blvH * frameScale + 1
  );
  ctx.drawImage(
    frameSpriteSheet,
    brvX,
    brvY,
    brvW,
    brvH,
    width - thickness,
    height - cornerHeight - 1,
    thickness,
    brvH * frameScale + 1
  );

  // top middle
  repeatImageToFill({
    ctx,
    thickness,
    frameScale,
    horizontal: true,
    x: startX + cornerWidth,
    y: startY,
    width: middleWidth,
    sliceImg: frameSpriteSheet,
    sliceData: fancyFrameJson["horizontal-slice-top"]
  });

  // bottom middle
  repeatImageToFill({
    ctx,
    thickness,
    frameScale,
    horizontal: true,
    x: startX + cornerWidth,
    y: height - thickness,
    width: middleWidth,
    sliceImg: frameSpriteSheet,
    sliceData: fancyFrameJson["horizontal-slice-bottom"]
  });

  // left middle
  repeatImageToFill({
    ctx,
    thickness,
    frameScale,
    vertical: true,
    x: startX,
    y: startY + cornerHeight,
    height: middleHeight,
    sliceImg: frameSpriteSheet,
    sliceData: fancyFrameJson["vertical-slice-left"]
  });

  // right middle
  repeatImageToFill({
    ctx,
    thickness,
    frameScale,
    vertical: true,
    x: width - thickness,
    y: startY + cornerHeight,
    height: middleHeight,
    sliceImg: frameSpriteSheet,
    sliceData: fancyFrameJson["vertical-slice-right"]
  });
};

const repeatImageToFill = ({
  ctx,
  thickness,
  frameScale,
  horizontal = false,
  vertical = false,
  x,
  y,
  width,
  height,
  sliceImg,
  sliceData
}) => {
  const { x: sliceX, y: sliceY, h: sliceH, w: sliceW } = sliceData;

  if (horizontal) {
    const scaledSliceW = sliceW * frameScale;

    const slicesNeeded = Math.round(width / scaledSliceW);
    const adjustedSliceWidth = width / slicesNeeded;

    let xPos = x;

    for (let i = 0; i < slicesNeeded; i++) {
      ctx.drawImage(
        sliceImg,
        sliceX,
        sliceY,
        sliceW,
        sliceH,
        xPos - 1,
        y,
        adjustedSliceWidth + 1,
        thickness
      );
      xPos += adjustedSliceWidth;
    }
  }

  if (vertical) {
    const scaledSliceH = sliceH * frameScale;

    const slicesNeeded = Math.round(height / scaledSliceH);
    const adjustedSliceHeight = height / slicesNeeded;

    let yPos = y;

    for (let i = 0; i < slicesNeeded; i++) {
      ctx.drawImage(
        sliceImg,
        sliceX,
        sliceY,
        sliceW,
        sliceH,
        x,
        yPos - 1,
        thickness,
        adjustedSliceHeight + 1
      );
      yPos += adjustedSliceHeight;
    }
  }
};

// UTILS
const hexToHSL = H => {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length === 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length === 7) {
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

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
};

const loadImage = (url, callback) => {
  let sourceImg = new Image();
  sourceImg.setAttribute("crossOrigin", "anonymous"); //
  sourceImg.src = url;
  sourceImg.onload = () => {
    if (callback) callback(sourceImg);
  };
};
