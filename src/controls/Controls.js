import React from "react";
import styled from "styled-components";
import { saveAs } from "file-saver";
import "@material/button/dist/mdc.button.css";
import { Button } from "@rmwc/button";
// comps
import SliderControl from "./sliderControl/SliderControl";
import { SwitchControl } from "./switchControl/SwitchControl";
import ColourPicker from "../components/colourPicker/ColourPicker";

const Controls = ({ appData, onUpdate, wrap = false }) => {
  const { settings } = appData;

  const updateSettings = (key, newValue) => {
    onUpdate({ ...appData, [key]: newValue });
  };

  const settingsKeys = Object.keys(settings);
  const onSaveSvgClick = ({ svgClass = "mainSVG" }) => {
    let full_svg = document.getElementsByClassName(svgClass)[0].outerHTML;
    full_svg = full_svg.split(">").join(`>`);

    var blob = new Blob([full_svg], { type: "image/svg+xml" });
    saveAs(blob, appData.defaultSaveName);
  };

  return (
    <Container>
      <Instruction>-- tap pic to regenerate! --</Instruction>

      <ControlsUI wrapControls={wrap}>
        <ButtHolder>
          <Button label="Save SVG" raised onClick={onSaveSvgClick} />
        </ButtHolder>

        {settingsKeys.map(key => {
          const currSetting = settings[key];
          const currValue = appData[key];
          const { dividerAbove } = currSetting;

          if (currSetting.showIfs) {
            for (let condition of currSetting.showIfs)
              if (appData[condition.key] !== condition.condition) {
                return null;
              }
          }

          if (currSetting.type === "colour") {
            return (
              <ControlHolder dividerAbove={dividerAbove}>
                <ColourPicker
                  key={key}
                  label={currSetting.label}
                  value={currValue}
                  onChange={value => updateSettings(key, value)}
                />
              </ControlHolder>
            );
          }

          if (currSetting.type === "boolean") {
            return (
              <ControlHolder dividerAbove={dividerAbove}>
                <SwitchControl
                  key={key}
                  label={currSetting.label}
                  value={currValue}
                  onChange={value => updateSettings(key, value)}
                />
              </ControlHolder>
            );
          }

          if (currSetting.type === "range") {
            return (
              <ControlHolder dividerAbove={dividerAbove}>
                <SliderControl
                  key={key}
                  labelStyle={{ minWidth: 150 }}
                  label={currSetting.label}
                  displayValue={true}
                  min={currSetting.min}
                  max={currSetting.max}
                  value={currValue}
                  step={currSetting.step}
                  onChange={value => updateSettings(key, value)}
                />
              </ControlHolder>
            );
          }

          return null;
        })}
      </ControlsUI>
    </Container>
  );
};

export default Controls;

// STYLES
const Container = styled.div`
  padding-top: 5px;
  color: white;

  .mdc-button--raised:not(:disabled),
  .mdc-button--unelevated:not(:disabled) {
    background-color: #ffc300;
    color: black;
    width: 100%;
  }
`;

const ControlsUI = styled.div`
  margin: 0px 10px 10px 8px;
  display: ${props => (props.wrapControls ? "flex" : "")};
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const ControlHolder = styled.div`
  border-top: ${props => (props.dividerAbove ? "1px solid #ccc" : "none")};
  margin-top: ${props => (props.dividerAbove ? "3px" : "")};
  padding: 10px 0;
`;

const ButtHolder = styled.div`
  margin: 5px 5px 15px 5px;
`;

const Instruction = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
`;
