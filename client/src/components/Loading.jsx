import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";

/*
  Loading 컴포넌트 활용 가이드
  * 뷰포트 전체에 꽉 차게 하고 싶은 경우, isFullscreen 프롭스를 전달하여 사용합니다.
    위 속성이 존재하지 않는 경우, 부모 컴포넌트의 100%를 차지합니다.
  * 배경색을 투명하게 하고 싶은 경우, isTransparent 프롭스를 전달하여 사용합니다.
    위 속성이 존재하지 않는 경우, 투명도 0.92의 var(--color-black) 색상을 기본 배경색으로 가집니다.
*/

const Background = styled.div`
  ${(props) => {
    if (props.isFullscreen) return "position: absolute;\ntop: 0;\nleft: 0;";
    else return "position: relative;";
  }}
  width: 100%;
  height: 100%;
  padding-top: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Fill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-modalbg);
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
  left: -2rem;
  bottom: 0;
  width: 4rem;
  height: 4rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("../animation_assets/sport_icons/soccer-ball.png");
  animation: ${bouncing} 0.6s alternate infinite cubic-bezier(0.75, 0.1, 0.04, 0.8),
    ${switching} 4.8s 1.2s normal infinite cubic-bezier(0.4, 0.1, 0.02, 0.8);
  ${media.lessThan("small")`
    left: -1.6rem;
    width: 3.2rem;
    height: 3.2rem;
  `};
`;

const Shadow = styled.div`
  position: absolute;
  left: -1.6rem;
  bottom: 0;
  width: 3.2rem;
  height: 0.64rem;
  border-radius: 100%;
  background-color: #36ccc8;
  opacity: 25%;
  animation: ${resizing} 0.6s alternate infinite cubic-bezier(0.75, 0.1, 0.04, 0.8);
  ${media.lessThan("small")`
    left: -1.2rem;
    width: 2.4rem;
    height: 0.48rem;
  `};
`;

const Loading = ({ isTransparent, isFullscreen }) => {
  return (
    <Background isFullscreen={isFullscreen}>
      {!isTransparent && <Fill />}
      <LoadingContainer>
        <IconContainer>
          <Shadow />
          <Icon />
        </IconContainer>
      </LoadingContainer>
    </Background>
  );
};

Loading.defaultProps = {
  isTransparent: false,
  isFullscreen: false,
};

Loading.propTypes = {
  isTransparent: PropTypes.bool,
  isFullscreen: PropTypes.bool,
};

export default Loading;
