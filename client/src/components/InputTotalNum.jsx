import React, { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { HiPlusSm, HiMinusSm } from "react-icons/hi";
import { IoCloseCircle } from "react-icons/io5";

const Container = styled.div`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0 1rem 0.75rem;
  color: var(--color-black);
  ::placeholder {
    color: var(--color-gray);
    font-family: Interop-Light;
  }
  outline: none;
  font-size: 1rem;
  margin-top: 0.25rem;
`;

const Popper = styled.div`
  position: absolute;
  left: 0;
  min-width: calc(100% + 4rem);
  margin-top: 0.75rem;
  padding: 1rem;
  background-color: var(--color-white);
  font-size: 1.125rem;
  background-color: var(--color-white);
  border-radius: 1rem;
  overflow: auto;
  filter: drop-shadow(0px 6px 10px var(--color-shadow));
  visibility: hidden;
`;

const PopperInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PopperInput = styled.input`
  width: calc(100% - 7rem);
  text-align: center;
`;

const PlusBtn = styled(HiPlusSm)`
  color: var(--color-gray);
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  padding: 0.25rem;
  margin-left: 1.5rem;
  border-radius: 50%;
  border: 1px solid var(--color-gray);
  :hover,
  :active {
    border: 1px solid var(--color-darkgray);
    color: var(--color-darkgray);
  }
`;

const MinusBtn = styled(HiMinusSm)`
  color: var(--color-gray);
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  padding: 0.25rem;
  margin-right: 1.5rem;
  border-radius: 50%;
  border: 1px solid var(--color-gray);
  :hover,
  :active {
    border: 1px solid var(--color-darkgray);
    color: var(--color-darkgray);
  }
`;

const DisabledMinus = styled(MinusBtn)`
  color: var(--color-lightgray);
  border: 1px solid var(--color-lightgray);
  :hover,
  :active {
    color: var(--color-lightgray);
    border: 1px solid var(--color-lightgray);
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

function InputTotalNum({ inputId, placeholder, total, setTotal }) {
  const popper = useRef(null);
  const hadleMinusClick = () => {
    setTotal(total - 1);
  };
  const hadlePlusClick = () => {
    if (!total) setTotal(2);
    else setTotal(total + 1);
  };
  const handleClearClick = () => {
    setTotal(null);
  };
  const showPopper = () => {
    popper.current.style.cssText = `visibility: visible`;
  };
  const hidePopper = () => {
    popper.current.style.cssText = `visibility: hidden`;
  };
  return (
    <Container
      tabIndex={-1}
      onFocus={() => {
        showPopper();
      }}
      onBlur={() => {
        hidePopper();
      }}
    >
      <Input value={total ? `총 ${total}명` : ""} placeholder={placeholder} readOnly />
      <Popper ref={popper}>
        <PopperInner>
          {total && total > 2 ? <MinusBtn onClick={hadleMinusClick} /> : <DisabledMinus />}
          <PopperInput id={inputId} type="number" value={total || 2} readOnly />
          <PlusBtn onClick={hadlePlusClick} />
        </PopperInner>
      </Popper>
      {total && (
        <ClearBtn onClick={handleClearClick}>
          <IoCloseCircle />
        </ClearBtn>
      )}
    </Container>
  );
}

InputTotalNum.propTypes = {
  inputId: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  total: PropTypes.number,
  setTotal: PropTypes.func.isRequired,
};
export default InputTotalNum;
