const defaultAppData = {
  title: "Framed",
  infoUrl: "https://artfly.io/framed/",
  defaultSaveName: "artfly-framed.jpg",
  settings: {
    useFancyFrame: {
      dividerAbove: true,
      label: "Fancy Frame",
      type: "boolean",
      defaultValue: true
    },

    frameColour: {
      dividerAbove: true,
      label: "Frame Colour",
      type: "colour",
      defaultValue: "#000000"
    },

    mountColour: {
      label: "Mount Colour",
      type: "colour",
      defaultValue: "#f2d739"
    },

    frameThickness: {
      dividerAbove: true,
      label: "Frame Thickness",
      type: "range",
      min: 1,
      max: 201,
      step: 1,
      defaultValue: 32
    },

    mountThickness: {
      label: "Mount Thickness",
      type: "range",
      min: 1,
      max: 201,
      step: 1,
      defaultValue: 32
    },

    cropArtwork: {
      dividerAbove: true,
      label: "Crop Art",
      type: "boolean",
      defaultValue: false
    },

    cropTop: {
      showIfs: [{ key: "cropArtwork", condition: true }],
      label: "Top",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 0
    },

    cropBottom: {
      showIfs: [{ key: "cropArtwork", condition: true }],
      label: "Bottom",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 0
    },

    cropLeft: {
      showIfs: [{ key: "cropArtwork", condition: true }],
      label: "Left",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 0
    },

    cropRight: {
      showIfs: [{ key: "cropArtwork", condition: true }],
      label: "Right",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 0
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
