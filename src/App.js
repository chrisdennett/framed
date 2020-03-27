import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as Space from "react-spaces";
import fancyFrameSpriteSheet from "./spritesheet.png";
// comps
//
import TopBar from "./top-bar/TopBar";
import Display from "./display/Display";
import Controls from "./controls/Controls";
import { getAppData } from "./appData";
import useWindowDimensions from "./hooks/usWindowDimensions";
import { GetImage } from "./ImageHelper";

export default function App() {
  const [sourceImg, setSourceImg] = useState(null);
  const [spriteSheet, setSpriteSheet] = useState(null);
  const [appData, setAppData] = useState(getAppData());
  const [canvasRef, setCanvasRef] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(true);
  const { width } = useWindowDimensions();

  const showMenuOnLeft = width > 700 && optionsVisible;
  const showMenuAtBottom = !showMenuOnLeft && optionsVisible;

  const onSaveImage = () => {
    if (canvasRef) {
      canvasRef.toBlob(blob => {
        saveAs(blob, appData.defaultSaveName);
      });
    }
  };

  const onAddImage = imgFile => {
    GetImage(imgFile, img => {
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
      image.src = "./img/doug.png";
    }

    if (!spriteSheet) {
      loadImage(fancyFrameSpriteSheet, img => {
        setSpriteSheet(img);
      });
    }
  });

  return (
    <Space.ViewPort right={10} bottom={10} left={10}>
      {/* TOP BAR - uses size info to hide things */}
      <Space.Top size={60}>
        <Space.Info>
          {sizeInfo => (
            <TopBar
              title={appData.title}
              infoUrl={appData.infoUrl}
              optionsVisible={optionsVisible}
              setOptionsVisible={setOptionsVisible}
              width={sizeInfo.width}
            />
          )}
        </Space.Info>
      </Space.Top>

      {/* HOLDER for menu and main panel */}
      <Space.Fill>
        {/* MENU */}
        {showMenuOnLeft && (
          <Space.LeftResizable size={260} scrollable={true}>
            <Controls
              onSaveImage={onSaveImage}
              onAddImage={onAddImage}
              onUpdate={setAppData}
              appData={appData}
              wrap={showMenuAtBottom}
            />
          </Space.LeftResizable>
        )}

        {showMenuAtBottom && (
          <Space.BottomResizable size={"30%"} scrollable={true}>
            <Controls
              onSaveImage={onSaveImage}
              onUpdate={setAppData}
              appData={appData}
              wrap={showMenuAtBottom}
            />
          </Space.BottomResizable>
        )}

        {/* MAIN CONTENT */}
        <Space.Fill
          style={{
            borderBottom: "3px solid rgba(0, 0, 0, 0.3)",
            borderRight: "3px solid rgba(0, 0, 0, 0.3)",
            borderRadius: 10
          }}
        >
          <Space.Info>
            {sizeInfo => (
              <Display
                sourceImg={sourceImg}
                spriteSheet={spriteSheet}
                setCanvasRef={setCanvasRef}
                sizeInfo={sizeInfo}
                appData={appData}
              />
            )}
          </Space.Info>
        </Space.Fill>
      </Space.Fill>
    </Space.ViewPort>
  );
}

const loadImage = (url, callback) => {
  let sourceImg = new Image();
  sourceImg.setAttribute("crossOrigin", "anonymous"); //
  sourceImg.src = url;
  sourceImg.onload = () => {
    if (callback) callback(sourceImg);
  };
};
