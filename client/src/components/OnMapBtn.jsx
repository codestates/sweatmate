import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ButtonContainer = styled(Link)`
  width: fit-content;
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
  color: var(--color-white);
  background-color: var(--color-maingreen--75);
  font-family: Interop-SemiBold;
  border-radius: 0.6rem;
  :hover {
    opacity: 0.8;
  }
  margin-top: 1rem;
`;

const Icon = styled.div`
  font-size: 1.2rem;
  margin-right: 0.6rem;
`;

const Text = styled.div`
  font-size: 1rem;
`;
const OnMapBtn = () => {
  return (
    <ButtonContainer to="/map">
      <Icon>🗺</Icon>
      <Text>지도로 보기</Text>
    </ButtonContainer>
  );
};

export default OnMapBtn;
