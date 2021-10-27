import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";

/*
  AnimaLogo 컴포넌트 활용 가이드
  * 뷰포트 전체에 꽉 차게 하고 싶은 경우, isFullscreen 프롭스를 전달하여 사용합니다.
    위 속성이 존재하지 않는 경우, 부모 컴포넌트의 100%를 차지합니다.
*/

const LogoContainer = styled.div`
  ${(props) => {
    if (props.isFullscreen) return "position: absolute;\ntop: 0;\nleft: 0;";
    else return "position: relative;";
  }}
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerDiv = styled.div`
  background-size: cover;
  height: calc(4rem * 0.75);
`;

const Lets = styled(InnerDiv)`
  background-image: url("../animation_assets/Lets.png");
  width: calc(3rem * 2.025);
  margin-right: 3rem;
  ${media.lessThan("small")`
    margin-right: 2.4rem;
  `}
`;

const AnimaContainer = styled(InnerDiv)`
  width: calc(3rem * (5.7 + 1 + 0.542));
  ${media.lessThan("small")`
    width: calc(2.4rem * (5.7 + 1 + 0.542));
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
  width: 3rem;
  height: 3rem;
  position: absolute;
  bottom: 0;
  left: calc(-0.5 * 3rem);
  background-size: cover;
  ${media.lessThan("small")`
    width: 2.4rem;
    height: 2.4rem;
    left: calc(-0.5 * 2.4rem);
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
100% {
  width: calc(3rem * 5.7);
}
`;

const Logo = styled(Icon)`
  width: 0rem;
  ${media.lessThan("small")`
    width: calc(2.4rem * 5.7);
  `}
  background-image: url("../animation_assets/Sweatmate.png");
  animation: ${LogoResize} 0.9s 6.9s normal 1 cubic-bezier(0.75, 0.1, 0.04, 0.8) forwards;
`;

const MarkPosition = keyframes`
100% {
  left: calc(3rem * (5.7 - 0.25));
  ${media.lessThan("small")`
    left: calc(2.4rem * (5.7 - 0.25));
  `}
}
`;

const ExcMark = styled(Icon)`
  width: 1.625rem;
  left: calc(3rem * (1 - 0.25));
  ${media.lessThan("small")`
    width: 1.3rem;
    left: calc(2.4rem * (1 - 0.25));
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
  ${media.lessThan("small")`
    width: 2rem;
    height: 0.4rem;
    left: calc(-0.5 * 2rem);
  `};
  animation: ${ShadowBounce} 0.6s alternate 8 cubic-bezier(0.75, 0.1, 0.04, 0.8);
`;

const AnimaLogo = ({ isFullscreen }) => {
  return (
    <LogoContainer isFullscreen={isFullscreen}>
      <Lets />
      <AnimaContainer>
        <Shadow />
        <Icon />
        <Logo />
        <ExcMark />
      </AnimaContainer>
    </LogoContainer>
  );
};

AnimaLogo.defaultProps = {
  isFullscreen: false,
};

AnimaLogo.propTypes = {
  isFullscreen: PropTypes.bool,
};

export default AnimaLogo;
