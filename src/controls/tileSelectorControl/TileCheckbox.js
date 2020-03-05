import React from "react";
import styled from "styled-components";
import "@material/checkbox/dist/mdc.checkbox.css";
import "@material/form-field/dist/mdc.form-field.css";
import { Checkbox } from "@rmwc/checkbox";

export const TileCheckbox = ({
  tileFunction,
  tileWidth = 50,
  tileHeight = 50,
  strokeThickness = 1,
  lineColour = "white",
  selected,
  onUpdate
}) => {
  const tile = tileFunction({
    lineColour,
    lineThickness: strokeThickness,
    width: tileWidth,
    height: tileHeight,
    x: 0,
    y: 0,
    fill: "#fff"
  });

  return (
    <StyledCheckbox
      checked={selected || false}
      onChange={e => onUpdate(e.target.checked)}
    >
      <svg width={tileWidth + 10} height={tileHeight + 10}>
        <g fill={"none"}>{tile}</g>
        <rect
          x={0}
          y={0}
          width={tileWidth}
          height={tileHeight}
          strokeWidth={2}
          stroke={"white"}
          fill={"none"}
        />
      </svg>
    </StyledCheckbox>
  );
};

const StyledCheckbox = styled(Checkbox)`
  font-size: 42px;
  .mdc-checkbox__checkmark {
    color: black;
  }

  .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background {
    background-color: white;
    border: white 1px solid;
  }

  svg polygon {
    stroke: none;
  }
`;
