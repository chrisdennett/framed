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

/*
OLD
export function drawStretchyToCanvas(sourceCanvas, outputCanvas, stretchBy, xPosRequested) {

gcloud init && git config credential.https://source.developers.google.com.helper gcloud.cmd

git remote add google https://source.developers.google.com/p/artfly-lab/r/DEV

https://source.developers.google.com/p/artfly-lab/r/main

    const sourceWidth = sourceCanvas.width;
    const sourceHeight = sourceCanvas.height;

    const xPos = xPosRequested < sourceWidth ? xPosRequested : xPosRequested - 1;

    const sourceCtx = sourceCanvas.getContext('2d');
    let imageData = sourceCtx.getImageData(0, 0, sourceWidth, sourceHeight);
    let data = imageData.data;
    let newArray = [], red, green, blue, alpha;

    for (let i = 0; i < data.length; i += 4) {

        const x = (i / 4) % sourceWidth;
        // const y = Math.floor((i / 4) / sourceWidth);

        red = data[i];
        green = data[i+1];
        blue = data[i+2];
        alpha = data[i+3];

        newArray.push(red, green, blue, alpha);

        if (x === xPos) {

            for(let j=0; j<stretchBy; j++){
                newArray.push(red, green, blue, alpha);
            }
        }
    }

    const uArr = Uint8ClampedArray.from(newArray);
    const newImageData = new ImageData(uArr, sourceWidth+stretchBy, sourceHeight);


    const ctx = outputCanvas.getContext('2d');
    ctx.putImageData(newImageData, 0, 0);

    // draw image: context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
    // ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, 0,0,outputCanvas.width, outputCanvas.height);
}

*/
