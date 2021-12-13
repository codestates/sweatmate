import React, { useRef } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";

const InputWrapper = styled.label`
  height: ${(props) => (props.isInModal ? "4rem" : "100%")};
  ${media.greaterThan("medium")`
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
    ${(props) =>
      props.isInModal &&
      css`
        max-width: 18.5rem;
      `}
  `};
  border-radius: 1rem;
  border: ${(props) => (props.isInModal ? "1px solid var(--color-lightgray)" : "")};
  display: flex;
  :hover {
    ${media.greaterThan("medium")`
      background-color: var(--color-darkwhite);
    `};
  }
  position: relative;
  .bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 4rem;
    border: 1px solid var(--color-lightgray);
    border-radius: 1rem;
    z-index: -1;
    ${media.greaterThan("medium")`
      display: none;
    `};
  }
`;

const InputArea = styled.div`
  flex: 1 1 0;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0.75rem 0;
  ${media.lessThan("medium")`
    height: fit-content;
  `};
`;

const Name = styled.div`
  margin: 0 1rem;
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

const SearchInput = ({ name, children, hideDivider, ...rest }) => {
  const box = useRef(null);
  return (
    <InputWrapper
      onFocus={() => {
        box.current.style.cssText = css`
          border: 1px solid var(--color-maingreen--50);
        `;
      }}
      onBlur={() => {
        box.current.style.cssText = css`
          border: 1px solid var(--color-lightgray);
        `;
      }}
      sort={name}
      {...rest}
    >
      <div className="bg" ref={box} />
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
