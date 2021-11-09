import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const BubbleWrapper = styled.div`
  font-size: calc(${(props) => props.fontSize} * 1rem);
  font-family: Interop-Regular;
  line-height: var(--lineHeight-loose);
  position: relative;
`;

const BubbleContainer = styled.div`
  display: inline-block;
  position: relative;
  max-width: 24em;
  padding: 0.5em 0.75em;
  word-wrap: break-word;
  word-break: keep-all;
  :before {
    border-style: solid;
    content: "";
    display: block;
    position: absolute;
  }
  ${(props) =>
    props.isMine
      ? css`
          background-color: var(--color-maingreen--50);
          border-radius: 0.6em 0 0.6em 0.6em;
          :before {
            border-color: var(--color-maingreen--50) transparent;
            border-width: 1em 1em 0 0;
            right: -0.5em;
            top: 0;
          }
        `
      : css`
          background-color: var(--color-palegray);
          border-radius: 0 0.6em 0.6em 0.6em;
          :before {
            border-color: var(--color-palegray) transparent;
            border-width: 1em 0 0 1em;
            left: -0.5em;
            top: 0;
          }
        `}
`;

const Bubble = ({ fontSize, isMine, children }) => {
  return (
    <BubbleWrapper fontSize={fontSize}>
      <BubbleContainer isMine={isMine}>{children}</BubbleContainer>
    </BubbleWrapper>
  );
};

Bubble.defaultProps = {
  fontSize: 1,
  isMine: false,
};

Bubble.propTypes = {
  fontSize: PropTypes.number,
  isMine: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.bool, PropTypes.element, PropTypes.node]).isRequired,
};

export default Bubble;
