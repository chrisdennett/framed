import React, { useRef, useState } from "react";
import { frameOptionSettings } from "../appData";
// assets
import wall from "./assets/concrete_wall_2.png";
import fancyFrameSpriteSheet from "./assets/spritesheet.png";
// helpers
import { createFrameCanvas } from "./frame";
import { drawPifflePlaque } from "./piffle";

const Display = ({ appData, piffle, setCanvasRef, sourceImg, sizeInfo }) => {
  const [wallTile, setWallTile] = useState(null);
  const [spriteSheet, setSpriteSheet] = useState(null);
  const canvasRef = useRef(null);
  setCanvasRef(canvasRef.current);

  const { height: displayHeight, width: displayWidth } = sizeInfo;

  React.useEffect(() => {
    if (!wallTile) {
      loadImage(wall, (img) => {
        setWallTile(img);
      });
    }

    if (!spriteSheet) {
      loadImage(fancyFrameSpriteSheet, (img) => {
        setSpriteSheet(img);
      });
    }
  });

  const {
    frameOption,
    frameColour,
    mountColour,
    frameThickness,
    mountThickness,
  } = appData;

  const frameSettings = {
    ...frameOptionSettings[frameOption],
    frameColour,
    mountColour,
    frameThickness,
    mountThickness,
  };

  if (sourceImg && spriteSheet && wallTile) {
    const room = createRoomCanvas({
      frameSettings,
      displayWidth,
      displayHeight,
      sourceCanvas: sourceImg,
      spriteSheet,
      piffle,
      bgTileImg: wallTile,
    });

    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = displayWidth;
    canvasRef.current.height = displayHeight;
    ctx.drawImage(room, 0, 0);
  }

  return <canvas ref={canvasRef} />;
};

export default Display;

// helper functions
const loadImage = (url, callback) => {
  let sourceImg = new Image();
  sourceImg.setAttribute("crossOrigin", "anonymous"); //
  sourceImg.onload = () => {
    if (callback) callback(sourceImg);
  };
  sourceImg.src = url;
};

const createRoomCanvas = ({
  sourceCanvas,
  frameSettings,
  displayWidth,
  displayHeight,
  spriteSheet,
  piffle,
  bgTileImg,
}) => {
  const roomCanvas = document.createElement("canvas");
  roomCanvas.width = displayWidth;
  roomCanvas.height = displayHeight;
  const ctx = roomCanvas.getContext("2d");
  const isLandscape = displayWidth > displayHeight;

  drawWall({
    ctx,
    width: displayWidth,
    height: displayHeight,
    tileImg: bgTileImg,
  });

  const framedCanvas = createFrameCanvas({
    sourceCanvas,
    ...frameSettings,
    spriteSheet,
  });

  const maxPlaqueHeight = isLandscape ? displayHeight : displayHeight / 2.5;
  const maxPlaqueWidth = isLandscape ? displayWidth / 2.5 : displayWidth;
  const plaqueMargin = isLandscape ? displayWidth * 0.02 : displayHeight * 0.02;

  const { plaqueCanvas, plaqueTextWidth, plaqueTextHeight } = drawPifflePlaque({
    ctx,
    piffle,
    x: 0,
    y: 0,
    width: maxPlaqueWidth,
    height: maxPlaqueHeight,
  });

  const doublePlaqueMargin = plaqueMargin * 2;

  const frameArea = {
    top: 60,
    right: isLandscape ? plaqueTextWidth + doublePlaqueMargin : 15,
    bottom: isLandscape ? 25 : plaqueTextHeight + doublePlaqueMargin,
    left: 15,
  };

  const { width: fw, height: fh } = framedCanvas;
  const fwToHRatio = fh / fw;
  const fhToWRatio = fw / fh;

  const maxFrameW = displayWidth - (frameArea.left + frameArea.right);
  const maxFrameH = displayHeight - (frameArea.top + frameArea.bottom);

  let targFrameW = maxFrameW;
  let targFrameH = targFrameW * fwToHRatio;
  if (targFrameH > maxFrameH) {
    targFrameH = maxFrameH;
    targFrameW = targFrameH * fhToWRatio;
  }
  const frameX = frameArea.left + (maxFrameW - targFrameW) / 2;
  const frameY = frameArea.top + (maxFrameH - targFrameH) / 2;

  // Outer frame Shadow
  const shadow1Size = framedCanvas.height * 0.005;
  const shadow2Size = framedCanvas.height * 0.02;
  ctx.save();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = shadow1Size;
  ctx.shadowBlur = 5;
  ctx.shadowColor = `rgba(0, 0, 0, 0.9)`;
  ctx.drawImage(framedCanvas, frameX, frameY, targFrameW, targFrameH);

  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = shadow2Size;
  ctx.shadowBlur = 10;
  ctx.shadowColor = `rgba(0, 0, 0, 0.3)`;
  ctx.drawImage(framedCanvas, frameX, frameY, targFrameW, targFrameH);
  ctx.restore();

  // plaque calcs
  const plaqueX = isLandscape ? frameX + targFrameW + plaqueMargin : frameX;

  const plaquePadding = isLandscape
    ? displayWidth * 0.01
    : displayHeight * 0.01;
  const doublePlaquePadding = plaquePadding * 2;

  const plaqueY = isLandscape
    ? frameY + targFrameH - plaqueTextHeight * 2.5
    : frameY + targFrameH + plaqueMargin;

  // Draw plaque bg
  ctx.fillStyle = "hsla(0, 0%, 99%)";
  ctx.save();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 2;
  ctx.shadowColor = `rgba(0, 0, 0, 0.4)`;
  ctx.fillRect(
    plaqueX,
    plaqueY,
    plaqueTextWidth + doublePlaquePadding,
    plaqueTextHeight + doublePlaquePadding
  );

  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = -3;
  ctx.shadowBlur = 2;
  ctx.shadowColor = `rgba(255, 255, 255, 0.6)`;
  ctx.fillRect(
    plaqueX,
    plaqueY,
    plaqueTextWidth + doublePlaquePadding,
    plaqueTextHeight + doublePlaquePadding
  );
  ctx.restore();

  // add card bg
  // ctx.fillStyle = "#efefef";

  // ctx.save();
  // ctx.shadowOffsetX = 0;
  // ctx.shadowOffsetY = 3;
  // ctx.shadowBlur = 2;
  // ctx.shadowColor = `rgba(0, 0, 0, 0.4)`;
  // ctx.fillRect(plaqueX, plaqueY, maxPlaqueWidth, height);

  // ctx.shadowOffsetX = 0;
  // ctx.shadowOffsetY = -3;
  // ctx.shadowBlur = 2;
  // ctx.shadowColor = `rgba(255, 255, 255, 0.6)`;

  // ctx.fillRect(plaqueX, plaqueY, maxPlaqueWidth, height);
  // ctx.restore();

  // Draw plaque wording
  ctx.drawImage(
    plaqueCanvas,
    Math.round(plaqueX + plaquePadding),
    Math.round(plaqueY + plaquePadding)
  );

  return roomCanvas;
};

const drawWall = ({ ctx, width, height, tileImg }) => {
  const tile = ctx.createPattern(tileImg, "repeat");
  ctx.fillStyle = tile;
  ctx.fillRect(0, 0, width, height);
};
