import React, { useRef } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";
import { HiPlusSm, HiMinusSm } from "react-icons/hi";
import { IoCloseCircle } from "react-icons/io5";

const Container = styled.div`
  margin-top: 0.5rem;
`;

const Input = styled.input`
  padding: 0 1rem;
  width: 100%;
  color: var(--color-black);
  ::placeholder {
    color: var(--color-gray);
    font-family: Interop-Light;
  }
  outline: none;
  font-size: 1rem;
`;

const Popper = styled.div`
  position: absolute;
  margin-top: 1.75rem;
  width: calc(100%);
  padding: 1rem;
  background-color: var(--color-white);
  font-size: 1.125rem;
  background-color: var(--color-white);
  border-radius: 1rem;
  overflow: auto;
  filter: drop-shadow(0px 6px 10px var(--color-shadow));
  display: none;
  ${media.lessThan("medium")`
    width: 100%;
    margin-top: 1.25rem;
    margin-bottom: -0.75rem;
    filter: none;
    border: 1px solid var(--color-maingreen--50);
  `};
`;

const PopperInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PopperInput = styled.input`
  max-width: calc(100% - 4rem);
  text-align: center;
  ${(props) =>
    props.disabled &&
    css`
      color: var(--color-gray);
    `};
`;

const PlusBtn = styled(HiPlusSm)`
  flex: 0 0 auto;
  color: var(--color-gray);
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
  border-radius: 50%;
  border: 1px solid var(--color-gray);
  :hover,
  :active {
    border: 1px solid var(--color-darkgray);
    color: var(--color-darkgray);
  }
`;

const MinusBtn = styled(HiMinusSm)`
  flex: 0 0 auto;
  color: var(--color-gray);
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
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
  top: 1.375rem;
  /* top: 50%;
  transform: translateY(-50%); */
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
    hidePopper();
  };
  const showPopper = () => {
    popper.current.style.cssText = css`
      display: block;
    `;
  };
  const hidePopper = () => {
    popper.current.style.cssText = css`
      display: none;
    `;
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
      onClick={(e) => e.preventDefault()}
    >
      <Input value={total ? `총 ${total}명` : ""} placeholder={placeholder} readOnly />
      <Popper ref={popper}>
        <PopperInner>
          {total && total > 2 ? <MinusBtn onClick={hadleMinusClick} /> : <DisabledMinus />}
          <PopperInput id={inputId} value={total || 1} disabled={!total} readOnly />
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
