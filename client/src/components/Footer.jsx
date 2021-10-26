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
          <Heading>About this place</Heading>
          <Paragraph>blah blah</Paragraph>
        </Wrapper>
        <Wrapper>
          <Heading>Source</Heading>
          <Items>
            <Item>
              <Link href="https://github.com/codestates/sweatmate" target="_blank">
                <VscGithub />
                View source on GitHub
              </Link>
            </Item>
            <Item>
              <Link href="https://github.com/codestates/sweatmate/wiki" target="_blank">
                <VscRepo />
                View wiki on GitHub
              </Link>
            </Item>
          </Items>
        </Wrapper>
        <Wrapper>
          <Heading>Members</Heading>
          <Items>
            <Item>
              <Link href="https://github.com/ssumniee" target="_blank">
                <VscGithubAlt />
                ssumniee
              </Link>
            </Item>
            <Item>
              <Link href="https://github.com/Yun-KC" target="_blank">
                <VscGithubAlt />
                Yun-KC
              </Link>
            </Item>
            <Item>
              <Link href="https://github.com/heegu0311" target="_blank">
                <VscGithubAlt />
                heegu0311
              </Link>
            </Item>
            <Item>
              <Link href="https://github.com/Unuuuuu" target="_blank">
                <VscGithubAlt />
                Unuuuuu
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
