const defaultAppData = {
  title: "Tiles with Rules",
  infoUrl: "https://artfly.io/binary-hands",
  settings: {
    showKey: {
      label: "Show Key",
      type: "boolean",
      defaultValue: true
    },

    showOuterBox: {
      label: "Outer Box",
      type: "boolean",
      defaultValue: true
    },

    lineColour: {
      label: "Line Colour",
      type: "colour",
      defaultValue: "#4db39e"
    },

    lineThickness: {
      label: "Line Thickness",
      type: "range",
      min: 1,
      max: 10,
      defaultValue: 2.5
    },

    tilesWide: {
      label: "Tiles Wide",
      type: "range",
      min: 1,
      max: 50,
      step: 1,
      discrete: true,
      defaultValue: 25
    },

    tilesHigh: {
      label: "Tiles High",
      type: "range",
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 25
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
