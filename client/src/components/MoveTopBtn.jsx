import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types"; // ES6
import media from "styled-media-query";
import { IoIosArrowUp /* IoIosArrowDown */ } from "react-icons/io";
import { useScroll } from "../hooks/useScroll";

const MoveTopButton = styled.button`
  position: fixed;
  align-items: center;
  justify-content: center;
  right: 2rem;
  bottom: 2rem;
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

const MoveTopBtn = ({ parent }) => {
  const { scrollY } = useScroll();
  const [showGoTop, setshowGoTop] = useState(false);

  useEffect(() => {
    if (scrollY > window.innerHeight) {
      setshowGoTop(true);
    } else if (scrollY < window.innerHeight) {
      setshowGoTop(false);
    }
  }, [scrollY]);

  const handleScrollUp = () => {
    parent.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MoveTopButton onClick={handleScrollUp} parent={parent} showGoTop={showGoTop}>
      <IoIosArrowUp /> {/* <IoIosArrowDown /> */}
    </MoveTopButton>
  );
};

MoveTopBtn.defaultProps = {
  parent: document.getElementById("root"),
};

MoveTopBtn.propTypes = {
  parent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export default MoveTopBtn;
