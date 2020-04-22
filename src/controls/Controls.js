import React from "react";
import styled from "styled-components";
import "@material/button/dist/mdc.button.css";
// comps
import SliderControl from "./sliderControl/SliderControl";
import { SwitchControl } from "./switchControl/SwitchControl";
import ColourPicker from "../components/colourPicker/ColourPicker";

import QuickSelectMenu from "../components/quickSelectControl/QuickSelectControl";
import { PiffleControl } from "./piffleControl/PiffleControl";

const Controls = ({
  appData,
  onUpdate,
  activePanel,
  piffleData,
  setPiffleData,
  inMobileMode,
}) => {
  const { settings } = appData;

  console.log("activePanel: ", activePanel);

  const updateSettings = (key, newValue) => {
    onUpdate({ ...appData, [key]: newValue });
  };

  const updateMultipleSettings = (updates) => {
    onUpdate({ ...appData, ...updates });
  };

  const settingsKeys = Object.keys(settings);

  return (
    <Holder>
      <StyledControls>
        {activePanel === "plaque" && (
          <StyledPanel>
            <ControlHolder>
              <PiffleControl
                inMobileMode={inMobileMode}
                piffleData={piffleData}
                setPiffleData={setPiffleData}
              />
            </ControlHolder>
          </StyledPanel>
        )}

        {activePanel === "frame" && (
          <StyledPanel>
            {settingsKeys.map((key) => {
              const currSetting = settings[key];
              const currValue = appData[key];
              const { dividerAbove } = currSetting;

              if (currSetting.showIfs) {
                let isAllowed = false;
                for (let condition of currSetting.showIfs) {
                  if (appData[condition.key] === condition.condition) {
                    isAllowed = true;
                  }
                }

                if (!isAllowed) return null;
              }

              if (currSetting.type === "select") {
                return (
                  <ControlHolder dividerAbove={dividerAbove} key={key}>
                    <QuickSelectMenu
                      currentOptionKey={currValue}
                      label={currSetting.label}
                      options={currSetting.options}
                      onUpdate={(selectedOption) => {
                        updateMultipleSettings({
                          [key]: selectedOption,
                          ...currSetting.options[currValue].data,
                        });
                      }}
                    />
                  </ControlHolder>
                );
              }

              if (currSetting.type === "colour") {
                return (
                  <ControlHolder dividerAbove={dividerAbove} key={key}>
                    <ColourPicker
                      label={currSetting.label}
                      value={currValue}
                      onChange={(value) => updateSettings(key, value)}
                    />
                  </ControlHolder>
                );
              }

              if (currSetting.type === "boolean") {
                return (
                  <ControlHolder dividerAbove={dividerAbove} key={key}>
                    <SwitchControl
                      label={currSetting.label}
                      value={currValue}
                      onChange={(value) => updateSettings(key, value)}
                    />
                  </ControlHolder>
                );
              }

              if (currSetting.type === "range") {
                return (
                  <ControlHolder dividerAbove={dividerAbove} key={key}>
                    <SliderControl
                      labelStyle={{ minWidth: 150 }}
                      label={currSetting.label}
                      displayValue={true}
                      min={currSetting.min}
                      max={currSetting.max}
                      value={currValue}
                      step={currSetting.step}
                      onChange={(value) => updateSettings(key, value)}
                    />
                  </ControlHolder>
                );
              }

              return null;
            })}
          </StyledPanel>
        )}
      </StyledControls>
    </Holder>
  );
};

export default Controls;

// STYLES

const StyledPanel = styled.div`
  max-width: 400px;
`;

const Holder = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  overflow-y: auto;
  z-index: 2;
`;

const StyledControls = styled.div`
  margin-top: 50px;
  border-top: ${(props) => (props.dividerAbove ? "1px solid #ccc" : "none")};
  margin-top: ${(props) => (props.dividerAbove ? "3px" : "")};
  padding: 10px;
  background: whitesmoke;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
`;

const ControlHolder = styled.div`
  padding-top: 5px;
  color: rgba(0, 0, 0, 0.7);

  .mdc-button--raised:not(:disabled),
  .mdc-button--unelevated:not(:disabled) {
    background-color: #ffc300;
    color: black;
  }
`;
