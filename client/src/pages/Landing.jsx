import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import authApi from "../api/auth";
import { signinAction, signoutAction, signupModalOnAction } from "../store/actions";
import Btn from "../components/Btn";

const LandingContainer = styled.div`
  background-image: url(${(props) => props.url});
  background-size: cover;
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100vw;
  height: fit-content;
  background-color: var(--color-white);
`;

const CoverContainer = styled.div`
  height: calc(100vh - 12rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .btn {
    margin: 2.5rem auto;
    border: 2px solid var(--color-maingreen--75);
    min-width: 15rem;
    &.start,
    &.to-home {
      background-color: var(--color-maingreen--75);
      color: var(--color-white);
      margin-right: 1rem;
    }
    &.experience {
      background-color: transparent;
      color: var(--color-maingreen--100);
      :hover {
        opacity: 1;
        background-color: var(--color-maingreen--10);
      }
    }
  }
`;

const CoverTitle = styled.h1`
  margin: 0.5rem 0;
  text-align: center;
  font-weight: normal;
  font-family: Interop-SemiBold;
  font-size: 2rem;
`;

const CoverSubTitle = styled.h2`
  margin: 0.5rem 0;
  text-align: center;
  font-weight: normal;
  font-family: Interop-Regular;
  font-size: 2rem;
`;

const KeyValueContainer = styled.div`
  height: fit-content;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
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
  ${(props) =>
    props.align === "left" &&
    css`
      flex-direction: row-reverse;
    `}
  .desc {
    ${(props) =>
      props.align === "left"
        ? css`
            margin-right: 8rem;
          `
        : css`
            margin-left: 8rem;
          `}
  }
`;

const DescrWrapper = styled.div`
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  z-index: 1;
  margin: auto 0;
`;

const DescTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-weight: normal;
  font-family: Interop-Medium;
  font-size: 1.5rem;
  line-height: var(--lineHeight-loose);
`;

const DescBody = styled.p`
  width: max-content;
  margin: 0;
  font-weight: normal;
  font-family: Interop-Light;
  font-size: 1.375rem;
  line-height: var(--lineHeight-loose);
`;

const DescSubTitle = styled.h3`
  width: max-content;
  margin: 1.5rem 0 0;
  font-weight: normal;
  font-family: Interop-Medium;
  font-size: 1.25rem;
  line-height: var(--lineHeight-loose);
  color: var(--color-darkgray);
`;

const ImageWrapper = styled.div`
  /* border: 1px solid blue; */
  z-index: 1;
  position: relative;
  display: flex;
  &#first-container,
  &#third-container {
    margin: 0 2rem 0 8rem;
  }
  &#second-container,
  &#fourth-container {
    margin: 0 8rem 0 2rem;
  }
  &#first-container {
    width: 38rem;
    padding: 2.5rem 2rem;
  }
  &#second-container {
    width: fit-content;
    padding: 2rem;
  }
  &#third-container {
    width: fit-content;
    padding: 6rem 2rem 2rem;
  }
  &#fourth-container {
    padding: 2rem;
  }
  .first {
    display: flex;
    flex-direction: column;
    #sport-input {
      width: 10rem;
      margin-bottom: 0.5rem;
    }
    #sport-datalist {
      width: 10rem;
    }
    &.animation {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
    .card {
      width: 20rem;
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
      margin-bottom: 1rem;
      :last-of-type {
        margin-bottom: 0;
      }
    }
  }
  .second {
    &.still {
      display: flex;
      flex-direction: column;
      width: 30rem;
    }
    &.animation {
      position: absolute;
      inset: 0;
    }
    .pin {
      width: 3rem;
      position: absolute;
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
      &.one {
        top: 4rem;
        left: 23.5rem;
      }
      &.two {
        top: 8.5rem;
        left: 5.5rem;
      }
      &.three {
        top: 16.25rem;
        left: 16.5rem;
      }
    }
  }
  .third {
    &.still {
      display: flex;
      flex-direction: column;
    }
    &.animation {
      position: absolute;
      inset: 0;
    }
    #upcoming {
      width: 10rem;
      height: 2.5rem;
      margin-bottom: 1.5rem;
    }
    #upcoming-card {
      width: 20rem;
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
    }
    #alarm {
      width: 20rem;
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
      position: absolute;
      left: 14rem;
      top: 0rem;
    }
  }
  .fourth {
    &.animation {
      display: flex;
      flex-direction: column;
      width: 28rem;
      height: calc(41px + 64px + 64px + 4rem);
      position: relative;
    }
    .chat {
      position: absolute;
      filter: drop-shadow(2.5px 2.5px 5px var(--color-shadow));
      &.one {
        width: 272px;
        height: 41px;
        left: 0;
        top: 0;
      }
      &.two {
        right: 0;
        top: calc(41px + 2rem);
        width: 338px;
        height: 64px;
      }
      &.three {
        width: 340px;
        height: 64px;
        left: 0;
        top: calc(41px + 64px + 4rem);
      }
    }
  }
`;

const Landing = () => {
  const { isLogin } = useSelector(({ authReducer }) => authReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleStartClick = () => {
    dispatch(signupModalOnAction);
  };

  const handleExperienceClick = async () => {
    const res = await authApi.guestSignin();
    if (res.status === 200) {
      dispatch(signinAction(res.data));
      history.push("/home");
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

  return (
    <LandingContainer url="../images/cover-bg-long.png">
      <CoverContainer>
        <CoverSubTitle>운동 메이트를 만나는 간편한 방법,</CoverSubTitle>
        <CoverTitle>스웻메이트</CoverTitle>
        <div id="btn-container">
          {isLogin ? (
            <Btn className="to-home btn" onClick={() => history.push("/home")}>
              스웻메이트 홈으로
            </Btn>
          ) : (
            <>
              <Btn className="start btn" onClick={handleStartClick}>
                스웻메이트 시작하기
              </Btn>
              <Btn className="experience btn" onClick={handleExperienceClick}>
                일단 체험해볼래요
              </Btn>
            </>
          )}
        </div>
      </CoverContainer>
      <KeyValueContainer colored align="right">
        <div className="fill" />
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
            <img className="card top" src="../images/card-1-1.png" />
            <img className="card mid" src="../images/card-1-2.png" />
            <img className="card btm" src="../images/card-1-3.png" />
          </div>
        </ImageWrapper>
      </KeyValueContainer>
      <KeyValueContainer align="left">
        <div className="fill" />
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
      </KeyValueContainer>
      <KeyValueContainer colored align="right">
        <div className="fill" />
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
      </KeyValueContainer>
      <KeyValueContainer align="left">
        <div className="fill" />
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
      </KeyValueContainer>
    </LandingContainer>
  );
};

export default Landing;
