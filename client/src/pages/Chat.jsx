/* eslint-disable */

import React, { useEffect, useState, useRef, memo, forwardRef, Fragment } from "react";
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
import Bubble from "../components/Bubble";
import { useRouteMatch, useParams, Switch, Route, useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import UserProfile from "../components/UserProfile";
import ConfirmModal from "../components/ConfirmModal";
import { useSelector, useDispatch } from "react-redux";
import { confirmModalOnAction, signinAction, signoutAction } from "../store/actions";
import authApi from "../api/auth";
import chatApi from "../api/chat";
import gathApi from "../api/gath";
import { getChatSocketIO, getMainSocketIO, removeChatSocket } from "../network/socket";

const Container = styled.div`
  display: flex;
  height: calc(100vh - 73px);

  ${media.lessThan("medium")`
    height: calc(100vh - 57px);
  `}
`;
const Main = styled.main`
  flex: 1;
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

const Chat = () => {
  const [chatList, setChatList] = useState([]);

  const { path, url } = useRouteMatch();

  const dispatch = useDispatch();
  const history = useHistory();

  const updateChatList = (list) => {
    setChatList(list);
  };

  useEffect(() => {
    // getMainSocketIO().on("notice", (arg) => {});
  }, []);

  useEffect(() => {
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
  }, [dispatch, history]);

  return (
    <>
      <Container>
        <Switch>
          <Route exact path={path}>
            <Navigation url={url} updateChatList={updateChatList} chatList={chatList} />
            <Main>
              <NoContent>
                <Logo src={`${process.env.PUBLIC_URL}/assets/long-logo.png`} alt="logo" />
              </NoContent>
            </Main>
          </Route>
          <Route path={`${path}/:id`}>
            <Navigation
              url={url}
              isChatActive={true}
              updateChatList={updateChatList}
              chatList={chatList}
            />
            <Main>
              <Room chatList={chatList} updateChatList={updateChatList} />
            </Main>
          </Route>
        </Switch>
      </Container>
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

const Navigation = ({ url, isChatActive, updateChatList, chatList }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getChatList = async () => {
      const res = await chatApi.getChatList();
      if (res.status === 200) {
        updateChatList(res.data);
        setIsLoading(false);
      }
    };
    getChatList();
    getMainSocketIO().on("quit", () => {
      getChatList();
    });
    return () => {
      getMainSocketIO().off("quit");
    };
  }, []);

  const today = new window.Date();
  today.setHours(today.getHours() + 9);
  const todayDate = today.toISOString().replace("T", " ").substring(0, 10);

  return (
    <Nav isChatActive={isChatActive}>
      <NavHeader>
        <HeaderTitle>
          <IoChatbubblesOutline />
          채팅
        </HeaderTitle>
      </NavHeader>
      <ChatItemContainer>
        {isLoading && <h1>로딩중입니다.</h1>}
        {!isLoading &&
          (chatList.length !== 0 ? (
            chatList.map((chat) => {
              let dateOrTime = chat.recentChat[0].date?.slice(0, 10);
              if (chat.recentChat[0].date?.slice(0, 10) === todayDate) {
                const tempChatTime = chat.recentChat[0].date.slice(11);
                const hour = Number(tempChatTime.split(":")[0]);
                const minuteStr = tempChatTime.split(":")[1];
                let dayOrNight;
                let chatTime;
                if (hour > 12) {
                  dayOrNight = "오후";
                  chatTime = (hour - 12).toString() + ":" + minuteStr;
                } else {
                  dayOrNight = "오전";
                  chatTime = tempChatTime.startsWith("0") ? tempChatTime.slice(1) : tempChatTime;
                }
                dateOrTime = `${dayOrNight} ${chatTime}`;
              }

              return (
                <ChatItem key={chat.gatheringId} to={`${url}/${chat.gatheringId}`}>
                  <Emoji>{chat.chatInfo.sportEmoji}</Emoji>
                  <Content>
                    <Title>{chat.chatInfo.title}</Title>
                    <RecentMsg>{chat.recentChat[0].message || "아직 메시지가 없습니다."}</RecentMsg>
                  </Content>
                  <Time>{dateOrTime}</Time>
                </ChatItem>
              );
            })
          ) : (
            <h1>다가오는 일정이 없습니다. 모임에 참여해보세요.</h1>
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
  updateChatList: PropTypes.func.isRequired,
  chatList: PropTypes.array.isRequired,
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
  flex: 1 1 auto;
`;
const DateDividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  :first-child {
    margin-top: 0;
  }
`;
const DateDivider = styled.div`
  flex: 1;
  height: 1px;
  background-color: var(--color-lightgray);
`;
const DateDividerContent = styled.span`
  color: var(--color-gray);
  margin: 0 1rem;
  font-size: 0.8rem;
`;
const ChatLogItem = styled.div`
  display: flex;
  align-items: flex-start;
  :not(:last-of-type) {
    margin-bottom: 1rem;
  }
  align-self: ${({ isMine }) => isMine && "flex-end"};
`;
const BubbleDateContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: ${({ isMine }) => isMine && "row-reverse"};
`;
const Date = styled.span`
  font-size: 0.8rem;
  color: var(--color-gray);
  margin-left: 0.25rem;
  ${({ isMine }) =>
    isMine &&
    css`
      margin-left: 0;
      margin-right: 0.25rem;
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
const ChatFormContainer = styled.div`
  border-top: 1px solid var(--color-lightgray);
  padding: 1rem;
  flex: 0 0 auto;
`;
const ChatForm = styled.form`
  display: flex;
  border-radius: 0.5rem;
  background-color: var(--color-darkwhite);
`;
const ChatInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  ::placeholder {
    font-family: Interop-Regular;
    color: var(--color-gray);
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

const Room = ({ chatList, updateChatList }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isConfirmModal } = useSelector(({ modalReducer }) => modalReducer);

  const { id } = useParams();
  const { url } = useRouteMatch();
  const chatLogRef = useRef(null);

  const [isDrawer, setIsDrawer] = useState(false);
  const [userList, setUserList] = useState([]);
  const [chatLog, setChatLog] = useState([]);
  const [chatInfo, setChatInfo] = useState({});
  const [inputValue, setInputValue] = useState("");
  const { id: userId, nickname, image } = useSelector(({ authReducer }) => authReducer);

  const leaveConfirmContent = {
    title: "정말 채팅방에서 나가시겠습니까?",
    body: "채팅방에서 나가시는 경우, 해당 모임 참여도 함께 취소됩니다.",
    func: async () => {
      try {
        await gathApi.leaveGath(id);
      } catch (err) {
        console.log(err);
      }
    },
  };

  const quitConfirmContent = {
    title: "정말 채팅방을 종료시키겠습니까?",
    body: "채팅방을 종료시키는 경우, 해당 모임도 함께 종료됩니다.",
    func: async () => {
      try {
        await gathApi.endGath(id);
      } catch (err) {
        console.log(err);
      }
    },
  };

  useEffect(() => {
    console.log("hi");
    let isAvailable = false;
    const getChatList = async () => {
      const res = await chatApi.getChatList();
      if (res.status === 200 && !res.data.find((chat) => chat.gatheringId === Number(id))) {
        return history.push("/chat");
      }
      isAvailable = true;
      const mainSocketIO = getMainSocketIO();
      const chatSocketIO = getChatSocketIO(id);

      mainSocketIO.emit("leaveMainRoom", Number(id));
      chatSocketIO.on("message", (arg) => {
        console.log(chatList);
        // const found = chatList.find((chat) => chat.gatheringId === Number(id));
        // updateChatList([
        //   { ...found, recentChat: [{ date: arg.date, message: arg.message }] },
        //   ...chatList.filter((chat) => chat.gatheringId !== Number(id)),
        // ]);
        setChatLog((prev) => [...prev, arg]);
      });
      chatSocketIO.on("quit", () => {
        updateChatList(chatList.filter((chat) => chat.gatheringId !== Number(id)));
        return history.push("/chat");
      });
      chatSocketIO.on("leave", (arg) => {
        if (arg === userId) {
          updateChatList(chatList.filter((chat) => chat.gatheringId !== Number(id)));
          return history.push("/chat");
        }
      });

      const getChatDetail = async () => {
        const res = await chatApi.getChatDetail(id);
        if (res.status === 200) {
          const { userList, chatLog, chatInfo, creatorId } = res.data;
          setUserList(userList);
          setChatLog(chatLog);
          setChatInfo({ ...chatInfo, creatorId });
          chatLogRef?.current?.lastChild?.scrollIntoView();
        }
      };
      getChatDetail();
    };
    getChatList();

    return () => {
      console.log("unmount");
      removeChatSocket();
      getChatSocketIO(id).emit("leave");
      getChatSocketIO(id).off("message");
      getChatSocketIO(id).off("quit");
      getChatSocketIO(id).off("leave");
      isAvailable && getMainSocketIO().emit("joinMainRoom", Number(id));
    };
  }, [id]);

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
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleChatSubmit = (event) => {
    event.preventDefault();
    if (inputValue === "") {
      return;
    }
    getChatSocketIO(id).emit("message", { id: userId, nickname, image }, inputValue);
    setInputValue("");
  };

  const isCreatorLogined = chatInfo?.creatorId === userId;

  return (
    <RoomContainer>
      <ChatContainer isDrawer={isDrawer}>
        <ChatHeader>
          <ChatBackBtn type="button" onClick={handleChatBackBtnClick}>
            <IoChevronBackOutline />
          </ChatBackBtn>
          <ChatHeaderTitle>
            {chatInfo.sportEmoji} {chatInfo.title}
          </ChatHeaderTitle>
          {!isDrawer && (
            <EllipsisBtn type="button" onClick={handleEllopsisBtnClick}>
              <IoEllipsisHorizontalOutline />
            </EllipsisBtn>
          )}
        </ChatHeader>
        <ChatMain>
          <ChatLogComp
            ref={chatLogRef}
            chatLog={chatLog}
            creatorId={chatInfo?.creatorId}
            userId={userId}
          />
          <ChatFormContainer>
            <ChatForm onSubmit={handleChatSubmit}>
              <ChatInput
                type="text"
                placeholder="메시지를 입력해주세요."
                value={inputValue}
                onChange={handleInputChange}
              />
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
              {userList
                .filter((user) => user.id === chatInfo.creatorId)
                .map((user) => (
                  <Member key={user.id}>
                    <UserProfile size={1.2} user={user} isCreator={true} />
                  </Member>
                ))}
              {userList
                .filter((user) => user.id !== chatInfo.creatorId)
                .map((user) => (
                  <Member key={user.id}>
                    <UserProfile size={1.2} user={user} />
                    {isCreatorLogined && <BanishBtn type="button">내보내기</BanishBtn>}
                  </Member>
                ))}
            </Members>
            <LeaveBtn type="button" onClick={handleLeaveBtnClick}>
              {isCreatorLogined ? "모임 종료" : "모임 나가기"}
            </LeaveBtn>
          </DrawerMain>
        </DrawerContainer>
      )}
      {isConfirmModal && (
        <ConfirmModal content={isCreatorLogined ? quitConfirmContent : leaveConfirmContent} />
      )}
    </RoomContainer>
  );
};

Room.propTypes = {
  chatList: PropTypes.array.isRequired,
  updateChatList: PropTypes.func.isRequired,
};

// eslint-disable-next-line react/display-name
const ChatLogComp = memo(
  forwardRef(({ chatLog, creatorId, userId }, ref) => {
    useEffect(() => {
      ref?.current?.lastChild?.scrollIntoView({ behavior: "smooth" });
    }, [chatLog]);

    let prevDate;
    let date;

    return (
      <ChatLog ref={ref}>
        {chatLog.map((item) => {
          if (prevDate !== date) {
            prevDate = date;
          }
          const [chatDate, tempChatTime] = item.date.split(" ");
          date = chatDate;

          const hour = Number(tempChatTime.split(":")[0]);
          const minuteStr = tempChatTime.split(":")[1];
          let dayOrNight;
          let chatTime;
          if (hour > 12) {
            dayOrNight = "오후";
            chatTime = (hour - 12).toString() + ":" + minuteStr;
          } else {
            dayOrNight = "오전";
            chatTime = tempChatTime.startsWith("0") ? tempChatTime.slice(1) : tempChatTime;
          }

          const isCreator = creatorId === item.id;
          const isMine = userId === item.id;
          return (
            <Fragment key={item._id}>
              {date !== prevDate && (
                <DateDividerContainer>
                  <DateDivider />
                  <DateDividerContent>{date}</DateDividerContent>
                  <DateDivider />
                </DateDividerContainer>
              )}
              <ChatLogItem key={item.id} isMine={isMine}>
                {!isMine && (
                  <UserProfile
                    user={{ id: item.id, nickname: item.nickname, image: item.image }}
                    size={1.5}
                    hideName={true}
                    isCreator={isCreator}
                  />
                )}
                <NicknameBubbleContainer>
                  {!isMine && <Nickname>{item.nickname}</Nickname>}
                  <BubbleDateContainer isMine={isMine}>
                    <Bubble isMine={isMine}>{item.message}</Bubble>
                    <Date isMine={isMine}>
                      {dayOrNight} {chatTime}
                    </Date>
                  </BubbleDateContainer>
                </NicknameBubbleContainer>
              </ChatLogItem>
            </Fragment>
          );
        })}
      </ChatLog>
    );
  })
);

ChatLogComp.defaultProps = {
  creatorId: "",
  userId: "",
};

ChatLogComp.propTypes = {
  chatLog: PropTypes.array.isRequired,
  creatorId: PropTypes.string,
  userId: PropTypes.string,
};

export default Chat;
