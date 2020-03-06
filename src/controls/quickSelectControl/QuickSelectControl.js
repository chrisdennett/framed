import React from "react";
import styled from "styled-components";

import "@material/select/dist/mdc.select.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import "@material/list/dist/mdc.list.css";
import "@material/menu/dist/mdc.menu.css";
import "@material/menu-surface/dist/mdc.menu-surface.css";
import { Select } from "@rmwc/select";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";

const QuickSelectMenu = ({ currentOptionKey, options = {}, onUpdate }) => {
  const optionKeys = Object.keys(options);
  const totalOptions = optionKeys.length;
  const currOptionIndex = optionKeys.indexOf(currentOptionKey);
  const nextOptionIndex =
    currOptionIndex < totalOptions - 1 ? currOptionIndex + 1 : 0;
  const prevOptionIndex =
    currOptionIndex > 0 ? currOptionIndex - 1 : totalOptions - 1;

  const optionNames = optionKeys.map(key => options[key].name);

  const onSelect = e => {
    const optionName = e.target.value;
    const optionKey = optionKeys.filter(
      key => options[key].name === optionName
    )[0];

    onUpdate(optionKey);
  };

  return (
    <Container>
      <NavButton onClick={() => onUpdate(optionKeys[prevOptionIndex])}>
        <MdSkipPrevious />
      </NavButton>

      <Select
        style={{ maxWidth: 120, fontSize: 14 }}
        value={options[currentOptionKey].name}
        label="Tile Group"
        onChange={onSelect}
        options={optionNames}
      />

      <NavButton onClick={() => onUpdate(optionKeys[nextOptionIndex])}>
        <MdSkipNext />
      </NavButton>
    </Container>
  );
};

export default QuickSelectMenu;

const Container = styled.div`
  display: block;
  width: 100%;
  text-align: center;

  .mdc-select__native-control {
    padding-right: 10px;
    padding-left: 5px;
  }

  .mdc-select {
    option {
      color: black;
    }

    .mdc-select__dropdown-icon {
      display: none;
    }
  }

  .mdc-select:not(.mdc-select--disabled) {
    background: #3e3e3e;

    .mdc-select__native-control {
      border-color: white;
    }

    .mdc-select:not(.mdc-select--disabled).mdc-select--focused
      .mdc-line-ripple {
      background-color: white;
    }

    .mdc-select--focused .mdc-floating-label {
      color: white;
    }

    .mdc-select__native-control {
      color: white;
    }

    .mdc-floating-label {
      color: rgba(255, 255, 255, 0.7) !important;
      left: 0px;
    }
  }
`;

const NavButton = styled.button`
  padding: 10px;
  font-size: 20px;
  border: none;
  background: #3e3e3e;
  color: white;
`;
