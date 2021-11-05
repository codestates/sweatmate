import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";

const InputWrapper = styled.label`
  height: 100%;
  min-width: ${(props) => {
    if (props.sort === "운동") return "9rem";
    if (props.sort === "날짜") return "11.5rem";
    if (props.sort === "시간") return "5rem";
    return "6.5rem";
  }};
  max-width: ${(props) => {
    if (props.sort === "운동") return "12rem";
    if (props.sort === "날짜") return "15rem";
    if (props.sort === "시간") return "8rem";
    return "10rem";
  }};
  ${media.lessThan("medium")`
    min-width: unset;
    max-width: unset;
    height: fit-content;
  `};
  border-radius: 1rem;
  display: flex;
  :hover {
    background-color: var(--color-darkwhite);
  }
  position: relative;
`;

const InputArea = styled.div`
  flex: 1 1 0;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const Name = styled.div`
  padding: 0.75rem 1rem 0.25rem;
  font-size: 0.8rem;
  color: var(--color-darkgray);
  flex: 0 0 1;
`;

const Divider = styled.div`
  min-width: 1px;
  background-color: var(--color-lightgray);
  width: 1px;
  border-radius: 1px;
  margin: 0.75rem 0;
`;

const SearchInput = ({ name, children, hideDivider }) => {
  const label = useRef(null);
  return (
    <InputWrapper sort={name} ref={label}>
      <InputArea>
        <Name>{name}</Name>
        {children}
      </InputArea>
      {!hideDivider && <Divider className="divider" />}
    </InputWrapper>
  );
};

SearchInput.defaultProps = {
  hideDivider: false,
};

SearchInput.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]).isRequired,
  hideDivider: PropTypes.bool,
};

export default SearchInput;
