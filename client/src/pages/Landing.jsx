import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import media from "styled-media-query";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import authApi from "../api/auth";
import { signinAction, signoutAction, signupModalOnAction } from "../store/actions";
import Btn from "../components/Btn";
import AnimaLogo from "../components/AnimaLogo";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LandingContainer = styled.div`
  background-image: url(${(props) => props.url});
  background-size: 150%;
  background-position: top center;
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100vw;
  height: fit-content;
  background-color: var(--color-white);
  ${media.between("medium", "large")`
    background-size: 200%;
  `}
  ${media.between("small", "medium")`
    background-size: 300%;
  `}
  ${media.lessThan("small")`
    background-size: 400%;
  `}
`;

const CoverContainer = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  #btn-container {
    margin: 0 auto;
    padding: 2.5rem 1rem;
    display: flex;
    ${media.lessThan("small")`
      width: 100%;
      flex-direction: column;
    `}
  }
  .btn {
    border: 1px solid var(--color-maingreen--75);
    min-width: 15rem;
    ${media.lessThan("small")`
      width: 100%;
      min-width: 20rem;
      height: 3.2rem;
    `}
    &.start,
    &.to-home {
      background-color: var(--color-maingreen--75);
      color: var(--color-white);
    }
    &.start {
      ${media.greaterThan("small")`
        margin-right: 1rem;
      `}
      ${media.lessThan("small")`
        margin-bottom: 1rem;
      `}
    }
    &.experience {
      background-color: transparent;
      color: var(--color-maingreen--100);
      :hover {
        opacity: 1;
        background-color: var(--color-maingreen--10);
      }
    }
    :disabled {
      opacity: unset;
      cursor: unset;
    }
  }
  #cover-anima-container {
    position: absolute;
    height: 20vh;
  }
  #cover-content-container {
    padding-top: 20vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const CoverTitle = styled.h1`
  margin: 0.5rem 0;
  text-align: center;
  font-weight: normal;
  font-family: Interop-SemiBold;
  font-size: 2rem;
  ${media.lessThan("small")`
    font-size: 1.75rem;
  `}
`;

const CoverSubTitle = styled.h2`
  margin: 0.5rem 0;
  text-align: center;
  font-weight: normal;
  font-family: Interop-Regular;
  font-size: 1.75rem;
  ${media.lessThan("small")`
    font-size: 1.25rem;
  `}
`;

const KeyValueContainer = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  padding: 4rem 0;
  .fill {
    position: absolute;
    inset: 0;
    ${(props) =>
      props.colored
        ? css`
            background-color: var(--color-maingreen--10);
            opacity: 0.75;
          `
        : css`
            background-color: var(--color-white);
            opacity: 0.75;
          `}
  }
  .large {
    flex: 3 0 2rem;
    ${media.lessThan("small")`
      flex: 3 0 2rem;
    `}
  }
  .small {
    flex: 1 0 2rem;
    ${media.lessThan("small")`
      flex: 1 0 2rem;
    `}
  }
  ${(props) =>
    props.align === "left" &&
    css`
      flex-direction: row-reverse;
      .content {
        flex-direction: row-reverse;
      }
    `}
`;

const ContentBox = styled.div`
  height: fit-content;
  display: flex;
  ${media.lessThan("large")`
    flex-direction: column !important;
  `}
  ${media.between("small", "medium")`
    width: calc(100% - 4rem);
  `}
  ${media.lessThan("small")`
    width: calc(100% - 4rem);
  `}
`;

const DescrWrapper = styled.div`
  flex: 0 0 auto;
  width: fit-content;
  display: flex;
  flex-direction: column;
  z-index: 1;
  ${media.between("small", "large")`
    margin-bottom: 4rem;
  `}
  ${media.lessThan("small")`
    margin-bottom: 2rem;
  `}
`;

const DescTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-weight: normal;
  font-family: Interop-Medium;
  font-size: 1.5rem;
  ${media.between("small", "large")`
    font-size: 1.375rem;
  `}
  ${media.lessThan("small")`
    font-size: 1.25rem;
  `}
  line-height: var(--lineHeight-loose);
`;

const DescBody = styled.p`
  width: max-content;
  margin: 0;
  font-weight: normal;
  font-family: Interop-Light;
  font-size: 1.375rem;
  ${media.between("small", "large")`
    font-size: 1.25rem;
  `}
  ${media.lessThan("small")`
    font-size: 1.125rem;
  `}
  line-height: var(--lineHeight-loose);
`;

const DescSubTitle = styled.h3`
  width: max-content;
  margin: 1.5rem 0 0;
  font-weight: normal;
  font-family: Interop-Medium;
  font-size: 1.25rem;
  ${media.between("small", "large")`
    font-size: 1.125rem;
  `}
  ${media.lessThan("small")`
    font-size: 1rem;
  `}
  line-height: var(--lineHeight-loose);
  color: var(--color-darkgray);
`;

const ImageWrapper = styled.div`
  flex: 0 0 auto;
  z-index: 1;
  position: relative;
  display: flex;
  &#first-container,
  &#third-container {
    margin-left: 4rem;
    ${media.lessThan("large")`
      margin-left: 0;
    `}
  }
  &#second-container,
  &#fourth-container {
    margin-right: 4rem;
    ${media.lessThan("large")`
      margin-right: 0;
    `}
  }
  &#first-container {
    align-items: flex-start;
  }
  &#second-container {
    width: 30rem;
    max-width: 100%;
  }
  &#third-container {
    width: 38rem;
    max-width: 100%;
    flex-direction: column-reverse;
  }
  &#fourth-container {
    width: 34rem;
    max-width: 100%;
  }
  .first {
    display: flex;
    flex-direction: column;
    #sport-input,
    #sport-datalist {
      width: 10rem;
      ${media.lessThan("small")`
        width: 100%;
      `}
    }
    #sport-input {
      margin-bottom: 0.5rem;
    }
    &.still {
      margin-top: 2rem;
      align-self: flex-start;
      ${media.lessThan("small")`
        width: calc((100% + 2rem) * 0.34);
      `}
    }
    &.animation {
      align-self: center;
      margin-left: 4rem;
      ${media.lessThan("small")`
        margin-left: 2rem;
        width: calc((100% + 2rem) * 0.66);
        margin-right: -4rem;
      `}
    }
    .card {
      width: 20rem;
      ${media.lessThan("small")`
        width: 100%;
      `}
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
      margin-bottom: 1rem;
      &.three {
        margin-bottom: 0;
      }
    }
  }
  .second {
    &.still {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    &.animation {
      position: absolute;
      inset: 0;
    }
    .pin {
      width: 10%;
      position: absolute;
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
      &.one {
        top: 7.5%;
        left: 70%;
      }
      &.two {
        top: 30%;
        left: 16.7%;
      }
      &.three {
        top: 70%;
        left: 50%;
      }
    }
  }
  .third {
    width: 100%;
    max-width: 20rem;
    &.still {
      align-self: flex-start;
      display: flex;
      flex-direction: column;
    }
    &.animation {
      align-self: flex-end;
      ${media.lessThan("small")`
        margin-right: -4rem;
      `}
    }
    #upcoming {
      width: 50%;
      margin-bottom: 1rem;
    }
    #upcoming-card {
      width: 100%;
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
    }
    #alarm {
      width: 100%;
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
      margin-bottom: -2rem;
      ${media.lessThan("medium")`
        margin-bottom: 1rem;
      `}
    }
  }
  .fourth {
    &.animation {
      display: flex;
      flex-direction: column;
      height: fit-content;
      width: 100%;
    }
    .chat {
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
      margin-bottom: 1.5rem;
      align-self: flex-start;
      &.one {
        width: calc(80% - 2.5rem);
        max-width: 272px;
      }
      &.two {
        width: calc(99.4% - 2.5rem);
        max-width: 338px;
        align-self: flex-end;
      }
      &.three {
        width: calc(100% - 2.5rem);
        max-width: 340px;
        margin-bottom: 0;
      }
    }
  }
`;

const Landing = () => {
  const { isLogin } = useSelector(({ authReducer }) => authReducer);
  const [btnClickable, setBtnClickable] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleStartClick = () => {
    dispatch(signupModalOnAction);
  };

  const handleExperienceClick = async () => {
    try {
      const res = await authApi.guestSignin();
      if (res.status === 200) {
        dispatch(signinAction(res.data));
        history.push("/home");
      }
    } catch (err) {
      // console.error(err);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const getKakaoSignin = async (authorizationCode) => {
      const res = await authApi.kakao(authorizationCode);
      if (res.status === 200 || res.status === 201) {
        dispatch(signinAction(res.data));
        history.push("/home");
      }
    };

    const getGoogleSignin = async (authorizationCode) => {
      const res = await authApi.google(authorizationCode);
      if (res.status === 200 || res.status === 201) {
        dispatch(signinAction(res.data));
        history.push("/home");
      }
    };

    if (code) {
      if (state === "kakao") {
        getKakaoSignin(code);
      } else {
        getGoogleSignin(code);
      }
    } else {
      const checkValidUser = async () => {
        try {
          const res = await authApi.me();
          if (res.status === 200) {
            dispatch(signinAction(res.data));
          }
        } catch (error) {
          if (error.response.status === 403) {
            dispatch(signoutAction);
            history.push("/");
          }
        }
      };
      checkValidUser();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setBtnClickable(true);
    }, 10500);
  }, []);

  useEffect(() => {
    gsap.to("#cover-anima-container", {
      y: -125,
      duration: 1.5,
      delay: 9,
    });
    gsap.from("#cover-content-container", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 9.5,
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // first: cards
    gsap.from(".card.one", {
      scrollTrigger: {
        trigger: "#first-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      x: 75,
      duration: 1.25,
      ease: "power4",
      delay: 0.25,
    });
    gsap.from(".card.two", {
      scrollTrigger: {
        trigger: "#first-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      x: 75,
      duration: 1.25,
      ease: "power4",
      delay: 0.5,
    });
    gsap.from(".card.three", {
      scrollTrigger: {
        trigger: "#first-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      x: 75,
      duration: 1.25,
      ease: "power4",
      delay: 0.75,
    });
    // second: pins
    gsap.from(".pin.one", {
      scrollTrigger: {
        trigger: "#second-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      y: -100,
      duration: 0.75,
      ease: "back",
      delay: 0.25,
    });
    gsap.from(".pin.two", {
      scrollTrigger: {
        trigger: "#second-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      y: -100,
      duration: 0.75,
      ease: "back",
      delay: 0.75,
    });
    gsap.from(".pin.three", {
      scrollTrigger: {
        trigger: "#second-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      y: -100,
      duration: 0.75,
      ease: "back",
      delay: 1.25,
    });
    // third: alarm
    gsap.from("#alarm", {
      scrollTrigger: {
        trigger: "#third-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      x: 75,
      duration: 1.25,
      ease: "power4",
      delay: 0.25,
    });
    // fourth: chats
    gsap.from(".chat.one", {
      scrollTrigger: {
        trigger: "#fourth-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      x: -5,
      y: -30,
      duration: 1.25,
      ease: "circ",
      delay: 0.25,
    });
    gsap.from(".chat.two", {
      scrollTrigger: {
        trigger: "#fourth-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      x: 5,
      y: -30,
      duration: 1.25,
      ease: "circ",
      delay: 0.75,
    });
    gsap.from(".chat.three", {
      scrollTrigger: {
        trigger: "#fourth-container",
        start: "top 75%",
        end: "bottom 100%",
        toggleActions: "restart none reverse none",
      },
      opacity: 0,
      x: -5,
      y: -30,
      duration: 1.25,
      ease: "circ",
      delay: 1.5,
    });
  }, []);

  return (
    <LandingContainer url="../images/cover-bg-long.png">
      <CoverContainer>
        <div id="cover-anima-container">
          <AnimaLogo id="cover-anima" />
        </div>
        <div id="cover-content-container">
          <CoverSubTitle className="cover-content">운동 메이트를 만나는 간편한 방법,</CoverSubTitle>
          <CoverTitle className="cover-content">스웻메이트</CoverTitle>
          <div id="btn-container" className="cover-content">
            {isLogin ? (
              <Btn
                className="to-home btn"
                onClick={() => history.push("/home")}
                disabled={!btnClickable}
              >
                스웻메이트 홈으로
              </Btn>
            ) : (
              <>
                <Btn className="start btn" onClick={handleStartClick} disabled={!btnClickable}>
                  시작하기
                </Btn>
                <Btn
                  className="experience btn"
                  onClick={handleExperienceClick}
                  disabled={!btnClickable}
                >
                  체험해보기
                </Btn>
              </>
            )}
          </div>
        </div>
      </CoverContainer>
      <KeyValueContainer colored align="right">
        <div className="fill" />
        <div className="large margin" />
        <ContentBox className="content">
          <DescrWrapper className="desc">
            <DescTitle>
              쉽고 간편한
              <br />
              운동 메이트 찾기
            </DescTitle>
            <DescBody>
              다양한 모임 필터를 통해
              <br />
              나와 딱 맞는 운동 메이트를 찾아보세요
            </DescBody>
            <DescSubTitle>모임 검색 & 모임 만들기</DescSubTitle>
          </DescrWrapper>
          <ImageWrapper id="first-container">
            <div className="first still">
              <img id="sport-input" src="../images/sport-input.png" />
              <img id="sport-datalist" src="../images/sport-datalist.png" />
            </div>
            <div className="first animation">
              <img className="card one" src="../images/card-1-1.png" />
              <img className="card two" src="../images/card-1-2.png" />
              <img className="card three" src="../images/card-1-3.png" />
            </div>
          </ImageWrapper>
        </ContentBox>
        <div className="small margin" />
      </KeyValueContainer>
      <KeyValueContainer align="left">
        <div className="fill" />
        <div className="large margin" />
        <ContentBox className="content">
          <DescrWrapper className="desc">
            <DescTitle>
              지도에서 찾는
              <br />내 주변의 운동 모임
            </DescTitle>
            <DescBody>
              내 주변 운동 모임,
              <br />
              지도 위에서 바로 확인해 보세요
            </DescBody>
            <DescSubTitle>지도로 보기</DescSubTitle>
          </DescrWrapper>
          <ImageWrapper id="second-container">
            <div className="second still">
              <img id="map-bg" src="../images/map-bg.png" />
            </div>
            <div className="second animation">
              <img className="pin one" src="../images/map-pin-1.png" />
              <img className="pin two" src="../images/map-pin-2.png" />
              <img className="pin three" src="../images/map-pin-3.png" />
            </div>
          </ImageWrapper>
        </ContentBox>
        <div className="small margin" />
      </KeyValueContainer>
      <KeyValueContainer colored align="right">
        <div className="fill" />
        <div className="large margin" />
        <ContentBox className="content">
          <DescrWrapper className="desc">
            <DescTitle>쉬운 일정 관리</DescTitle>
            <DescBody>
              예정된 모임 일정을 모아 보고
              <br />
              리마인더 알림도 받아보세요
            </DescBody>
            <DescSubTitle>모임 일정 & 실시간 알림</DescSubTitle>
          </DescrWrapper>
          <ImageWrapper id="third-container">
            <div className="third still">
              <img id="upcoming" src="../images/upcoming.png" />
              <img id="upcoming-card" src="../images/card-3.png" />
            </div>
            <div className="third animation">
              <img id="alarm" src="../images/alarm.png" />
            </div>
          </ImageWrapper>
        </ContentBox>
        <div className="small margin" />
      </KeyValueContainer>
      <KeyValueContainer align="left">
        <div className="fill" />
        <div className="large margin" />
        <ContentBox className="content">
          <DescrWrapper className="desc">
            <DescTitle>부담없는 소통</DescTitle>
            <DescBody>
              모임에 참여하는 사람들끼리
              <br />
              바로 소통할 수 있어요
            </DescBody>
            <DescSubTitle>모임 채팅</DescSubTitle>
          </DescrWrapper>
          <ImageWrapper id="fourth-container">
            <div className="fourth animation">
              <img className="chat one" src="../images/chat-1-colored.png" />
              <img className="chat two" src="../images/chat-2-colored.png" />
              <img className="chat three" src="../images/chat-3-colored.png" />
            </div>
          </ImageWrapper>
        </ContentBox>
        <div className="small margin" />
      </KeyValueContainer>
    </LandingContainer>
  );
};

export default Landing;
