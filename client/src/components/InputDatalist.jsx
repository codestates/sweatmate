import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import DataListInput from "react-plain-datalist-input";
import PropTypes from "prop-types";
import { IoCloseCircle } from "react-icons/io5";

const Container = styled.div`
  width: 100%;
  .datalist-input {
    padding-bottom: 0.75rem;
  }
  .autocomplete-input {
    padding: 0 1rem;
    ::placeholder {
      color: var(--color-gray);
      font-family: Interop-Light;
    }
    outline: none;
    font-size: 1rem;
    margin-top: 0.25rem;
    width: 100%;
  }
  .datalist-items {
    min-width: calc(100% + 4rem);
    margin-top: 1.5rem;
    max-height: 15rem;
    font-size: 1.125rem;
    background-color: var(--color-white);
    border-radius: 1rem;
    filter: drop-shadow(0px 6px 10px var(--color-shadow));
    overflow: auto;
    > * {
      padding: 1rem;
      :hover {
        background-color: var(--color-maingreen--10);
      }
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
  .datalist-active-item {
    background-color: var(--color-maingreen--25);
    :hover {
      background-color: var(--color-maingreen--25);
    }
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  font-size: 1.25rem;
  color: var(--color-lightgray);
  :hover {
    color: var(--color-gray);
  }
`;

const HomeDatalist = ({ values, placeholder }) => {
  const [item, setItem] = useState("");
  const onSelect = useCallback((selectedItem) => {
    setItem(selectedItem.label);
  }, []);
  const onInput = (newValue) => {
    setItem(newValue);
  };
  const items = useMemo(
    () =>
      values.map((oneItem) => {
        const valueList = {};
        valueList.key = oneItem.id;
        if (oneItem.sportName) {
          valueList.label = oneItem.sportName + oneItem.sportEmoji;
        }
        if (oneItem.areaName) {
          valueList.label = oneItem.areaName;
        }
        if (oneItem.timeName) {
          valueList.label = oneItem.timeName;
        }
        return { ...valueList };
      }),
    [values]
  );
  const match = (currentInput, item) => {
    return item.label.toLowerCase().includes(currentInput.toLowerCase());
  };
  const handleClearClick = () => {
    setItem("");
  };
  return (
    <Container>
      <DataListInput
        placeholder={placeholder}
        items={items}
        value={item}
        onSelect={onSelect}
        onInput={onInput}
        match={match}
      />
      {item && (
        <ClearBtn onClick={handleClearClick}>
          <IoCloseCircle />
        </ClearBtn>
      )}
    </Container>
  );
};

HomeDatalist.propTypes = {
  values: PropTypes.arrayOf(PropTypes.any).isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default HomeDatalist;
