import * as tiles from "./tiles";

export const getRandomTilesData = ({
  tileOptions,
  tileWidth,
  tileHeight,
  tilesWide,
  tilesHigh
}) => {
  const tileDataArray = [];

  // if no options available return an empty array
  if (tileOptions.length === 0) return tileDataArray;

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
        func: tileTypes[tileKey]
      };

      tileDataArray.push(tileData);
    }
  }

  return tileDataArray;
};

export const getTileKeysForGroup = (appData, groupKey) => {
  return appData.settings.tileGroup.presets[groupKey].keys;
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

export const tileTypes = {
  diagonal1: tiles.getTileOne,
  diagonal2: tiles.getTileTwo,
  cross: tiles.getTileThree,
  cornerCurves1: tiles.getTileFour,
  cornerCurves2: tiles.getTileFive,
  triangle1: tiles.getTileSix,
  triangle2: tiles.getTileSeven,
  triangle3: tiles.getTileEight,
  triangle4: tiles.getTileNine,
  wormCross1: tiles.getWormCross1,
  wormCross2: tiles.getWormCross2,
  wormLine1: tiles.getWormLine1,
  wormLine2: tiles.getWormLine2
};
