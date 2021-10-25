import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";

const ButtonContainer = styled.button`
  font-family: Interop-SemiBold;
  background-color: var(--color-lightgray);
  :hover {
    opacity: 0.8;
  }
  ${media.greaterThan("medium")`
    font-size: 1.2rem;
    width: 15rem;
    padding: 0.8rem 1.2rem;
    border-radius: 0.8rem;
  `};
  ${media.between("small", "medium")`
    font-size: 1rem;
    width: 12rem;
    padding: 0.6rem 0.8rem;
    border-radius: 0.6rem;
  `};
  ${media.lessThan("small")`
    font-size: 0.8rem;  
    width: 10rem;
    padding: 0.6rem 0.8rem;
    border-radius: 0.6rem;
  `};
`;
const Btn = ({ value }) => {
  return <ButtonContainer>{value}</ButtonContainer>;
};

Btn.propTypes = {
  value: PropTypes.string.isRequired,
};

export default Btn;
