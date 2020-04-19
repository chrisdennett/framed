import React from "react";
import styled from "styled-components";
import "@material/button/dist/mdc.button.css";
// comps
import SliderControl from "./sliderControl/SliderControl";
import { SwitchControl } from "./switchControl/SwitchControl";
import ColourPicker from "../components/colourPicker/ColourPicker";
import PhotoSelector from "../components/photoSelector/PhotoSelector";
import QuickSelectMenu from "../components/quickSelectControl/QuickSelectControl";
import { PiffleControl } from "./piffleControl/PiffleControl";
import "@rmwc/icon-button/styles";
import { IconButton } from "@rmwc/icon-button";

const Controls = ({
  appData,
  onUpdate,
  wrap = false,
  onSaveImage,
  onAddImage,
  piffleInputs,
  setPiffleInputs,
}) => {
  const [activePanel, setActivePanel] = React.useState("plaque");
  const { settings } = appData;

  const updateSettings = (key, newValue) => {
    onUpdate({ ...appData, [key]: newValue });
  };

  const updateMultipleSettings = (updates) => {
    onUpdate({ ...appData, ...updates });
  };

  const onPhotoSelected = (file) => {
    onAddImage(file);
  };

  const settingsKeys = Object.keys(settings);

  const onPanelSelect = (panelName) => {
    const newPanel = activePanel === panelName ? null : panelName;
    setActivePanel(newPanel);
  };

  return (
    <Container>
      <StyledTopBar>
        <IconButton
          style={activePanel === "plaque" ? { color: "red" } : null}
          label="plaque words"
          icon="assignment"
          onClick={() => onPanelSelect("plaque")}
        />
        <IconButton
          style={activePanel === "frame" ? { color: "red" } : null}
          label="frame options"
          icon="filter_frames"
          onClick={() => onPanelSelect("frame")}
        />
        <PhotoSelector onPhotoSelected={onPhotoSelected} />
        <IconButton label="SAVE" icon="save" onClick={onSaveImage} />
        <IconButton
          tag="a"
          label="info"
          icon="info"
          href={appData.infoUrl}
          target="_blank"
        />
      </StyledTopBar>

      {activePanel === "plaque" && (
        <ControlHolder>
          <PiffleControl
            piffleInputs={piffleInputs}
            setPiffleInputs={setPiffleInputs}
          />
        </ControlHolder>
      )}

      {activePanel === "frame" && (
        <div>
          {settingsKeys.map((key) => {
            const currSetting = settings[key];
            const currValue = appData[key];
            const { dividerAbove } = currSetting;

            if (currSetting.showIfs) {
              for (let condition of currSetting.showIfs)
                if (appData[condition.key] !== condition.condition) {
                  return null;
                }
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
        </div>
      )}
    </Container>
  );
};

export default Controls;

// STYLES
const Container = styled.div`
  padding-top: 5px;
  color: rgba(0, 0, 0, 0.7);

  .mdc-button--raised:not(:disabled),
  .mdc-button--unelevated:not(:disabled) {
    background-color: #ffc300;
    color: black;
    width: 100%;
  }
`;

const StyledTopBar = styled.div`
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const ControlHolder = styled.div`
  border-top: ${(props) => (props.dividerAbove ? "1px solid #ccc" : "none")};
  margin-top: ${(props) => (props.dividerAbove ? "3px" : "")};
  padding: 10px;
  max-width: 200px;
  background: whitesmoke;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
`;
