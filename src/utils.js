import React from "react";
import {
  getTileFive,
  getTileFour,
  getTileThree,
  getTileTwo,
  getTileOne
} from "./tiles";

export const getRandomTilesData = ({
  tileOptions,
  tileWidth,
  tileHeight,
  tilesWide,
  tilesHigh
}) => {
  const tileDataArray = [];

  for (let tileRow = 0; tileRow < tilesHigh; tileRow++) {
    for (let tileCol = 0; tileCol < tilesWide; tileCol++) {
      const randKeyIndex = Math.floor(Math.random() * tileOptions.length);
      const tileKey = tileOptions[randKeyIndex];

      let tileData = {
        x: tileCol * tileWidth,
        y: tileRow * tileHeight,
        width: tileWidth,
        height: tileHeight,
        key: tileKey,
        func: tileTypes[tileKey].func
      };

      tileDataArray.push(tileData);
    }
  }

  return tileDataArray;
};

export const GetTiles = ({
  tileOptions,
  tileWidth,
  tileHeight,
  tilesWide,
  tilesHigh,
  lineColour,
  lineThickness = 2
}) => {
  const randTileData = getRandomTilesData({
    tileOptions,
    tileWidth,
    tileHeight,
    tilesWide,
    tilesHigh
  });

  const tiles = [];

  for (let titleInfo of randTileData) {
    if (titleInfo) {
      tiles.push(
        titleInfo.func({
          lineColour,
          lineThickness,
          width: tileWidth,
          height: tileHeight,
          x: titleInfo.x,
          y: titleInfo.y,
          fill: "#fff"
        })
      );
    }
  }

  return tiles;
};

export const getTileTypes = ({
  tileWidth = 350,
  tileHeight = 350,
  lineColour = "#000",
  lineThickness = 2,
  tightLinesPerHeight,
  midLinesPerHeight,
  looseLinesPerHeight
}) => {
  const tileKeys = Object.keys(tileTypes);
  const tiles = [];

  const hatchLooseSpacing = tileHeight / looseLinesPerHeight;
  const hatchMediumSpacing = tileHeight / midLinesPerHeight;
  const hatchTightSpacing = tileHeight / tightLinesPerHeight;

  const totalTightHatchLines = tileHeight / hatchTightSpacing;
  const totalMediumHatchLines = tileHeight / hatchMediumSpacing;
  const totalLooseHatchLines = tileHeight / hatchLooseSpacing;

  let x = 0;
  let y = 0;
  const padding = 40;
  const fontSize = 80;

  for (let key of tileKeys) {
    const titleInfo = tileTypes[key];

    tiles.push(
      titleInfo.func({
        lineColour,
        lineThickness,
        width: tileWidth,
        height: tileHeight,
        x: x,
        y: y,
        fill: "#fff",
        totalTightStripes: totalTightHatchLines / 2,
        totalMediumHatchLines: totalMediumHatchLines,
        totalLooseHatchLines: totalLooseHatchLines / 2,
        stripeSpacing: hatchMediumSpacing,
        options: { top: true, bottom: true, left: true, right: true }
      })
    );

    tiles.push(
      <rect
        key={"rect" + x + "" + y}
        x={x}
        y={y}
        width={tileWidth}
        height={tileHeight}
        fill={"none"}
        stroke={lineColour}
        strokeWidth={4}
      />
    );

    tiles.push(
      <text
        key={"text" + x + "" + y}
        x={x + tileWidth + padding}
        y={y + (fontSize + tileHeight) / 2}
        style={{ font: `normal ${fontSize}px sans-serif`, fill: lineColour }}
      >
        #{titleInfo.name}
      </text>
    );

    y += tileHeight + padding;
  }

  return tiles;
};

const tileTypes = {
  diagonal1: {
    name: "1",
    func: getTileOne
  },
  diagonal2: {
    name: "2",
    func: getTileTwo
  },
  cross: {
    name: "3",
    func: getTileThree
  },
  cornerCurves1: {
    name: "4",
    func: getTileFour
  },
  cornerCurves2: {
    name: "5",
    func: getTileFive
  }
};
