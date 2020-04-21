import React from "react";
import styled from "styled-components";
import "@rmwc/icon-button/styles";
import { IconButton } from "@rmwc/icon-button";
import PhotoSelector from "../components/photoSelector/PhotoSelector";

export const TopBar = ({
  activePanel,
  setActivePanel,
  appData,
  onSaveImage,
  onAddImage,
}) => {
  const onPanelSelect = (panelName) => {
    const newPanel = activePanel === panelName ? null : panelName;
    setActivePanel(newPanel);
  };

  const onPhotoSelected = (file) => {
    onAddImage(file);
  };

  return (
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
  );
};

const StyledTopBar = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  right: 0;
  left: 0;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  color: rgba(0, 0, 0, 0.7);
`;
