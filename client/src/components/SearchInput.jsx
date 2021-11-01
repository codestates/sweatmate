import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const InputWrapper = styled.label`
  height: 100%;
  min-width: ${(props) => {
    if (props.isSport) return "9rem";
    if (props.isDate) return "11.5rem";
    if (props.isTime) return "5rem";
    return "6.5rem";
  }};
  max-width: ${(props) => {
    if (props.isSport) return "12rem";
    if (props.isDate) return "15rem";
    if (props.isTime) return "8rem";
    return "10rem";
  }};
  /* ${(props) => (props.isLong ? "15rem" : "10rem")}; */
  border-radius: 1rem;
  display: flex;
  :hover {
    background-color: var(--color-darkwhite);
  }
  :last-of-type {
    .divider {
      display: none;
    }
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

const SearchInput = ({ isSport, isDate, isTime, name, children }) => {
  const label = useRef(null);
  return (
    <InputWrapper isSport={isSport} isDate={isDate} isTime={isTime} ref={label}>
      <InputArea>
        <Name>{name}</Name>
        {children}
      </InputArea>
      <Divider className="divider" />
    </InputWrapper>
  );
};

SearchInput.defaultProps = {
  isSport: false,
  isDate: false,
  isTime: false,
};

SearchInput.propTypes = {
  isSport: PropTypes.bool,
  isDate: PropTypes.bool,
  isTime: PropTypes.bool,
  name: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]).isRequired,
};

export default SearchInput;
