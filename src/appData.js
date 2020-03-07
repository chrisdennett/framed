const defaultAppData = {
  title: "Jumbled Boxes",
  infoUrl: "https://artfly.io/jumbled-boxes/",
  settings: {
    outlineOnly: {
      label: "Outline only",
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
      defaultValue: 1
    },

    boxesWide: {
      label: "Boxes Wide",
      type: "range",
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 15
    },

    boxesHigh: {
      label: "Tiles High",
      type: "range",
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 30
    },

    boxWidth: {
      label: "Box Width",
      type: "range",
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 15
    },

    boxHeight: {
      label: "Box Height",
      type: "range",
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 15
    },

    maxXOffset: {
      label: "Max X Offset",
      type: "range",
      min: 1,
      max: 20,
      step: 1,
      defaultValue: 5
    },

    maxYOffset: {
      label: "Max Y Offset",
      type: "range",
      min: 1,
      max: 20,
      step: 1,
      defaultValue: 5
    },

    maxRotationOffset: {
      label: "Max Rotation Offset",
      type: "range",
      min: 1,
      max: 180,
      step: 1,
      defaultValue: 10
    },

    effectMultipler: {
      label: "Effect Multiplier",
      type: "range",
      min: 1,
      max: 10,
      step: 0.1,
      defaultValue: 1
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
