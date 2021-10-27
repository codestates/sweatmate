import React, { useEffect } from "react";
import styled from "styled-components";
import media from "styled-media-query";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useRouteMatch, useParams, Switch, Route, useHistory } from "react-router";
import { NavLink } from "react-router-dom";

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 416.72px);
`;

const Nav = styled.nav`
  width: calc(4.5rem + 171.72px + 53.88px + 67.78px);
  border-right: 1px solid var(--color-lightgray);
  display: flex;
  flex-direction: column;

  ${media.lessThan("medium")`
    width: 100%;
  `};
`;

const NavHeader = styled.header`
  padding: 1rem 2rem;
`;

const NavH1 = styled.h1`
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
`;

const ChatItem = styled(NavLink)`
  padding: 1rem;
  border-radius: 0.5rem;
  transition: background-color 100ms ease-out;
  display: flex;

  &.active,
  :hover {
    background-color: var(--color-darkwhite);
  }

  :not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const Emoji = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
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
  background-image: url("/assets/no-content.svg");
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
];

const Chat = () => {
  const { path, url } = useRouteMatch();

  return (
    <Container>
      <Nav>
        <NavHeader>
          <NavH1>
            <IoChatbubblesOutline />
            채팅
          </NavH1>
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
      <Main>
        <Switch>
          <Route exact path={path}>
            <NoContent>
              <Logo src={`${process.env.PUBLIC_URL}/assets/long-logo.png`} alt="logo" />
            </NoContent>
          </Route>
          <Route path={`${path}/:id`} component={Room} />
        </Switch>
      </Main>
    </Container>
  );
};

const Room = () => {
  const history = useHistory();
  const { id } = useParams();

  // TODO: 진짜 데이터와 비교하는 것으로 바꿔야 함
  useEffect(() => {
    if (!mock.find((item) => item.id === id)) {
      history.push("/chat");
    }
  }, []);

  return <h1>hi</h1>;
};

export default Chat;
