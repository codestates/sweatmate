import React, { useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";
import Portal from "../Portal";

/*
  Loading 컴포넌트 활용 가이드
  * 뷰포트 전체에 꽉 차게 하고 싶은 경우, isFullscreen 프롭스를 전달하여 사용합니다.
    위 속성이 존재하지 않는 경우, 부모 컴포넌트의 100%를 차지합니다.
  * 배경색을 투명하게 하고 싶은 경우, isTransparent 프롭스를 전달하여 사용합니다.
    위 속성이 존재하지 않는 경우, 투명도 0.92의 var(--color-black) 색상을 기본 배경색으로 가집니다.
*/

const LoadingWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  ${(props) =>
    props.isFullscreen &&
    css`
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: auto;
    `}
  padding-top: 7.5%;
  outline: 0;
  z-index: 1000;
`;

const LoadingOverlay = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  ${(props) =>
    props.isFullscreen &&
    css`
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    `}
  background-color: var(--color-modalbg);
  display: ${(props) => (props.isTransparent ? "none" : "block")};
  z-index: 999;
`;

const LoadingContainer = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
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
    transform: translate3d(0, 50%, 0) scale(1, 1);
  }
  100% {
    transform: translate3d(0, 50%, 0) scale(0.5, 0.8);
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
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.cssText = `
        position: fixed;
        top: -${window.scrollY}px;
        left: 0;
        right: 0;
      `;
      return () => {
        const scrollY = document.body.style.top;
        document.body.style.cssText = `
          position: static;
          top: unset;
          left: unset;
          right: unset;
        `;
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      };
    }
  }, []);
  return (
    <>
      {isFullscreen ? (
        <Portal elementId="root-dimmed">
          <LoadingOverlay isTransparent={isTransparent} isFullscreen={isFullscreen} />
          <LoadingWrapper isFullscreen={isFullscreen}>
            <LoadingContainer>
              <IconContainer>
                <Shadow />
                <Icon />
              </IconContainer>
            </LoadingContainer>
          </LoadingWrapper>
        </Portal>
      ) : (
        <>
          <LoadingOverlay isTransparent={isTransparent} isFullscreen={isFullscreen} />
          <LoadingWrapper isFullscreen={isFullscreen}>
            <LoadingContainer>
              <IconContainer>
                <Shadow />
                <Icon />
              </IconContainer>
            </LoadingContainer>
          </LoadingWrapper>
        </>
      )}
    </>
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
