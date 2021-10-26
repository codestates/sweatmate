import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { modalOffAction } from "../store/actions";
import { useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import media from "styled-media-query";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0rem;
  width: 100vw;
  height: 100vh;
  background-color: rgba(17, 26, 61, 0.5);
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 60rem;
  height: 40rem;
  border: 1px solid black;
  background-color: white;
  ${media.between("medium", "large")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 40rem;
  `}
  ${media.lessThan("medium")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 25rem;
  `}
`;

const CloseBtn = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
  width: 60rem;
  height: 0rem;
  font-size: 1.2rem;
  color: var(--color-black);
  padding-right: 2rem;
  padding-top: 2rem;
  ${media.between("medium", "large")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 40rem;
  `}
  ${media.lessThan("medium")`
    /* screen width is between 768px (medium) and 1170px (large) */
    width: 25rem;
  `}
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
    <Container onClick={handleBackgroundClick}>
      <ModalBox>
        <CloseBtn onClick={handleCloseClick}>
          <IoClose fontSize="2rem" />
        </CloseBtn>
        {children}
      </ModalBox>
    </Container>
  );
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]).isRequired,
};
