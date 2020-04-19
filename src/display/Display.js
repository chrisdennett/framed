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
  }, [wall, fancyFrameSpriteSheet]);

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

  const plaqueHeight = Math.min(displayHeight / 2.5, 300);
  const plaquePadding = 20;
  drawPifflePlaque({
    ctx,
    piffle,
    x: plaquePadding,
    y: displayHeight - (plaqueHeight + plaquePadding),
    width: displayWidth - plaquePadding * 2,
    height: plaqueHeight,
  });

  const frameArea = {
    top: 60,
    right: 15,
    bottom: plaquePadding + plaqueHeight + plaquePadding,
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

  ctx.save();
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 10;
  ctx.shadowBlur = 5;
  ctx.shadowColor = `rgba(0, 0, 0, 0.3)`;
  ctx.drawImage(framedCanvas, frameX, frameY, targFrameW, targFrameH);
  ctx.restore();

  return roomCanvas;
};

const drawWall = ({ ctx, width, height, tileImg }) => {
  const tile = ctx.createPattern(tileImg, "repeat");
  ctx.fillStyle = tile;
  ctx.fillRect(0, 0, width, height);
};
