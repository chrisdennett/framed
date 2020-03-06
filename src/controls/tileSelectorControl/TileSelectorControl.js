import React from "react";
import styled from "styled-components";
import { tileTypes } from "../../utils";
import { TileCheckbox } from "./TileCheckbox";

export const TileSelectorControl = ({
  onUpdate,
  selectedTiles,
  currentGroupTileKeys
}) => {
  const onUpdateSelected = (key, isChecked) => {
    const newSelectedTiles = { ...selectedTiles, [key]: isChecked };
    onUpdate("selectedTiles", newSelectedTiles);
  };

  return (
    <Wrapper>
      {currentGroupTileKeys.map(key => {
        return (
          <TileCheckbox
            key={key}
            selected={selectedTiles[key]}
            tileFunction={tileTypes[key]}
            onUpdate={isChecked => onUpdateSelected(key, isChecked)}
          />
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 20px;
`;
