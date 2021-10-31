import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import media from "styled-media-query";
import {
  IoChatbubblesOutline,
  IoClose,
  IoPeopleOutline,
  IoChevronBackOutline,
  IoEllipsisHorizontalOutline,
} from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { useRouteMatch, useParams, Switch, Route, useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import UserProfile from "../components/UserProfile";
import ConfirmModal from "../components/ConfirmModal";
import { useSelector, useDispatch } from "react-redux";
import { confirmModalOnAction, signInAction, signOutAction } from "../store/actions";
import authApi from "../api/auth";

const Container = styled.div`
  display: flex;
  height: calc(100vh - 73px);

  ${media.lessThan("medium")`
    height: calc(100vh - 57px);
  `}
`;
const Main = styled.main`
  flex: 1;
  position: relative;
`;
const NoContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("/chat_assets/no-content.svg");
  background-position: bottom;
  background-size: cover;

  ${media.lessThan("medium")`
    display: none;
  `}
`;
const Logo = styled.img`
  opacity: 50%;
  height: 4rem;
  transform: translateY(-2.5rem);

  ${media.lessThan("large")`
    transform: translateY(-2rem);
    height: 3rem;
  `}
`;

// TODO: 이후에 mock을 진짜 데이터로 대체해야 함
const mock = [
  {
    id: "1",
    sportEmoji: "⚽",
    title: "구로구에서 풋살합시다",
    recentMessage: "잘 부탁드려요~",
    recentMessageHour: "10월 25일",
  },
  {
    id: "2",
    sportEmoji: "👟",
    title: "서울숲에서 조깅하실분",
    recentMessage: "공기 넘 좋아용",
    recentMessageHour: "어제",
  },
  {
    id: "3",
    sportEmoji: "🎾",
    title: "용산 혼성 테니스 하실 분",
    recentMessage: "자리있나요?",
    recentMessageHour: "오후 12:27",
  },
  {
    id: "4",
    sportEmoji: "⚽",
    title: "구로구에서 풋살합시다",
    recentMessage: "잘 부탁드려요~",
    recentMessageHour: "10월 25일",
  },
  {
    id: "5",
    sportEmoji: "👟",
    title: "서울숲에서 조깅하실분",
    recentMessage: "공기 넘 좋아용",
    recentMessageHour: "어제",
  },
  {
    id: "6",
    sportEmoji: "🎾",
    title: "용산 혼성 테니스 하실 분",
    recentMessage: "자리있나요?",
    recentMessageHour: "오후 12:27",
  },
  {
    id: "7",
    sportEmoji: "⚽",
    title: "구로구에서 풋살합시다",
    recentMessage: "잘 부탁드려요~",
    recentMessageHour: "10월 25일",
  },
  {
    id: "8",
    sportEmoji: "👟",
    title: "서울숲에서 조깅하실분",
    recentMessage: "공기 넘 좋아용",
    recentMessageHour: "어제",
  },
  {
    id: "9",
    sportEmoji: "🎾",
    title: "용산 혼성 테니스 하실 분",
    recentMessage: "자리있나요?",
    recentMessageHour: "오후 12:27",
  },
  {
    id: "10",
    sportEmoji: "⚽",
    title: "구로구에서 풋살합시다",
    recentMessage: "잘 부탁드려요~",
    recentMessageHour: "10월 25일",
  },
  {
    id: "11",
    sportEmoji: "👟",
    title: "서울숲에서 조깅하실분",
    recentMessage: "공기 넘 좋아용",
    recentMessageHour: "어제",
  },
  {
    id: "12",
    sportEmoji: "🎾",
    title: "용산 혼성 테니스 하실 분",
    recentMessage: "자리있나요?",
    recentMessageHour: "오후 12:27",
  },
];

const confirmContent = {
  title: "정말 채팅방에서 나가시겠습니까?",
  body: "채팅방에서 나가시는 경우, 해당 모임 참여도 함께 취소됩니다.",
  func: () => {
    console.log("채팅방 나가기 완료");
  },
};

const Chat = () => {
  const { path, url } = useRouteMatch();
  const { isConfirmModal } = useSelector(({ modalReducer }) => modalReducer);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const checkValidUser = async () => {
      const res = await authApi.me();
      if (res.status === 200) {
        dispatch(signInAction(res.data.data));
      } else if (res.status === 202) {
        dispatch(signOutAction);
        history.push("/");
      }
    };
    checkValidUser();
  }, [dispatch, history]);

  return (
    <>
      <Container>
        <Switch>
          <Route exact path={path}>
            <Navigation url={url} />
            <Main>
              <NoContent>
                <Logo src={`${process.env.PUBLIC_URL}/assets/long-logo.png`} alt="logo" />
              </NoContent>
            </Main>
          </Route>
          <Route path={`${path}/:id`}>
            <Navigation url={url} isChatActive={true} />
            <Main>
              <Room />
            </Main>
          </Route>
        </Switch>
      </Container>
      {isConfirmModal && <ConfirmModal content={confirmContent} />}
    </>
  );
};

const Nav = styled.nav`
  width: calc(4.5rem + 171.72px + 53.88px + 67.78px);
  border-right: 1px solid var(--color-lightgray);
  display: flex;
  flex-direction: column;

  ${media.lessThan("medium")`
    width: 100%;
    display: ${({ isChatActive }) => isChatActive && "none"};
  `};
`;
const NavHeader = styled.header`
  height: 4.5rem;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;

  ${media.lessThan("medium")`
    padding: 1rem;
  `}
`;
const HeaderTitle = styled.h1`
  font-size: 1.2rem;
  display: inline;

  svg {
    font-size: 1.5rem;
    vertical-align: text-bottom;
    margin-right: 0.5rem;
  }
`;
// const NavH2 = styled.h2`
//   font-size: 0.9rem;
//   color: var(--color-gray);
//   padding: 1rem;
// `;
const ChatItemContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;
const ChatItem = styled(NavLink)`
  padding: 1rem;
  border-radius: 0.5rem;
  transition: background-color 100ms ease-out;
  display: flex;

  :hover {
    background-color: var(--color-darkwhite);
  }

  &.active {
    background-color: var(--color-maingreen--25);
  }

  :not(:last-child) {
    margin-bottom: 0.5rem;
  }

  ${media.lessThan("medium")`
    padding: 1rem 0;
    :hover {
      background-color: transparent;
    }
  `}
`;
const Emoji = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  margin-right: 1rem;
`;
const Content = styled.span`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const Title = styled.span`
  font-size: 1rem;
  margin-bottom: 0.2rem;
`;
const RecentMsg = styled.span`
  font-size: 0.8rem;
  color: var(--color-gray);
`;
const Time = styled.span`
  font-size: 0.6rem;
  color: var(--color-gray);
`;

const Navigation = ({ url, isChatActive }) => {
  return (
    <Nav isChatActive={isChatActive}>
      <NavHeader>
        <HeaderTitle>
          <IoChatbubblesOutline />
          채팅
        </HeaderTitle>
      </NavHeader>
      <ChatItemContainer>
        {mock.map((item) => (
          <ChatItem key={item.id} to={`${url}/${item.id}`}>
            <Emoji>{item.sportEmoji}</Emoji>
            <Content>
              <Title>{item.title}</Title>
              <RecentMsg>{item.recentMessage}</RecentMsg>
            </Content>
            <Time>{item.recentMessageHour}</Time>
          </ChatItem>
        ))}
      </ChatItemContainer>
    </Nav>
  );
};

Navigation.defaultProps = {
  isChatActive: false,
};
Navigation.propTypes = {
  url: PropTypes.string.isRequired,
  isChatActive: PropTypes.bool,
};

// TODO: 이후에 진짜 데이터로 대체해야 함
const gatheringWithChat = {
  title: "구로구에서 풋살합시다",
  emoji: "⚽",
  users: [
    { id: "1", nickname: "영희", image: "" },
    { id: "2", nickname: "철수", image: "" },
  ],
  chatLog: [
    {
      id: "1",
      userId: "1",
      nickname: "영희",
      image: "",
      message: "오고 계신가요?",
    },
    {
      id: "2",
      userId: "2",
      nickname: "철수",
      image: "",
      message: "네",
    },
    {
      id: "3",
      userId: "1",
      nickname: "영희",
      image: "",
      message:
        "몇 시 도착 예정이실까요몇 시 도착 예정이실까요몇 시 도착 예정이실까요몇 시 도착 예정이실까요몇 시 도착 예정이실까요몇 시 도착 예정이실까요몇 시 도착 예정이실까요",
    },
    {
      id: "4",
      userId: "2",
      nickname: "철수",
      image: "",
      message: "2시용",
    },
    {
      id: "5",
      userId: "7",
      nickname: "Unuuuuu",
      image: "",
      message: "굳",
    },
    {
      id: "6",
      userId: "1",
      nickname: "영희",
      image: "",
      message: "오고 계신가요?",
    },
    {
      id: "7",
      userId: "2",
      nickname: "철수",
      image: "",
      message: "네",
    },
    {
      id: "8",
      userId: "1",
      nickname: "영희",
      image: "",
      message: "몇 시 도착 예정이실까요",
    },
    {
      id: "9",
      userId: "2",
      nickname: "철수",
      image: "",
      message: "2시용",
    },
    {
      id: "10",
      userId: "7",
      nickname: "Unuuuuu",
      image: "",
      message: "굳",
    },
    {
      id: "11",
      userId: "1",
      nickname: "영희",
      image: "",
      message: "오고 계신가요?",
    },
    {
      id: "12",
      userId: "2",
      nickname: "철수",
      image: "",
      message: "네",
    },
    {
      id: "13",
      userId: "1",
      nickname: "영희",
      image: "",
      message: "몇 시 도착 예정이실까요",
    },
    {
      id: "14",
      userId: "2",
      nickname: "철수",
      image: "",
      message: "2시용",
    },
    {
      id: "15",
      userId: "7",
      nickname: "Unuuuuu",
      image: "",
      message: "굳",
    },
  ],
};

const RoomContainer = styled.div`
  display: flex;
  height: 100%;
`;
const ChatContainer = styled.div`
  flex: 1;
  height: 100%;
  border-right: 1px solid var(--color-lightgray);
  display: flex;
  flex-direction: column;

  ${media.lessThan("large")`
    display : ${({ isDrawer }) => isDrawer && "none"};
  `}
`;
const ChatHeader = styled.header`
  height: 4.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-lightgray);
  justify-content: space-between;
`;
const ChatHeaderTitle = styled(HeaderTitle)``;
const ChatMain = styled.main`
  height: calc(100% - 4.5rem);
  display: flex;
  flex-direction: column;
`;
const ChatLog = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100% - 5.5rem);
  background-image: url("/chat_assets/bg.svg");
  background-position: center;
  background-size: contain;
`;
const ChatLogItem = styled.div`
  display: flex;
  align-items: flex-start;
  :not(:last-of-type) {
    margin-bottom: 1rem;
  }
  align-self: ${({ isCreator }) => isCreator && "flex-end"};
`;
const Bubble = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border: 1px solid var(--color-lightgray);
  background-color: var(--color-darkwhite);
  border-radius: 0 0.5rem 0.5rem;
  ${({ isCreator }) =>
    isCreator &&
    css`
      border-radius: 0.5rem 0 0.5rem 0.5rem;
      background-color: var(--color-maingreen--25);
      border-color: var(--color-maingreen--100);
    `};
`;
const NicknameBubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Nickname = styled.span`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;
const BubbleMessage = styled.p``;
const ChatFormContainer = styled.div`
  border-top: 1px solid var(--color-lightgray);
  padding: 1rem;
`;
const ChatForm = styled.form`
  display: flex;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--color-darkwhite);
`;
const ChatInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  ::placeholder {
    color: var(--color-lightgray);
  }
`;
const ChatSubmitBtn = styled.button`
  background-color: var(--color-maingreen--100);
  border-radius: 0.5rem;
  display: flex;
  padding: 0.5rem;
  font-size: 1.5rem;
  svg {
    color: white;
  }
`;
const HeaderButton = styled.button`
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
const ChatBackBtn = styled(HeaderButton)`
  display: none;
  ${media.lessThan("medium")`
    display: flex;
  `}
`;
const EllipsisBtn = styled(HeaderButton)``;
const DrawerCloseBtn = styled(HeaderButton)``;
const DrawerContainer = styled.div`
  flex-basis: calc(4.5rem + 171.72px + 53.88px + 67.78px);
  height: 100%;
  display: flex;
  flex-direction: column;

  ${media.lessThan("large")`
    flex-basis: 100%;
  `}
`;
const DrawerHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem;
  height: 4.5rem;

  ${media.lessThan("large")`
    justify-content: space-between;
    flex-direction: row-reverse;
  `}
`;
const DrawerHeaderTitle = styled(HeaderTitle)`
  flex: 1;
  text-align: center;
  margin-right: 2.5rem;
  ${media.between("medium", "large")`
    text-align: left;
  `}
  ${media.lessThan("medium")`
    margin-right: 0;
    margin-left: 1.5rem;
  `}
`;
const DrawerMain = styled.main`
  height: calc(100% - 4.5rem);
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 1rem 1rem;
`;
const Members = styled.ul`
  margin-bottom: 1rem;
  flex: 1;
  overflow-y: scroll;
`;
const Member = styled.li`
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  :not(:last-of-type) {
    margin-bottom: 1rem;
  }
`;
const BanishBtn = styled.button`
  display: flex;
  font-size: 0.9rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.2rem;
  color: var(--color-red);
  border: 1px solid var(--color-red);
  transition: background-color 100ms ease-out;
  :hover {
    background-color: var(--color-darkwhite);
  }
  ${media.lessThan("medium")`
    padding: 0.25rem;
    margin: 0;
    :hover {
      background-color: transparent;
    }
  `}
`;
const LeaveBtn = styled.button`
  height: 3.5rem;
  border: 1px solid var(--color-red);
  color: var(--color-red);
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: background-color 100ms ease-out;

  :hover {
    background-color: var(--color-darkwhite);
  }
`;

const memberMockUp = [
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
  {
    id: "7",
    nickname: "Unuuuuu",
    image: "",
  },
  {
    id: "8",
    nickname: "Heegu",
    image: "",
  },
];

const Room = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { url } = useRouteMatch();

  const [isDrawer, setIsDrawer] = useState(false);

  // TODO: 진짜 데이터와 비교하는 것으로 바꿔야 함
  useEffect(() => {
    if (!mock.find((item) => item.id === id)) {
      history.push("/chat");
    }
  }, []);

  useEffect(() => {
    setIsDrawer(false);
  }, [url]);

  const handleChatBackBtnClick = () => {
    history.push("/chat");
  };
  const handleEllopsisBtnClick = () => {
    setIsDrawer(true);
  };
  const handleDrawerCloseBtnClick = () => {
    setIsDrawer(false);
  };
  const handleLeaveBtnClick = () => {
    dispatch(confirmModalOnAction);
  };

  return (
    <RoomContainer>
      <ChatContainer isDrawer={isDrawer}>
        <ChatHeader>
          <ChatBackBtn type="button" onClick={handleChatBackBtnClick}>
            <IoChevronBackOutline />
          </ChatBackBtn>
          <ChatHeaderTitle>
            {gatheringWithChat.emoji} {gatheringWithChat.title}
          </ChatHeaderTitle>
          {!isDrawer && (
            <EllipsisBtn type="button" onClick={handleEllopsisBtnClick}>
              <IoEllipsisHorizontalOutline />
            </EllipsisBtn>
          )}
        </ChatHeader>
        <ChatMain>
          <ChatLog>
            {gatheringWithChat.chatLog.map((item) => {
              const isCreator = item.userId === "7";
              return (
                <ChatLogItem key={item.id} isCreator={isCreator}>
                  {!isCreator && (
                    <UserProfile
                      user={{ id: item.userId, nickname: item.nickname, image: item.image }}
                      size={1.5}
                      hideName={true}
                      isCreator={isCreator}
                    />
                  )}
                  <NicknameBubbleContainer>
                    {!isCreator && <Nickname>{item.nickname}</Nickname>}
                    <Bubble isCreator={isCreator}>
                      <BubbleMessage>{item.message}</BubbleMessage>
                    </Bubble>
                  </NicknameBubbleContainer>
                </ChatLogItem>
              );
            })}
          </ChatLog>
          <ChatFormContainer>
            <ChatForm>
              <ChatInput type="text" placeholder="메시지를 입력해주세요."></ChatInput>
              <ChatSubmitBtn type="submit">
                <IoIosSend />
              </ChatSubmitBtn>
            </ChatForm>
          </ChatFormContainer>
        </ChatMain>
      </ChatContainer>
      {isDrawer && (
        <DrawerContainer>
          <DrawerHeader>
            <DrawerCloseBtn type="button" onClick={handleDrawerCloseBtnClick}>
              <IoClose />
            </DrawerCloseBtn>
            <DrawerHeaderTitle>
              <IoPeopleOutline />
              참여중인 메이트
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerMain>
            <Members>
              {memberMockUp.map((member, idx) => {
                const user = member;
                const isCreator = member.id === "7";
                return (
                  <Member key={idx}>
                    <UserProfile size={1.2} user={user} isCreator={isCreator} />
                    {!isCreator && <BanishBtn type="button">내보내기</BanishBtn>}
                  </Member>
                );
              })}
            </Members>
            <LeaveBtn type="button" onClick={handleLeaveBtnClick}>
              모임 나가기
            </LeaveBtn>
            {/* <QuitBtn></QuitBtn> */}
          </DrawerMain>
        </DrawerContainer>
      )}
    </RoomContainer>
  );
};

export default Chat;
