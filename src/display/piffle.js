export const drawPifflePlaque = ({ ctx, piffle, x, y, height, width }) => {
  //ctx.fillText(piffle.text, 50, frameY + frameHeight + 80);

  const plaqueX = x;
  const plaqueY = y;
  const maxPlaqueWidth = width;
  const titleFontSize = height >= 300 ? 24 : 22;
  const mainFontSize = height >= 300 ? 18 : 16;
  const textPadding = height >= 300 ? 25 : 15;

  // add card bg
  ctx.fillStyle = "#efefef";

  ctx.save();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 2;
  ctx.shadowColor = `rgba(0, 0, 0, 0.4)`;
  ctx.fillRect(plaqueX, plaqueY, maxPlaqueWidth, height);

  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = -3;
  ctx.shadowBlur = 2;
  ctx.shadowColor = `rgba(255, 255, 255, 0.6)`;

  ctx.fillRect(plaqueX, plaqueY, maxPlaqueWidth, height);
  ctx.restore();

  // TEXT

  ctx.fillStyle = "#333";
  const textX = plaqueX + textPadding;
  let textY = plaqueY + textPadding + titleFontSize;

  // add name line
  const nameText = `${piffle.name}  `;
  ctx.font = `bold ${titleFontSize}px Calibri`;
  ctx.fillText(nameText, textX, textY);
  //
  const nameText2 = `(b.${piffle.birthYear})`;
  ctx.font = `${titleFontSize}px Calibri`;
  ctx.fillText(nameText2, textX + ctx.measureText(nameText).width, textY);

  // add title line
  textY += titleFontSize;
  const titleText = `${piffle.title},  `;
  ctx.font = `bold italic ${titleFontSize}px Calibri`;
  ctx.fillText(titleText, textX, textY);
  //
  const titleText2 = `${new Date().getFullYear()}`;
  ctx.font = `${titleFontSize}px Calibri`;
  ctx.fillText(titleText2, textX + ctx.measureText(titleText).width, textY);

  textY += titleFontSize;
  ctx.font = `${mainFontSize}px Calibri`;

  // add medium on canvas line
  const mediumLine = `${piffle.media} on ${piffle.canvasType}`;
  ctx.fillText(mediumLine, textX, textY);

  textY += titleFontSize;

  wrapText(
    ctx,
    piffle.text,
    textX,
    textY + textPadding,
    maxPlaqueWidth - textPadding * 2,
    mainFontSize * 1.2
  );
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  var words = text.split(" ");
  var line = "";

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
