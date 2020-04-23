import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { saveAs } from "file-saver";
// comps
//
import Display from "./display/Display";
import Controls from "./controls/Controls";
import { getAppData } from "./appData";
import useWindowDimensions from "./hooks/usWindowDimensions";
import {
  GetImage,
  createMaxSizeCanvas,
  createOrientatedCanvas,
} from "./ImageHelper";
import { TopBar } from "./topBar/TopBar";
import {
  generateTitle,
  generateDescription,
} from "./controls/piffleControl/PiffleControl";
import { useLocalStorage } from "./hooks/useLocalStorage";

const defaultPiffleData = {
  name: "Anon.",
  birthYear: "1999",
  media: "Felt tip on Scrap Paper",
  title: generateTitle(),
};

const defaultDescription = generateDescription(defaultPiffleData);
defaultPiffleData.text = defaultDescription;

export default function App() {
  const { width, height } = useWindowDimensions();
  const inMobileMode = width < 400;
  const [activePanel, setActivePanel] = React.useState(null);
  const [sourceImg, setSourceImg] = useState(null);
  // const [piffleData, setPiffleData] = useState(defaultPiffleData);
  const [piffleData, setPiffleData] = useLocalStorage(
    "piffle",
    defaultPiffleData
  );
  const [appData, setAppData] = useLocalStorage("frameAppData", getAppData());
  // const [appData, setAppData] = useState(getAppData());
  const [canvasRef, setCanvasRef] = useState(null);

  const onSaveImage = () => {
    if (canvasRef) {
      canvasRef.toBlob((blob) => {
        saveAs(blob, appData.defaultSaveName);
      });
    }
  };

  const onAddImage = (imgFile) => {
    createCanvasFromFile(imgFile, (img) => {
      setSourceImg(img);
    });
  };

  useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);
      };
      image.src = "./img/my-awesome-art.jpg";
    }
  });

  return (
    <AppHolder>
      <TopBar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        onSaveImage={onSaveImage}
        onAddImage={onAddImage}
        appData={appData}
      />

      {activePanel && (
        <Controls
          inMobileMode={inMobileMode}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          piffleData={piffleData}
          setPiffleData={setPiffleData}
          onUpdate={setAppData}
          appData={appData}
        />
      )}

      <Main top={0} bottom={0} right={0} left={0}>
        <Display
          piffle={piffleData}
          sourceImg={sourceImg}
          setCanvasRef={setCanvasRef}
          sizeInfo={{ width, height }}
          appData={appData}
        />
      </Main>
    </AppHolder>
  );
}

export const createCanvasFromFile = (file, callback) => {
  const maxOutputCanvasSize = 1000;

  GetImage(file, (sourceImg, imgOrientation) => {
    const maxWidthCanvas = createMaxSizeCanvas(
      sourceImg,
      maxOutputCanvasSize,
      maxOutputCanvasSize
    );
    const canvas = createOrientatedCanvas(maxWidthCanvas, imgOrientation);

    callback(canvas);
  });
};

// Styles
const AppHolder = styled.div`
  padding: 10;
`;

const Main = styled.div`
  padding: 10;
  position: fixed;
  left: ${(props) => props.left}px;
  right: ${(props) => props.right}px;
  top: ${(props) => props.top}px;
  bottom: ${(props) => props.bottom}px;
  overflow: hidden;
`;
