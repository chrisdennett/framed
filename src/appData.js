const defaultAppData = {
  title: "Joy Lines",
  infoUrl: "https://artfly.io/joy-lines/",
  defaultSaveName: "artfly-joy-lines.svg",
  settings: {
    outlineOnly: {
      label: "Outline only",
      type: "boolean",
      defaultValue: false
    },

    lineColour: {
      label: "Line Colour",
      type: "colour",
      defaultValue: "#000"
    },

    mountainColour: {
      label: "Mountain Colour",
      type: "colour",
      defaultValue: "#fff"
    },

    bgColour: {
      label: "Background Colour",
      type: "colour",
      defaultValue: "#f2d739"
    },

    lineThickness: {
      label: "Line Thickness",
      type: "range",
      min: 1,
      max: 50,
      defaultValue: 1.5
    },

    boxesWide: {
      label: "Wiggles Wide",
      type: "range",
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 20
    },

    boxesHigh: {
      label: "Tiles High",
      type: "range",
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 20
    },

    boxWidth: {
      label: "Lines width",
      type: "range",
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 15
    },

    boxHeight: {
      label: "Line Spacing",
      type: "range",
      min: 1,
      max: 250,
      step: 1,
      defaultValue: 20
    },

    maxPeakHeightFraction: {
      label: "Max Peak Height",
      type: "range",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.3
    },

    flatWidthFraction: {
      label: "Flat width",
      type: "range",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.3
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
