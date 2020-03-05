import {
  getTileSeven,
  getTileSix,
  getTileFive,
  getTileFour,
  getTileThree,
  getTileTwo,
  getTileOne,
  getTileEight,
  getTileNine
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

export const tileTypes = {
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
  },
  triangle1: {
    name: "6",
    func: getTileSix
  },
  triangle2: {
    name: "7",
    func: getTileSeven
  },
  triangle3: {
    name: "8",
    func: getTileEight
  },
  triangle4: {
    name: "9",
    func: getTileNine
  }
};
