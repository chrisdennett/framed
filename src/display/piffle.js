export const drawPifflePlaque = ({ piffle, x, y, width }) => {
  const plaqueCanvas = document.createElement("canvas");
  const ctx = plaqueCanvas.getContext("2d");
  plaqueCanvas.width = width;

  const plaqueX = x;
  const plaqueY = y;
  const maxPlaqueWidth = width;
  let targetTitleFontSize = maxPlaqueWidth * 0.03;
  if (targetTitleFontSize < 18) targetTitleFontSize = 18;
  if (targetTitleFontSize > 22) targetTitleFontSize = 22;
  const startY = targetTitleFontSize / 2; //Math.min(30, width * 0.07);
  let widestTextWidth = 0;

  console.log("maxPlaqueWidth: ", maxPlaqueWidth);

  // TEXT
  ctx.fillStyle = "#333";
  const textX = plaqueX;
  let textY = plaqueY + startY * 2;

  // add name line
  const nameText = `${piffle.name}`;
  const { fontSize: nameFontSize, endWidth } = reduceFontSizeToFit(
    ctx,
    targetTitleFontSize,
    nameText,
    ` (b.${piffle.birthYear})`,
    maxPlaqueWidth,
    textX,
    textY
  );

  if (endWidth > widestTextWidth) widestTextWidth = endWidth;

  // add title line
  textY += nameFontSize * 1.1;
  const titleText = `${piffle.title},`;
  const titleText2 = ` ${new Date().getFullYear()}`;
  const { fontSize: titleFontSize, endWidth: w2 } = reduceFontSizeToFit(
    ctx,
    nameFontSize,
    titleText,
    titleText2,
    maxPlaqueWidth,
    textX,
    textY
  );

  if (w2 > widestTextWidth) widestTextWidth = w2;

  // add medium on canvas line
  textY += nameFontSize;
  const mediumLine = `${piffle.media}`;
  const { fontSize: mediumFontSize, endWidth: w3 } = reduceFontSizeToFit(
    ctx,
    titleFontSize,
    "",
    mediumLine,
    maxPlaqueWidth,
    textX,
    textY
  );

  if (w3 > widestTextWidth) widestTextWidth = w3;
  const textHeight = textY + mediumFontSize * 0.4;

  return {
    plaqueCanvas,
    plaqueTextWidth: widestTextWidth,
    plaqueTextHeight: textHeight,
  };
};

const reduceFontSizeToFit = (ctx, startFontSize, text1, text2, width, x, y) => {
  let testFontSize = startFontSize;
  let textWidth, text1Width, text2Width;
  let count = 0;
  let textTooBig = true;

  while (textTooBig) {
    ctx.font = `bold ${testFontSize}px Calibri`;
    text1Width = ctx.measureText(text1).width;

    ctx.font = `${testFontSize - 3}px Calibri`;
    text2Width = ctx.measureText(text2).width;
    textWidth = text1Width + text2Width;

    textTooBig = textWidth > width;

    testFontSize--;

    // safety valve
    count++;
    if (count > 1000) break;
  }

  ctx.font = `bold ${testFontSize}px Calibri`;
  ctx.fillText(text1, x, y);
  text1Width = ctx.measureText(text1).width;
  ctx.font = `${testFontSize - 3}px Calibri`;
  ctx.fillText(text2, x + text1Width, y);
  text2Width = ctx.measureText(text2).width;

  return { fontSize: testFontSize, endWidth: x + text1Width + text2Width };
};

// wrapText(
//   ctx,
//   piffle.text,
//   textX,
//   textY + textPadding,
//   maxPlaqueWidth - textPadding * 2,
//   mainFontSize * 1.2
// );

// function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
//   var words = text.split(" ");
//   var line = "";

//   for (var n = 0; n < words.length; n++) {
//     var testLine = line + words[n] + " ";
//     var metrics = ctx.measureText(testLine);
//     var testWidth = metrics.width;
//     if (testWidth > maxWidth && n > 0) {
//       ctx.fillText(line, x, y);
//       line = words[n] + " ";
//       y += lineHeight;
//     } else {
//       line = testLine;
//     }
//   }
//   ctx.fillText(line, x, y);
// }
