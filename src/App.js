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
import { generatePiffle } from "./controls/piffleControl/PiffleControl";

export default function App() {
  const [sourceImg, setSourceImg] = useState(null);
  const [piffleInputs, setPiffleInputs] = useState({
    name: "Chris Dennett",
    birthYear: "1975",
    media: "Sharpie Marker",
    repiffleCount: 0,
    canvasType: "Back of utility bill",
  });
  const [appData, setAppData] = useState(getAppData());
  const [canvasRef, setCanvasRef] = useState(null);
  const { width, height } = useWindowDimensions();

  const inMobileMode = width < 400;
  const piffle = generatePiffle(piffleInputs, inMobileMode);

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
      <ControlPanel top={0} width={width}>
        <Controls
          piffleInputs={piffleInputs}
          setPiffleInputs={setPiffleInputs}
          onSaveImage={onSaveImage}
          onAddImage={onAddImage}
          onUpdate={setAppData}
          appData={appData}
        />
      </ControlPanel>

      <Main top={0} bottom={0} right={0} left={0}>
        <Display
          piffle={piffle}
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

//
const AppHolder = styled.div`
  padding: 10;
`;

// const AppBar = styled.div`
//   padding: 10;
// `;

const ControlPanel = styled.div`
  padding: 10;
  position: fixed;
  z-index: 1;
  left: 0;
  top: ${(props) => props.top}px;
  bottom: 0;
  width: ${(props) => props.width}px;
  overflow: auto;
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
