import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import media from "styled-media-query";

/*
  Btn 컴포넌트 활용 가이드
  * 버튼에 반드시 클래스명을 부여해야 합니다.
    해당 클래스명을 통해 컴포넌트를 select하여 추가적인 CSS 속성을 줄 수도 있습니다. 
    (버튼이 hover 되었을 때의 CSS, flex 옵션을 주고자 하는 경우, 특정 값으로 버튼 크기를 고정하고 싶을 경우 등에 활용하세요.)
  * 버튼의 텍스트 색상, 배경 색상을 color, bgColor 프롭스를 전달함으로써 설정할 수 있습니다.
    위 속성들이 존재하지 않는 경우, 텍스트 색상은 var(--color-black), 배경 색상은 "var(--color-darkwhite)"으로 설정됩니다.
*/

const ButtonContainer = styled.button`
  text-align: center;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  :hover {
    opacity: 0.8;
  }
  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  font-size: 1.2rem;
  min-width: fit-content;
  padding: 1rem 1.5rem;
  border-radius: 0.8rem;
  ${media.lessThan("medium")`
    font-size: 1.15rem;
    padding: 0.875rem 1.25rem;
    border-radius: 0.6rem;
    `};
  ${media.lessThan("small")`
    font-size: 1rem;
    padding: 0.75rem 1rem;
  `};
`;
const Btn = ({ className, color, bgColor, onClick, disabled, children, ...rest }) => {
  return (
    <ButtonContainer
      className={className}
      color={color}
      bgColor={bgColor}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </ButtonContainer>
  );
};

Btn.defaultProps = {
  color: "var(--color-darkgray)",
  bgColor: "var(--color-darkwhite)",
  onClick: null,
  disabled: false,
  children: null,
};

Btn.propTypes = {
  className: PropTypes.string.isRequired,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.element,
    PropTypes.node,
    PropTypes.string,
  ]),
};

export default Btn;
