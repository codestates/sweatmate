import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import styled, { css } from "styled-components";
import media from "styled-media-query";
import {
  IoNotificationsOutline,
  IoChatbubblesOutline,
  IoHomeOutline,
  IoCalendarNumberOutline,
  IoPowerOutline,
} from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import { BsPerson } from "react-icons/bs";
import UserProfile from "./UserProfile";
import { useDispatch, useSelector } from "react-redux";
import {
  signinAction,
  signinModalOnAction,
  signoutAction,
  signupModalOnAction,
} from "../store/actions";
import authApi from "../api/auth";
import notiApi from "../api/noti";
import { getMainSocketIO } from "../network/socket";
import Notification from "./Notification";

const StyledHeader = styled.header`
  background-color: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  width: 100%;
  border-bottom: 1px solid var(--color-lightgray);
  z-index: 10;

  ${media.lessThan("medium")`
    padding: 1rem;
  `}
`;

const LogoLink = styled(Link)`
  margin-right: 2rem;
  height: 2rem;
`;

const LongLogo = styled.img`
  height: 2rem;
  display: block;

  ${({ isLogin }) =>
    !isLogin &&
    css`
      ${media.lessThan("medium")`
        display: none;
      `}
    `};
`;

const ShortLogo = styled.img`
  height: 2rem;
  display: none;

  ${({ isLogin }) =>
    !isLogin &&
    css`
      ${media.lessThan("medium")`
        display: block;
      `}
    `};
`;

const Nav = styled.nav`
  display: flex;
  flex: 1;

  ${media.lessThan("medium")`
    display: ${({ isNav }) => (isNav ? "flex" : "none")};
    flex-direction: column;
    position: fixed;
    top: 4rem;
    left: 0;
    height: 0;
    width: 100vw;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    padding: 1rem;
    background-color: var(--color-white);
    border-top: 1px solid var(--color-lightgray);
  `}
`;

const MobileStyledH4 = styled.h4`
  display: block;
  padding-left: 1rem;
  color: var(--color-gray);
  margin-bottom: 1rem;

  &:last-of-type {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-lightgray);
  }

  ${media.greaterThan("medium")`
    display: none;
  `}
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  margin-right: 0.5rem;
  transition: background-color, color 100ms ease-out;

  :hover {
    color: var(--color-maingreen--100);
  }

  ${media.lessThan("medium")`
    padding: 1rem;
    font-size: 1.68rem;
    margin-right: 0;
    margin-bottom: 0.5rem;
    border: none;
  `}

  &.active {
    background-color: var(--color-maingreen--25);
    color: var(--color-maingreen--100);
  }
`;

const MobileStyledNavLink = styled(StyledNavLink)`
  display: flex;

  ${media.greaterThan("medium")`
    display: none;
  `}
`;

const Text = styled.span`
  font-size: 1rem;
  margin-left: 0.5rem;
  line-height: 1;

  ${media.lessThan("medium")`
    margin-left: 0.96rem;
    font-size: 1.2rem;
  `}
`;

const MobileUserContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
  background-color: var(--color-darkwhite);
  border-radius: 0.5rem;
  font-size: 1.3rem;
  align-items: center;
  margin-bottom: 1rem;

  ${media.greaterThan("medium")`
      display: none;
  `};
`;

const MobileNavBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 1rem;
  font-size: 1.68rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  color: var(--color-red);
  border: 1px solid var(--color-red);

  ${media.greaterThan("medium")`
    display: none;
  `}
`;

const NonUserBtns = styled.div``;

const NonUserBtn = styled.button`
  font-size: 1rem;
  padding: 0.75rem 1rem;
  transition: background-color 100ms ease-out;
  border-radius: 0.5rem;
  margin-left: 0.5rem;
  line-height: 1;
  ${({ main }) =>
    main &&
    css`
      color: var(--color-white);
      background-color: var(--color-maingreen--100);
    `}

  :hover {
    background-color: var(--color-darkwhite);
    ${({ main }) =>
      main &&
      css`
        background-color: var(--color-maingreen--100);
        opacity: 80%;
      `}
  }

  ${media.lessThan("medium")`
    padding: 0.5rem 0.75rem;
    margin-left: 0.25rem;
  `}
`;

const UserBtns = styled.div`
  display: flex;
  position: relative;
`;

const NotificationBtn = styled.button`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 100ms ease-out;

  :hover {
    background-color: var(--color-darkwhite);
  }

  ${media.lessThan("medium")`
    padding: 0;
    :hover {
      background-color: transparent;
    }
  `}
`;

const UserBtn = styled.button`
  display: flex;
  margin-left: 0.5rem;
  align-items: center;
  border-radius: 0.5rem;
  padding: 0.5rem;
  transition: background-color 100ms ease-out;

  :hover {
    background-color: var(--color-darkwhite);
  }

  ${media.lessThan("medium")`
    display: none;
  `};
`;

const MobileHamburgerBtn = styled.button`
  display: flex;
  font-size: 1.5rem;
  align-items: center;
  margin-left: 0.5rem;

  ${media.greaterThan("medium")`
    display: none;
  `};
`;

const PcUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: calc(-4.5rem - 3px);
  right: 0;
  border-radius: 0.5rem;
  border: 1px solid var(--color-lightgray);

  ${media.lessThan("medium")`
    display: none;
  `};
`;

const PcUserInfoMyPageBtn = styled(Link)`
  background-color: var(--color-white);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 0.5rem 0.5rem 0 0;
  border-bottom: 1px solid var(--color-lightgray);
  transition: background-color 100ms ease-out;

  :hover {
    background-color: var(--color-darkwhite);
  }
`;

const PcUserInfoLogoutBtn = styled.button`
  color: var(--color-red);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: var(--color-white);
  transition: background-color 100ms ease-out;

  :hover {
    background-color: var(--color-red--25);
  }
`;

const NotificationContainer = styled.div`
  position: relative;
`;

const NotificationWrapper = styled.div`
  position: absolute;
  top: 3rem;
  right: 0;
  border: 1px solid var(--color-lightgray);
  border-radius: 0.6rem;
  background-color: var(--color-white);
  filter: drop-shadow(0px 3px 5px var(--color-shadow));
  overflow: auto;
  display: flex;
  flex-direction: column;

  ${media.lessThan("medium")`
    top: 2.25rem;
    right: -2rem;
  `};
`;

const Header = () => {
  const [isHamburgerBtnClicked, setIsHamburgerBtnClicked] = useState(false);
  const [isUserBtnClicked, setIsUserBtnClicked] = useState(false);
  const [isNotiBtnClicked, setIsNotiBtnClicked] = useState(false);
  const [notificationList, setNotificationList] = useState([]);

  const { id, nickname, image, isLogin } = useSelector(({ authReducer }) => authReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleHamburgerClick = () => {
    setIsHamburgerBtnClicked((prev) => !prev);
    setIsNotiBtnClicked(false);
    setIsUserBtnClicked(false);
  };

  const HandleUserInfoClick = () => {
    setIsUserBtnClicked((prev) => !prev);
    setIsNotiBtnClicked(false);
    setIsHamburgerBtnClicked(false);
  };

  const HandleNotiClick = () => {
    setIsNotiBtnClicked((prev) => !prev);
    setIsUserBtnClicked(false);
    setIsHamburgerBtnClicked(false);
  };

  const closeAll = () => {
    setIsHamburgerBtnClicked(false);
    setIsNotiBtnClicked(false);
    setIsUserBtnClicked(false);
  };

  // TODO: Nickname
  // TODO: 마이페이지 버튼 링크
  // TODO: Logout btn 기능 구현
  const handleSignout = async () => {
    closeAll();
    const res = await authApi.signout();
    dispatch(signoutAction);
    if (res.status === 200) {
      getMainSocketIO().emit("signout");
      history.push("/");
    }
  };

  const handleGuestSignin = async () => {
    const res = await authApi.guestSignin();

    if (res.status === 200) {
      dispatch(signinAction(res.data));
      history.push("/home");
    }
  };

  const handleNotiBtnClick = async (id) => {
    try {
      const res = await notiApi.removeNotification(id);
      if (res.status === 200) {
        setNotificationList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getNotificationList = async () => {
      try {
        const res = await notiApi.getNotificationList();
        if (res.status === 200) {
          setNotificationList(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getNotificationList();

    getMainSocketIO().on("notice", (arg, userId) => {
      if (userId === id) {
        return;
      }
      setNotificationList((prev) => {
        if (
          arg.type === "new" &&
          prev.find((item) => item.type === "new" && item.gatheringId === arg.gatheringId)
        ) {
          return [...prev];
        }
        return [...prev, arg];
      });

      setIsUserBtnClicked(false);
      setIsNotiBtnClicked(true);
      setIsHamburgerBtnClicked(false);
    });
    return () => {
      getMainSocketIO().off("notice");
    };
  }, [id]);

  return (
    <StyledHeader>
      <LogoLink to="/" onClick={closeAll}>
        <LongLogo
          src={`${process.env.PUBLIC_URL}/assets/long-logo.png`}
          alt="long-logo"
          isLogin={isLogin}
        />
        <ShortLogo
          src={`${process.env.PUBLIC_URL}/assets/short-logo.png`}
          alt="short-logo"
          isLogin={isLogin}
        />
      </LogoLink>
      {isLogin && (
        <Nav isNav={isHamburgerBtnClicked}>
          <MobileUserContainer>
            <UserProfile size={1.2} user={{ id, nickname, image }} isDisabled />
          </MobileUserContainer>
          <MobileStyledH4>Page</MobileStyledH4>
          <StyledNavLink to="/home" onClick={closeAll}>
            <IoHomeOutline />
            <Text>홈</Text>
          </StyledNavLink>
          <StyledNavLink to="/chat" onClick={closeAll}>
            <IoChatbubblesOutline />
            <Text>채팅</Text>
          </StyledNavLink>
          <StyledNavLink to="/schedule" onClick={closeAll}>
            <IoCalendarNumberOutline />
            <Text>일정</Text>
          </StyledNavLink>
          <MobileStyledH4>Account</MobileStyledH4>
          <MobileStyledNavLink to={`/users/${id}`} onClick={closeAll}>
            <BsPerson />
            <Text>마이 페이지</Text>
          </MobileStyledNavLink>
          <MobileNavBtn onClick={handleSignout}>
            <IoPowerOutline />
            <Text>로그아웃</Text>
          </MobileNavBtn>
        </Nav>
      )}
      {!isLogin && (
        <NonUserBtns>
          <NonUserBtn onClick={handleGuestSignin}>게스트 로그인</NonUserBtn>
          <NonUserBtn onClick={() => dispatch(signinModalOnAction)}>로그인</NonUserBtn>
          <NonUserBtn main onClick={() => dispatch(signupModalOnAction)}>
            회원가입
          </NonUserBtn>
        </NonUserBtns>
      )}
      {isLogin && (
        <UserBtns>
          <NotificationContainer>
            <NotificationBtn onClick={HandleNotiClick}>
              <IoNotificationsOutline />
            </NotificationBtn>
            {isNotiBtnClicked && (
              <NotificationWrapper>
                {notificationList.length === 0 && <Notification isEmpty />}
                {notificationList.map((item) => (
                  <Notification
                    key={item.id}
                    item={item}
                    handleNotiClick={() => {
                      closeAll();
                      handleNotiBtnClick(item.id);
                    }}
                    handleDeleteClick={() => handleNotiBtnClick(item.id)}
                  />
                ))}
              </NotificationWrapper>
            )}
          </NotificationContainer>
          <UserBtn onClick={HandleUserInfoClick}>
            <UserProfile size={1} user={{ id, nickname, image }} isDisabled />
          </UserBtn>
          <MobileHamburgerBtn onClick={handleHamburgerClick}>
            <HiMenu />
          </MobileHamburgerBtn>
          {isUserBtnClicked && (
            <PcUserInfo>
              <PcUserInfoMyPageBtn to={`/users/${id}`} onClick={HandleUserInfoClick}>
                마이 페이지
              </PcUserInfoMyPageBtn>
              <PcUserInfoLogoutBtn onClick={handleSignout}>로그아웃</PcUserInfoLogoutBtn>
            </PcUserInfo>
          )}
        </UserBtns>
      )}
    </StyledHeader>
  );
};

export default Header;
