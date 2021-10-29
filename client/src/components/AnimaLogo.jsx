import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";

/*
  AnimaLogo 컴포넌트 활용 가이드
  * 뷰포트 전체에 꽉 차게 하고 싶은 경우, isFullscreen 프롭스를 전달하여 사용합니다.
    위 속성이 존재하지 않는 경우, 부모 컴포넌트의 100%를 차지합니다.
*/

const LogoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  ${(props) =>
    props.isFullscreen &&
    `position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;`}
  padding-top: 7.5%;
  /* overflow: auto; */
  outline: 0;
`;

const LogoContainer = styled.div`
  position: relative;
  width: fit-content;
  height: 3rem;
  left: 50%;
  top: 50%;
  margin: 4.5rem 0 0.75rem 0;
  transform: translate(-50%, -50%);
  ${media.between("small", "medium")`
    height: 2.625rem;
    margin: 3.938rem 0 0.656rem 0;
  `}
  ${media.lessThan("small")`
    height: 2rem;
    margin: 3rem 0 0.5rem 0;
  `}
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > * {
    height: 100%;
  }
`;

const InnerDiv = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
`;

const Lets = styled(InnerDiv)`
  background-image: url("../animation_assets/Lets.png");
  width: calc(3rem * 2.025);
  margin-right: 3rem;
  ${media.between("small", "medium")`
    width: calc(2.625rem * 2.025);
    margin-right: 2.625rem;
  `}
  ${media.lessThan("small")`
    width: calc(2rem * 2.025);
    margin-right: 2rem;
  `}
`;

const AnimaContainer = styled(InnerDiv)`
  width: calc(3rem * (5.7 + 0.542 - 0.25));
  ${media.between("small", "medium")`
    width: calc(2.625rem * (5.7 + 0.542 - 0.25));
  `}
  ${media.lessThan("small")`
    width: calc(2rem * (5.7 + 0.542 - 0.25));
  `}
  display: flex;
  align-items: baseline;
  position: relative;
`;

const Bounce = keyframes`
  0% {
    transform: translate3d(0, 16%, 0) scale(1, 0.75);
  }
  100% {
    transform: translate3d(0, -120%, 0) scale(0.95, 1.05);
  }
`;

const LastBounce = keyframes`
0% {
  transform: translate3d(0, 16%, 0) scale(1, 0.75);
}
20% {
  transform: translate3d(0, -40%, 0) scale(1, 1.04);
}
45% {
  transform: translate3d(0, 4%, 0) scale(1, 0.96);
}
70% {
  transform: translate3d(0, -4%, 0) scale(1, 1.01);
}
100% {
  transform: translate3d(0, 0, 0) scale(1, 1);
}
`;

const ChangeImage = keyframes`
  0% {
    background-image: url("../animation_assets/sport_icons/soccer-ball.png");
  }
  3% {
    background-image: url("../animation_assets/sport_icons/soccer-ball.png");
  }
  23% {
    background-image: url("../animation_assets/sport_icons/soccer-ball.png");
  }
  37% {
    background-image: url("../animation_assets/sport_icons/basketball.png");
  }
  43% {
    background-image: url("../animation_assets/sport_icons/basketball.png");
  }
  57% {
    background-image: url("../animation_assets/sport_icons/baseball.png");
  }
  63% {
    background-image: url("../animation_assets/sport_icons/baseball.png");
  }
  77% {
    background-image: url("../animation_assets/sport_icons/tennis.png");
  }
  83% {
    background-image: url("../animation_assets/sport_icons/tennis.png");
  }
  97%{
    background-image: url("../animation_assets/Icon.png");
  }
  100%{
    background-image: url("../animation_assets/Icon.png");
  }
`;

const IconDisappear = keyframes`
0% {
  opacity: 1;
}
100% {
  opacity: 0;
}
`;

const Icon = styled.div`
  position: absolute;
  left: -1.5rem;
  bottom: 0;
  background-size: cover;
  width: 3rem;
  height: 100%;
  ${media.between("small", "medium")`
    left: -1.3125rem;
    width: 2.625rem;
  `}
  ${media.lessThan("small")`
    left: -1rem;
    width: 2rem;
  `}
  animation: ${Bounce} 0.6s alternate 10 cubic-bezier(0.75, 0.1, 0.04, 0.8) forwards,
    ${LastBounce} 1.2s 6s alternate 1 cubic-bezier(0.4, 0.1, 0.02, 0.8) forwards,
    ${ChangeImage} 6s normal 1 cubic-bezier(0.4, 0.1, 0.02, 0.8) forwards,
    ${IconDisappear} 0.3s 7.2s normal 1 ease-out forwards;
`;

const LogoResize = keyframes`
0% {
  width: 0rem;
}
`;

const Logo = styled(Icon)`
  width: calc(3rem * 5.7);
  ${media.between("small", "medium")`
    width: calc(2.625rem * 5.7);
  `}
  ${media.lessThan("small")`
    width: calc(2rem * 5.7);
  `}
  background-image: url("../animation_assets/Sweatmate.png");
  animation: ${LogoResize} 0.9s 6.9s normal 1 cubic-bezier(0.75, 0.1, 0.04, 0.8) backwards;
`;

const MarkPosition = keyframes`
100% {
  transform: translateX(867.692%);
}
`;

const ExcMark = styled(Icon)`
  width: 1.625rem;
  left: calc(3rem * (1 - 0.25));
  ${media.between("small", "medium")`
    width: 1.422rem;
    left: calc(2.625rem * (1 - 0.25));
  `}
  ${media.lessThan("small")`
    width: 1.083rem;
    left: calc(2rem * (1 - 0.25));
  `}
  background-image: url("../animation_assets/ExcMark.png");
  animation: ${MarkPosition} 0.9s 6.9s normal 1 cubic-bezier(0.75, 0.1, 0.04, 0.8) forwards;
`;

const ShadowBounce = keyframes`
  0% {
    background-color: #36ccc8;
    opacity: 25%;
    transform: translate3d(0, 50%, 0) scale(1, 1);
  }
  100% {
    background-color: #36ccc8;
    opacity: 25%;
    transform: translate3d(0, 50%, 0) scale(0.5, 0.8);
  }
`;

const Shadow = styled.div`
  position: absolute;
  left: calc(-0.5 * 2.4rem);
  bottom: 0;
  width: 2.4rem;
  height: 0.48rem;
  border-radius: 100%;
  ${media.between("small", "medium")`
    width: 2.1rem;
    height: 0.42rem;
    left: calc(-0.5 * 2.1rem);
  `}
  ${media.lessThan("small")`
    width: 1.6rem;
    height: 0.32rem;
    left: calc(-0.5 * 1.6rem);
  `}
  animation: ${ShadowBounce} 0.6s alternate 8 cubic-bezier(0.75, 0.1, 0.04, 0.8);
`;

const AnimaLogo = ({ isFullscreen }) => {
  return (
    <LogoWrapper isFullscreen={isFullscreen}>
      <LogoContainer>
        <Lets />
        <AnimaContainer>
          <Shadow />
          <Icon />
          <Logo />
          <ExcMark />
        </AnimaContainer>
      </LogoContainer>
    </LogoWrapper>
  );
};

AnimaLogo.defaultProps = {
  isFullscreen: false,
};

AnimaLogo.propTypes = {
  isFullscreen: PropTypes.bool,
};

export default AnimaLogo;
