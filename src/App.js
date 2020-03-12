import React, { useState } from "react";
import * as Space from "react-spaces";
// comps
//
import TopBar from "./top-bar/TopBar";
import Display from "./display/Display";
import Controls from "./controls/Controls";
import { getAppData } from "./appData";
import useWindowDimensions from "./hooks/usWindowDimensions";

export default function App() {
  const [appData, setAppData] = useState(getAppData());
  const [optionsVisible, setOptionsVisible] = useState(true);
  const { width } = useWindowDimensions();

  const showMenuOnLeft = width > 700 && optionsVisible;
  const showMenuAtBottom = !showMenuOnLeft && optionsVisible;

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
              onUpdate={setAppData}
              appData={appData}
              wrap={showMenuAtBottom}
            />
          </Space.LeftResizable>
        )}

        {showMenuAtBottom && (
          <Space.BottomResizable size={"30%"} scrollable={true}>
            <Controls
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
                sizeInfo={sizeInfo}
                appData={appData}
                onClick={() => setAppData({ ...appData })}
              />
            )}
          </Space.Info>
        </Space.Fill>
      </Space.Fill>
    </Space.ViewPort>
  );
}
