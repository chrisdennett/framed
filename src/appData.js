const defaultAppData = {
  title: "Truchet Tiles",
  infoUrl: "https://artfly.io/little-boxes/",
  settings: {
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
      defaultValue: 4
    },

    tilesHigh: {
      label: "Tiles High",
      type: "range",
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 4
    },

    tileGroup: {
      defaultValue: "worms",
      type: "select",
      presets: {
        diagonals: {
          number: 1,
          name: "Diagonals",
          keys: ["diagonal1", "diagonal2"]
        },
        triangles: {
          number: 2,
          name: "Triangles",
          keys: ["triangle1", "triangle2", "triangle3", "triangle4"]
        },
        edgeCurves: {
          number: 3,
          name: "Edge Curves",
          keys: ["cross", "cornerCurves1", "cornerCurves2"]
        },
        worms: {
          number: 4,
          name: "Worms",
          keys: ["wormCross1", "wormCross2", "wormLine1", "wormLine2"]
        },
        custom: {
          number: 5,
          name: "Pick and Mix",
          keys: [
            "diagonal1",
            "diagonal2",
            "cross",
            "cornerCurves1",
            "cornerCurves2",
            "triangle1",
            "triangle2",
            "triangle3",
            "triangle4"
          ],
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
    }
  }
};

export const getAppData = (srcData = defaultAppData) => {
  // add easy access values from default data
  const appData = { ...srcData };
  const settingsKeys = Object.keys(srcData.settings);

  for (let key of settingsKeys) {
    const currSetting = srcData.settings[key];

    // tile selects need to be treated a bit differently
    if (currSetting.type === "select") {
      const { presets } = currSetting;
      // const { presets, defaultValue } = currSetting;
      const presetKeys = Object.keys(presets);
      let allTileKeys = [];
      const selectedTiles = {};
      // for each preset.keys
      for (let key of presetKeys) {
        allTileKeys = allTileKeys.concat(presets[key].keys);
      }

      for (let tileKey of allTileKeys) {
        selectedTiles[tileKey] = true;
      }

      appData.selectedTiles = selectedTiles;
    }

    appData[key] = srcData.settings[key].defaultValue;
  }

  return appData;
};
