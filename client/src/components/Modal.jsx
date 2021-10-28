import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { modalOffAction } from "../store/actions";
import { useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import media from "styled-media-query";

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-modalbg);
  z-index: 20;
`;

const ModalContainer = styled.div`
  color: var(--color-darkgray);
  background-color: var(--color-white);
  border-radius: 1rem;
  width: 60rem;
  height: 36rem;
  max-height: 100vh - 16rem;
  padding: 1.5rem;
  ${media.lessThan("medium")`
    padding: 1rem;
  `};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  ${media.between("medium", "large")`
    width: 40rem;
  `}
  ${media.between("small", "medium")`
    width: 25rem;
  `}
  ${media.lessThan("small")`
    border-radius: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  `}
`;

const CloseBtn = styled.div`
  border-radius: 0.5rem;
  padding: 0.25rem;
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  width: 2.25rem;
  height: 2.25rem;
  font-size: 1.75rem;
  ${media.lessThan("medium")`
    right: 1rem;
    top: 1rem;
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
  `};
  color: var(--color-gray);
  :hover {
    color: var(--color-darkgray);
    background-color: var(--color-darkwhite);
  }
`;

const Modal = ({ children }) => {
  const dispatch = useDispatch();
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) dispatch(modalOffAction);
  };
  const handleCloseClick = () => {
    dispatch(modalOffAction);
  };
  return (
    <Background onClick={handleBackgroundClick}>
      <ModalContainer>
        <CloseBtn onClick={handleCloseClick}>
          <IoClose />
        </CloseBtn>
        {children}
      </ModalContainer>
    </Background>
  );
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]).isRequired,
};
