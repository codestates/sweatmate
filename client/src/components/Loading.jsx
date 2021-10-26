import React from "react";
import styled, { keyframes } from "styled-components";
import media from "styled-media-query";

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Fill = styled(Background)`
  background-color: var(--color-black);
  opacity: 0.92;
`;

const LoadingContainer = styled.div`
  z-index: 1;
`;

const IconContainer = styled.div`
  position: relative;
`;

const bouncing = keyframes`
  0% {
    transform: translate3d(0, 16%, 0) scale(1, 0.75);
  }
  100% {
    transform: translate3d(0, -135%, 0) scale(0.95, 1.05);
  }
`;

const resizing = keyframes`
  0% {
    transform: translate3d(0, 0.4rem, 0) scale(1, 1);
  }
  100% {
    transform: translate3d(0, 0.2rem, 0) scale(0.5, 0.8);
  }
`;

const switching = keyframes`
  3.5% {
    background-image: url("../animation_assets/sport_icons/soccer-ball.png");
  }
  9% {
    background-image: url("../animation_assets/sport_icons/basketball.png");
  }
  28.5% {
    background-image: url("../animation_assets/sport_icons/basketball.png");
  }
  34% {
    background-image: url("../animation_assets/sport_icons/baseball.png");
  }
  53.5% {
    background-image: url("../animation_assets/sport_icons/baseball.png");
  }
  59% {
    background-image: url("../animation_assets/sport_icons/tennis.png");
  }
  78.5% {
    background-image: url("../animation_assets/sport_icons/tennis.png");
  }
  84% {
    background-image: url("../animation_assets/sport_icons/soccer-ball.png");
  }
`;

const Icon = styled.div`
  position: absolute;
  left: -3rem;
  bottom: 0;
  width: 6rem;
  height: 6rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("../animation_assets/sport_icons/soccer-ball.png");
  animation: ${bouncing} 0.6s alternate infinite cubic-bezier(0.75, 0.1, 0.04, 0.8),
    ${switching} 4.8s 1.2s normal infinite cubic-bezier(0.4, 0.1, 0.02, 0.8);
  ${media.lessThan("small")`
    left: -2.4rem;
    width: 4.8rem;
    height: 4.8rem;
  `};
`;

const Shadow = styled.div`
  position: absolute;
  left: -2rem;
  bottom: 0;
  width: 4rem;
  height: 0.8rem;
  border-radius: 100%;
  background-color: #36ccc8;
  opacity: 25%;
  animation: ${resizing} 0.6s alternate infinite cubic-bezier(0.75, 0.1, 0.04, 0.8);
  ${media.lessThan("small")`
    left: -1.6rem;
    width: 3.2rem;
    height: 0.64rem;
  `};
`;

const Loading = () => {
  return (
    <Background>
      <Fill />
      <LoadingContainer>
        <IconContainer>
          <Shadow />
          <Icon />
        </IconContainer>
      </LoadingContainer>
    </Background>
  );
};

export default Loading;
