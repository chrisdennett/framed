const defaultAppData = {
  title: "Truchet Tiles",
  infoUrl: "https://artfly.io/little-boxes/",
  settings: {
    showKey: {
      label: "Show Key",
      type: "boolean",
      defaultValue: false
    },

    showOuterBox: {
      label: "Outer Box",
      type: "boolean",
      defaultValue: true
    },

    lineColour: {
      label: "Line Colour",
      type: "colour",
      defaultValue: "#a7589f"
    },

    lineThickness: {
      label: "Line Thickness",
      type: "range",
      min: 1,
      max: 50,
      defaultValue: 6
    },

    tilesWide: {
      label: "Tiles Wide",
      type: "range",
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 20
    },

    tilesHigh: {
      label: "Tiles High",
      type: "range",
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 40
    },

    tileGroup: {
      defaultValue: "diagonals",
      type: "select",
      presets: {
        diagonals: {
          number: 1,
          name: "2 Diagonals",
          keys: ["diagonal1", "diagonal2"],
          description:
            "Simply randomising tiles containing the 2 possible diagonal lines gives a surprisingly pleasing result.  Try deselecting and reselecting one of the tiles to flip from order to art over and over! Touch or click on the pattern to generate a new combination."
        },
        fourEdgeConnections: {
          number: 2,
          name: "4 Edge Connections",
          keys: ["cross", "cornerCurves1", "cornerCurves2"],
          description:
            "Here we've got three variations, giving a greater range of possibilities, but I reckon it's still nice with any two of them."
        }
        // EightEdgeConnections: {
        //   number: 3,
        //   name: "8 Edge Connections",
        //   keys: [
        //     "doubleLoop1",
        //     "doubleLoop2",
        //     "allLoopEnds",
        //     "crossLoops1",
        //     "crossLoops2",
        //     "crossLoopWithEnds",
        //     "downLoopWithEnds",
        //     "singleLoopWithEnds1",
        //     "singleLoopWithEnds2",
        //     "singleLoopWithEnds3",
        //     "singleLoopWithEnds4"
        //   ],
        //   description:
        //     "With double conector points on each side you end up with nice worm-like patterns."
        // }
      }
    },
    selectedTiles: {
      diagonal1: true,
      diagonal2: true,

      drawCross: false,
      drawCornerCurves1: false,
      drawCornerCurves2: false,

      doubleLoop1: false,
      doubleLoop2: false,
      allLoopEnds: false,
      crossLoops1: false,
      crossLoops2: false,
      crossLoopWithEnds: false,
      downLoopWithEnds: false,
      singleLoopWithEnds1: false,
      singleLoopWithEnds2: false,
      singleLoopWithEnds3: false,
      singleLoopWithEnds4: false
    }
  }
};

export const getAppData = (srcData = defaultAppData) => {
  // add easy access values from default data
  const appData = { ...defaultAppData };
  const settingsKeys = Object.keys(defaultAppData.settings);

  for (let key of settingsKeys) {
    appData[key] = defaultAppData.settings[key].defaultValue;
  }

  return appData;
};
