const defaultAppData = {
  title: "Joy Lines",
  infoUrl: "https://artfly.io/joy-lines/",
  defaultSaveName: "artfly-joy-lines.svg",
  settings: {
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

    totalLines: {
      label: "Total Lines",
      type: "range",
      min: 1,
      max: 101,
      step: 1,
      defaultValue: 85
    },

    totalPeakWiggles: {
      label: "Peak Wiggles",
      type: "range",
      min: 1,
      max: 300,
      step: 1,
      defaultValue: 42
    },

    totalFlatWiggles: {
      label: "Flat wiggles",
      type: "range",
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 20
    },

    wiggleWidth: {
      label: "Wiggle Width",
      type: "range",
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 5
    },

    lineSpacing: {
      label: "Line Spacing",
      type: "range",
      min: 1,
      max: 250,
      step: 1,
      defaultValue: 5
    },

    maxFlatWiggleHeight: {
      label: "Max Flat Wiggle Height",
      type: "range",
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 2
    },

    maxPeakHeight: {
      label: "Max Peak Height",
      type: "range",
      min: 0,
      max: 200,
      step: 1,
      defaultValue: 20
    },

    outlineOnly: {
      label: "Outline only",
      type: "boolean",
      defaultValue: true
    },

    lineThickness: {
      label: "Line Thickness",
      type: "range",
      min: 0.1,
      max: 3,
      step: 0.1,
      defaultValue: 0.6
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
