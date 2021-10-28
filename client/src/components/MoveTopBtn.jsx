import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types"; // ES6
import media from "styled-media-query";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

/*
  MoveTopBtn 컴포넌트 활용 가이드
  * 채팅방에서 해당 컴포넌트를 사용하고자 할 때에는 isOnChat 프롭스를 true로 전달해주면, 화살표의 방향이 아래를 가리키게 됩니다.
*/

const MoveTopButton = styled.button`
  position: fixed;
  align-items: center;
  justify-content: center;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-maingreen--25);
  border-radius: 100%;
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
  color: var(--color-maingreen--100);
  font-size: 1.75rem;
  z-index: 10;
  display: ${(props) => (props.showGoTop ? "flex" : "none")};
  ${media.lessThan("medium")`
    /* screen width is between 768px (medium) and 1170px (large) */
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.5rem;
  `}
`;

const MoveTopBtn = ({ isOnChat }) => {
  const [scrollPosition, setSrollPosition] = useState(0);
  const [showGoTop, setshowGoTop] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleVisibleButton);
    console.dir(document.getElementById("moveTop"));
  }, []);

  useEffect(() => {
    handleVisibleButton();
  }, [scrollPosition]);

  const handleVisibleButton = () => {
    const position = window.pageYOffset;
    const height = window.innerHeight;
    setSrollPosition(position);

    if (scrollPosition > height) {
      return setshowGoTop(true);
    } else if (scrollPosition < height) {
      return setshowGoTop(false);
    }
  };

  const handleScrollUp = () => {
    document.getElementById("root").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MoveTopButton id="moveTop" onClick={handleScrollUp} showGoTop={showGoTop}>
      {isOnChat ? <IoIosArrowDown /> : <IoIosArrowUp />}
    </MoveTopButton>
  );
};

MoveTopBtn.propTypes = {
  isOnChat: PropTypes.bool,
};

export default MoveTopBtn;
