import React from "react";
import styled from "styled-components";
import "@material/tab-bar/dist/mdc.tab-bar.css";
import "@material/tab/dist/mdc.tab.css";
import "@material/tab-scroller/dist/mdc.tab-scroller.css";
import "@material/tab-indicator/dist/mdc.tab-indicator.css";
import { TabBar, Tab } from "@rmwc/tabs";

export const TabsControl = ({ activeTabIndex, setActiveTabIndex }) => {
  return (
    <Wrapper>
      <TabBar
        activeTabIndex={activeTabIndex}
        onActivate={e => setActiveTabIndex(e.detail.index)}
      >
        <StyledTab>Tiles</StyledTab>
        <StyledTab>Settings</StyledTab>
      </TabBar>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-right: 10px;
`;

const StyledTab = styled(Tab)`
  .mdc-tab__text-label {
    color: white;
  }

  .mdc-tab-indicator__content--underline {
    border-color: white;
  }
`;
