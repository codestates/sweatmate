import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types"; // ES6
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

const MoveTopButton = styled.button`
  position: fixed;
  align-items: center;
  justify-content: center;
  bottom: 5rem;
  right: 5rem;
  width: 4rem;
  height: 4rem;
  background-color: var(--color-maingreen--100);
  border-radius: 100%;
  filter: drop-shadow(2px 2px 6px var(--color-shadow));
  color: var(--color-white);
  font-size: 3rem;
  z-index: 999;
  display: ${(props) => (props.showGoTop ? "flex" : "none")};
`;

const MoveTop = ({ handleScrollUp }) => {
  const [scrollPosition, setSrollPosition] = useState(0);
  const [showGoTop, setshowGoTop] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleVisibleButton);
  }, [scrollPosition]);

  const handleVisibleButton = () => {
    const position = window.pageYOffset;
    setSrollPosition(position);

    if (scrollPosition > 50) {
      return setshowGoTop(true);
    } else if (scrollPosition < 50) {
      return setshowGoTop(false);
    }
  };

  return (
    <MoveTopButton onClick={handleScrollUp} showGoTop={showGoTop}>
      <MdOutlineKeyboardArrowUp />
    </MoveTopButton>
  );
};

MoveTop.propTypes = {
  handleScrollUp: PropTypes.func.isRequired,
};

export default MoveTop;
