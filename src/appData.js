export const frameOptionSettings = {
  simple: {
    frameType: "simple",
    frameBevel: 5
  },

  fancy: {
    frameType: "fancy",
    frameBevel: 0
  }
};

const defaultAppData = {
  title: "Framed",
  infoUrl: "https://artfly.io/framed/",
  defaultSaveName: "artfly-framed.jpg",
  settings: {
    frameOption: {
      label: "Frame Type",
      dividerAbove: true,
      defaultValue: "simple",
      type: "select",
      options: {
        simple: {
          name: "Simple"
        },
        fancy: {
          name: "Fancy"
        }
      }
    },

    frameColour: {
      showIfs: [{ key: "frameOption", condition: "simple" }],
      dividerAbove: true,
      label: "Frame Colour",
      type: "colour",
      defaultValue: "#242424"
    },

    mountColour: {
      label: "Mount Colour",
      type: "colour",
      defaultValue: "#f5f5f5"
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
      defaultValue: 62
    }

    // cropArtwork: {
    //   dividerAbove: true,
    //   label: "Crop Art",
    //   type: "boolean",
    //   defaultValue: false
    // }

    // cropTop: {
    //   showIfs: [{ key: "cropArtwork", condition: true }],
    //   label: "Top",
    //   type: "range",
    //   min: 0,
    //   max: 100,
    //   step: 1,
    //   defaultValue: 0
    // },

    // cropBottom: {
    //   showIfs: [{ key: "cropArtwork", condition: true }],
    //   label: "Bottom",
    //   type: "range",
    //   min: 0,
    //   max: 100,
    //   step: 1,
    //   defaultValue: 0
    // },

    // cropLeft: {
    //   showIfs: [{ key: "cropArtwork", condition: true }],
    //   label: "Left",
    //   type: "range",
    //   min: 0,
    //   max: 100,
    //   step: 1,
    //   defaultValue: 0
    // },

    // cropRight: {
    //   showIfs: [{ key: "cropArtwork", condition: true }],
    //   label: "Right",
    //   type: "range",
    //   min: 0,
    //   max: 100,
    //   step: 1,
    //   defaultValue: 0
    // }
  }
};

export const getAppData = (srcData = defaultAppData) => {
  // add easy access values from default data
  const appData = { ...srcData };
  const settingsKeys = Object.keys(srcData.settings);

  for (let key of settingsKeys) {
    const currSetting = srcData.settings[key];
    appData[key] = currSetting.defaultValue;
  }

  return appData;
};
