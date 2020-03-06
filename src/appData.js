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
      defaultValue: 20
    },

    tilesWide: {
      label: "Tiles Wide",
      type: "range",
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 15
    },

    tilesHigh: {
      label: "Tiles High",
      type: "range",
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 15
    },

    tileGroup: {
      defaultValue: "diagonals",
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
          keys: [
            "wormCross1",
            "wormCross2",
            "wormLine1",
            "wormLine2",
            "wormCorner1",
            "wormCorner2",
            "wormCorner3",
            "wormCorner4",
            "wormCorner5",
            "wormCorner6",
            "wormEnds"
          ]
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
            "triangle4",
            "wormCross1",
            "wormCross2",
            "wormLine1",
            "wormLine2",
            "wormCorner1",
            "wormCorner2",
            "wormCorner3",
            "wormCorner4",
            "wormCorner5",
            "wormCorner6",
            "wormEnds"
          ]
        }
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
