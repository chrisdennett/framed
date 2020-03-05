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
