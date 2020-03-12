const defaultAppData = {
  title: "Joy Lines",
  infoUrl: "https://artfly.io/joy-lines/",
  defaultSaveName: "artfly-joy-lines.svg",
  settings: {
    outlineOnly: {
      dividerAbove: true,
      label: "Outline only",
      type: "boolean",
      defaultValue: false
    },

    diffMountainColour: {
      showIfs: [{ key: "outlineOnly", condition: false }],
      label: "Diff Mountain Colour",
      type: "boolean",
      defaultValue: true
    },

    lineColour: {
      dividerAbove: true,
      label: "Line Colour",
      type: "colour",
      defaultValue: "#000"
    },

    bgColour: {
      label: "Background Colour",
      type: "colour",
      defaultValue: "#f2d739"
    },

    mountainColour: {
      showIfs: [
        { key: "outlineOnly", condition: false },
        { key: "diffMountainColour", condition: true }
      ],
      label: "Mountain Colour",
      type: "colour",
      defaultValue: "#fff"
    },

    totalLines: {
      dividerAbove: true,
      label: "Total Lines",
      type: "range",
      min: 1,
      max: 201,
      step: 1,
      defaultValue: 32
    },

    lineSpacing: {
      label: "Line Spacing",
      type: "range",
      min: 1,
      max: 250,
      step: 1,
      defaultValue: 28
    },

    totalPeakWiggles: {
      dividerAbove: true,
      label: "Peak Wiggles",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 24
    },

    totalFlatWiggles: {
      label: "Flat wiggles",
      type: "range",
      min: 0,
      max: 50,
      step: 1,
      defaultValue: 1
    },

    maxPeakHeight: {
      dividerAbove: true,
      label: "Max Peak Height",
      type: "range",
      min: 0,
      max: 250,
      step: 1,
      defaultValue: 120
    },

    maxFlatWiggleHeight: {
      label: "Max Flat Wiggle Height",
      type: "range",
      min: 0,
      max: 3,
      step: 0.1,
      defaultValue: 0
    },

    wiggleWidth: {
      label: "Wiggle Width (roundness)",
      type: "range",
      min: 3,
      max: 50,
      step: 1,
      defaultValue: 42
    },

    lineThickness: {
      dividerAbove: true,
      label: "Line Thickness",
      type: "range",
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 3
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
