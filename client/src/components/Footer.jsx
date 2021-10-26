/* eslint-disable */

import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import { VscGithub, VscRepo, VscGithubAlt } from "react-icons/vsc";
import { DiGithubFull } from "react-icons/di";
import { FaGithubSquare } from "react-icons/fa";
import { RiGithubLine } from "react-icons/ri";

const StyledFooter = styled.footer`
  padding: 4rem 2rem;
  border-top: 1px solid var(--color-lightgray);
  font-family: Interop-Regular;

  ${media.lessThan("medium")`
    padding: 3rem 1rem;
  `};
`;

const Container = styled.div`
  display: flex;
  margin-bottom: 3rem;

  ${media.lessThan("medium")`
    flex-direction:column;
  `}
`;

const Wrapper = styled.div`
  flex: 1;

  ${media.lessThan("medium")`
    :not(:last-child){
      margin-bottom: 2rem;
    }
  `}
`;

const Heading = styled.h4`
  margin-bottom: 1rem;
  font-family: Interop-Medium;
  color: var(--color-black);

  ${media.lessThan("medium")`
    margin-bottom: 0.5rem;
  `}
`;

const Paragraph = styled.p``;

const Items = styled.ul``;

const Item = styled.li`
  :not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  text-decoration: underline;

  svg {
    font-size: 1.25rem;
    margin-right: 0.5rem;
  }
`;

const Copyright = styled.span``;

const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <Wrapper>
          <Heading>소개</Heading>
          <Paragraph>
            Sweatmate(스웻메이트)는 함께 운동할 사람을 찾고 싶지만 동호회에 가입하기는 부담스러운
            사람들을 위한 매칭 플랫폼입니다. 운동 종류, 지역, 운동, 날짜와 시간대에 따라 함께 운동할
            사람을 간편하게 찾을 수 있습니다.
          </Paragraph>
        </Wrapper>
        <Wrapper>
          <Heading>자료</Heading>
          <Items>
            <Item>
              <Link href="https://github.com/codestates/sweatmate" target="_blank">
                <VscGithub />
                레포지토리
              </Link>
            </Item>
            <Item>
              <Link href="https://github.com/codestates/sweatmate/wiki" target="_blank">
                <VscRepo />
                위키
              </Link>
            </Item>
          </Items>
        </Wrapper>
        <Wrapper>
          <Heading>멤버</Heading>
          <Items>
            <Item>
              <Link href="https://github.com/ssumniee" target="_blank">
                <VscGithubAlt />
                김수민
              </Link>
            </Item>
            <Item>
              <Link href="https://github.com/Yun-KC" target="_blank">
                <VscGithubAlt />
                윤정길
              </Link>
            </Item>
            <Item>
              <Link href="https://github.com/heegu0311" target="_blank">
                <VscGithubAlt />
                윤희구
              </Link>
            </Item>
            <Item>
              <Link href="https://github.com/Unuuuuu" target="_blank">
                <VscGithubAlt />
                지윤우
              </Link>
            </Item>
          </Items>
        </Wrapper>
      </Container>
      <Copyright>© 2021 Sweatmate. All rights reserved.</Copyright>
    </StyledFooter>
  );
};

export default Footer;
