import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
// import { IoCloseCircle } from "react-icons/io5";

const InputWrapper = styled.label`
  height: 100%;
  min-width: ${(props) => (props.isLong ? "10rem" : "6rem")};
  max-width: ${(props) => (props.isLong ? "15rem" : "12rem")};
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

// const ClearBtn = styled.button`
//   position: absolute;
//   right: 1rem;
//   top: 50%;
//   transform: translateY(-50%);
//   width: 1.25rem;
//   height: 1.25rem;
//   font-size: 1.25rem;
//   color: var(--color-lightgray);
//   :hover {
//     color: var(--color-gray);
//   }
// `;

const Divider = styled.div`
  min-width: 1px;
  background-color: var(--color-lightgray);
  width: 1px;
  border-radius: 1px;
  margin: 0.75rem 0;
`;

const SearchInput = ({ isLong, name, children }) => {
  const label = useRef(null);
  // const handleClearClick = () => {};
  return (
    <InputWrapper isLong={isLong} ref={label}>
      <InputArea>
        <Name>{name}</Name>
        {children}
      </InputArea>
      {/* <ClearBtn onClick={handleClearClick}>
        <IoCloseCircle />
      </ClearBtn> */}
      <Divider className="divider" />
    </InputWrapper>
  );
};

SearchInput.defaultProps = {
  isLong: false,
};

SearchInput.propTypes = {
  isLong: PropTypes.bool,
  name: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]).isRequired,
};

export default SearchInput;
