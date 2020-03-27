const maxImageWidth = 800;
const maxImageHeight = 800;

// Returns an image element given a file

export function GetImage(imgFile, callback) {
  GetPhotoOrientation(imgFile, orientation => {
    const reader = new FileReader();
    reader.onload = e => {
      const imgSrc = e.target.result;
      // Create a new image element
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous"); //
      img.src = imgSrc;

      // wait for it to be loaded and then return
      img.onload = e => {
        const w = img.width;
        const h = img.height;

        const widthToHeightRatio = h / w;
        const heightToWidthRatio = w / h;

        callback(img, orientation, widthToHeightRatio, heightToWidthRatio);
      };
    };
    reader.readAsDataURL(imgFile);
  });
}

export function GetImageFromUrl(imgUrl, callback) {
  const imgSrc = imgUrl;
  // Create a new image element
  let img = new Image();
  img.setAttribute("crossOrigin", "anonymous"); //
  img.src = imgSrc;

  // wait for it to be loaded and then return
  img.onload = e => {
    const w = img.width;
    const h = img.height;

    const widthToHeightRatio = h / w;
    const heightToWidthRatio = w / h;

    callback(img, widthToHeightRatio, heightToWidthRatio);
  };
}

// Reads file as Array buffer to get camera orientation from exif data
function GetPhotoOrientation(file, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    const view = new DataView(e.target.result);

    if (view.getUint16(0, false) !== 0xffd8) return callback(-2);
    const length = view.byteLength;
    let offset = 2;
    while (offset < length) {
      let marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xffe1) {
        offset += 2;
        if (view.getUint32(offset, false) !== 0x45786966) return callback(-1);

        const little = view.getUint16((offset += 6), false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        const tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++)
          if (view.getUint16(offset + i * 12, little) === 0x0112)
            return callback(view.getUint16(offset + i * 12 + 8, little));
      } else if ((marker & 0xff00) !== 0xff00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
}

// Draws an image to a canvas restricting to a specific size
export function drawImageToCanvas(
  {
    sourceImg,
    outputCanvas,
    orientation,
    maxOutputCanvasWidth = maxImageWidth,
    maxOutputCanvasHeight = maxImageHeight
  },
  callback
) {
  const isPortrait = orientation > 4 && orientation < 9;

  // if portrait the final canvas dimensions will be the other way round
  const canvasW = isPortrait ? sourceImg.height : sourceImg.width;
  const canvasH = isPortrait ? sourceImg.width : sourceImg.height;

  const widthToHeightRatio = canvasH / canvasW;
  const heightToWidthRatio = canvasW / canvasH;

  let outputCanvasWidth = Math.min(canvasW, maxOutputCanvasWidth);
  let outputCanvasHeight = outputCanvasWidth * widthToHeightRatio;

  if (outputCanvasHeight > maxOutputCanvasHeight) {
    outputCanvasHeight = maxOutputCanvasHeight;
    outputCanvasWidth = outputCanvasHeight * heightToWidthRatio;
  }

  outputCanvas.width = outputCanvasWidth;
  outputCanvas.height = outputCanvasHeight;

  const ctx = outputCanvas.getContext("2d");

  // save the context so it can be reset after transform
  ctx.save();
  // transform context before drawing image
  switch (orientation) {
    case 2:
      // flipped horizontally
      ctx.transform(-1, 0, 0, 1, canvasH, 0);
      break;
    case 3:
      // rotated 180°
      ctx.transform(-1, 0, 0, -1, canvasW, canvasH);
      break;
    case 4:
      // flipped horizontally and rotated 180°
      ctx.transform(1, 0, 0, -1, 0, canvasW);
      break;
    case 5:
      // flipped horizontally and rotated 270°
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      // rotated 90°
      // ctx.transform(0, 1, -1, 0, canvasW, 0);
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -outputCanvas.width);
      break;
    case 7:
      // flipped horizontally and rotated 90°
      ctx.transform(0, -1, -1, 0, canvasW, canvasH);
      break;
    case 8:
      // rotated 270°
      ctx.transform(0, -1, 1, 0, 0, canvasH);
      break;
    default:
      break;
  }

  const outputWidth = isPortrait ? outputCanvasHeight : outputCanvasWidth;
  const outputHeight = isPortrait ? outputCanvasWidth : outputCanvasHeight;

  // ctx.drawImage(sourceImg, 0, 0, outputCanvasWidth, outputCanvasHeight, 0, 0, outputCanvasWidth, outputCanvasHeight);
  ctx.drawImage(
    sourceImg,
    0,
    0,
    sourceImg.width,
    sourceImg.height,
    0,
    0,
    outputWidth,
    outputHeight
  );
  // restore ensures resets transform in case another image is added
  ctx.restore();

  if (callback) callback(outputCanvasWidth, outputCanvasHeight);
}

// Draws one canvas to another restricting to a specific size
export function drawToCanvas2(
  {
    clearCanvas = true,
    resizeOutputToMatchSource = true,
    sourceCanvas,
    outputCanvas,
    orientation,
    cropData,
    maxOutputCanvasWidth = 1000,
    maxOutputCanvasHeight = 1000
  },
  callback
) {
  const { topPercent, rightPercent, bottomPercent, leftPercent } = cropData
    ? cropData
    : { topPercent: 0, rightPercent: 1, bottomPercent: 1, leftPercent: 0 };

  const isPortrait = orientation > 4 && orientation < 9;

  // switch height and width if it's portrait
  let imgW = isPortrait ? sourceCanvas.height : sourceCanvas.width;
  let imgH = isPortrait ? sourceCanvas.width : sourceCanvas.height;

  // work out the crop sizes from the percentages
  const leftCrop = imgW * leftPercent;
  const rightCrop = imgW * (1 - rightPercent);
  const topCrop = imgH * topPercent;
  const bottomCrop = imgH * (1 - bottomPercent);
  imgW -= leftCrop + rightCrop;
  imgH -= topCrop + bottomCrop;

  // Restrict to maximum image size allowed or sourceCanvas size, whichever is smaller
  const maxW = imgW >= maxOutputCanvasWidth ? maxOutputCanvasWidth : imgW;
  const maxH = imgH >= maxOutputCanvasHeight ? maxOutputCanvasHeight : imgH;

  const widthToHeightRatio = Math.round(100 * (imgH / imgW)) / 100;
  const heightToWidthRatio = Math.round(100 * (imgW / imgH)) / 100;

  let canvasW = maxW;
  let canvasH = maxW * widthToHeightRatio;

  if (canvasH > maxH) {
    canvasH = maxH;
    canvasW = maxH * heightToWidthRatio;
  }

  const ctx = outputCanvas.getContext("2d");
  // ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

  if (resizeOutputToMatchSource) {
    outputCanvas.width = canvasW;
    outputCanvas.height = canvasH;
  }

  let xCropStart = leftCrop;
  let yCropStart = topCrop;

  // save the context so it can be reset after transform
  ctx.save();
  // transform context before drawing image
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, canvasW, 0);
      break;

    case 3:
      xCropStart = rightCrop;
      yCropStart = bottomCrop;
      ctx.transform(-1, 0, 0, -1, canvasW, canvasH);
      break;

    case 4:
      ctx.transform(1, 0, 0, -1, 0, canvasH);
      break;

    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      xCropStart = topCrop;
      yCropStart = rightCrop;
      ctx.transform(0, 1, -1, 0, canvasW, 0);
      break;

    case 7:
      ctx.transform(0, -1, -1, 0, canvasW, canvasH);
      break;

    case 8:
      // rotated 270°
      xCropStart = bottomCrop;
      yCropStart = leftCrop;
      ctx.transform(0, -1, 1, 0, 0, canvasH);
      break;
    default:
      break;
  }

  const transformedCanvasW = isPortrait ? canvasH : canvasW;
  const transformedCanvasH = isPortrait ? canvasW : canvasH;

  const transformedImgW = isPortrait ? imgH : imgW;
  const transformedImgH = isPortrait ? imgW : imgH;

  if (clearCanvas) {
    // fill with white first so transparent pngs have white rather than black bg
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, transformedImgW, transformedImgH);
  }

  // draw image: context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
  ctx.drawImage(
    sourceCanvas,
    xCropStart,
    yCropStart,
    transformedImgW,
    transformedImgH,
    0,
    0,
    transformedCanvasW,
    transformedCanvasH
  );
  // restore ensures resets transform in case another image is added
  ctx.restore();

  if (callback) callback(widthToHeightRatio, heightToWidthRatio);
}

// Draws one canvas to another restricting to a specific size
export function drawToCanvas(sourceCanvas, outputCanvas) {
  const ctx = outputCanvas.getContext("2d");
  outputCanvas.width = sourceCanvas.width;
  outputCanvas.height = sourceCanvas.height;

  // draw image: context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
  ctx.drawImage(
    sourceCanvas,
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
    0,
    0,
    outputCanvas.width,
    outputCanvas.height
  );
}

// Draws one canvas to another restricting to a specific size
export function drawStretchyToCanvas(
  sourceCanvas,
  outputCanvas,
  stretchBy,
  stretchByY,
  xPosRequested,
  yPosRequested,
  isShowingStretchLines
) {
  const sourceWidth = sourceCanvas.width;
  const sourceHeight = sourceCanvas.height;

  const xPos = xPosRequested < sourceWidth ? xPosRequested : xPosRequested - 1;
  const yPos = yPosRequested < sourceHeight ? yPosRequested : yPosRequested - 1;

  const outputCtx = outputCanvas.getContext("2d");

  // draw corners
  // top left
  outputCtx.drawImage(sourceCanvas, 0, 0, xPos, yPos, 0, 0, xPos, yPos);
  // bottom left
  outputCtx.drawImage(
    sourceCanvas,
    0,
    yPos,
    xPos,
    sourceHeight,
    0,
    yPos + stretchByY,
    xPos,
    sourceHeight
  );
  // top right
  outputCtx.drawImage(
    sourceCanvas,
    xPos,
    0,
    sourceWidth,
    yPos,
    xPos + stretchBy,
    0,
    sourceWidth,
    yPos
  );
  // bottom right
  outputCtx.drawImage(
    sourceCanvas,
    xPos,
    yPos,
    sourceWidth,
    sourceHeight,
    xPos + stretchBy,
    yPos + stretchByY,
    sourceWidth,
    sourceHeight
  );

  // stretchy bits
  // top
  outputCtx.drawImage(sourceCanvas, xPos, 0, 1, yPos, xPos, 0, stretchBy, yPos);
  // bottom
  outputCtx.drawImage(
    sourceCanvas,
    xPos,
    yPos,
    1,
    sourceHeight,
    xPos,
    yPos + stretchByY,
    stretchBy,
    sourceHeight
  );
  // left
  outputCtx.drawImage(
    sourceCanvas,
    0,
    yPos,
    xPos,
    1,
    0,
    yPos,
    xPos,
    stretchByY
  );
  // right
  outputCtx.drawImage(
    sourceCanvas,
    xPos,
    yPos,
    sourceWidth,
    1,
    xPos + stretchBy,
    yPos,
    sourceWidth,
    stretchByY
  );
  // middle
  outputCtx.drawImage(
    sourceCanvas,
    xPos,
    yPos,
    1,
    1,
    xPos,
    yPos,
    stretchBy,
    stretchByY
  );

  if (isShowingStretchLines) {
    outputCtx.strokeStyle = "#FF0000";
    outputCtx.moveTo(xPos, 0);
    outputCtx.lineTo(xPos, outputCanvas.height);

    outputCtx.moveTo(xPos + stretchBy, 0);
    outputCtx.lineTo(xPos + stretchBy, outputCanvas.height);

    outputCtx.moveTo(0, yPos);
    outputCtx.lineTo(outputCanvas.width, yPos);

    outputCtx.moveTo(0, yPos + stretchByY);
    outputCtx.lineTo(outputCanvas.width, yPos + stretchByY);

    outputCtx.stroke();
  }
}
export function createMaxSizeCanvas(
  inputCanvas,
  _maxWidth = 1000,
  _maxHeight = 1000
) {
  const { width: inputWidth, height: inputHeight } = inputCanvas;
  const maxWidth = _maxWidth ? _maxWidth : inputWidth;
  const maxHeight = _maxHeight ? _maxHeight : inputHeight;

  // get width and height restricted to maximums
  const { width: outputWidth, height: outputHeight } = getDimensionsToFit(
    inputWidth,
    inputHeight,
    maxWidth,
    maxHeight
  );

  // set up the output canvas
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;

  // draw input to output at the restricted size
  const ctx = outputCanvas.getContext("2d");
  ctx.drawImage(
    inputCanvas,
    0,
    0,
    inputWidth,
    inputHeight,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return outputCanvas;
}

export const createOrientatedCanvas = (sourceCanvas, orientation) => {
  const outputCanvas = document.createElement("canvas");
  const isPortrait = orientation > 4 && orientation < 9;

  // switch height and width if it's portrait
  let canvasW = isPortrait ? sourceCanvas.height : sourceCanvas.width;
  let canvasH = isPortrait ? sourceCanvas.width : sourceCanvas.height;

  const ctx = outputCanvas.getContext("2d");

  outputCanvas.width = canvasW;
  outputCanvas.height = canvasH;

  // transform context before drawing image
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, canvasW, 0);
      break;

    case 3:
      ctx.transform(-1, 0, 0, -1, canvasW, canvasH);
      break;

    case 4:
      ctx.transform(1, 0, 0, -1, 0, canvasH);
      break;

    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, canvasW, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, canvasW, canvasH);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, canvasH);
      break;
    default:
      break;
  }

  ctx.drawImage(sourceCanvas, 0, 0);

  return outputCanvas;
};

export const getDimensionsToFit = (
  inputWidth,
  inputHeight,
  maxWidth,
  maxHeight
) => {
  let outputWidth, outputHeight;
  const { widthToHeightRatio, heightToWidthRatio } = getDimensionRatios(
    inputWidth,
    inputHeight
  );

  // if the width need reducing, set width to max and scale height accordingly
  if (inputWidth > maxWidth) {
    outputWidth = maxWidth;
    outputHeight = outputWidth * widthToHeightRatio;

    if (outputHeight > maxHeight) {
      outputHeight = maxHeight;
      outputWidth = outputHeight * heightToWidthRatio;
    }
  }
  // if the height need reducing, set height to max and scale width accordingly
  else if (inputHeight > maxHeight) {
    outputHeight = maxHeight;
    outputWidth = outputHeight * heightToWidthRatio;
  }
  // otherwise output can match input
  else {
    outputWidth = inputWidth;
    outputHeight = inputHeight;
  }

  return { width: outputWidth, height: outputHeight };
};

export function getDimensionRatios(w, h) {
  const widthToHeightRatio = Math.round(100 * (h / w)) / 100;
  const heightToWidthRatio = Math.round(100 * (w / h)) / 100;

  return { widthToHeightRatio, heightToWidthRatio };
}
