import { createGlobalStyle } from "styled-components";
import media from "styled-media-query";
import { normalize } from "styled-normalize";

const GlobalStyle = createGlobalStyle`
  ${normalize}
  
  /* HTML elements */
  
  *,
  :after,
  :before {
    margin: 0;
    box-sizing: border-box;
    line-height: var(---lineHeight-normal);
  }

  html {
    font-size: var(--fontSize-root--big);
    font-family: var(--fontFamily);
    color: var(--color-black);
    background-color: var(--color-white);
    
    ${media.lessThan("medium")`
      font-size: var(--fontSize-root--small);
    `}
  }

  button, input, textarea {
    padding: 0;
    border: none;
    outline: none;
    background-color: inherit;
  }

  button {
    cursor: pointer;
    :active,
    :hover,
    :focus {
      outline: none;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    outline: none;
  }

  ul {
    padding: 0;
    list-style: none;
  }

  /* CSS Custom Properties Definitions */

  /* 웹 상에서 font weight이 굵게 보이는 이유로, font-family 실제와 다르게 선언  */
  @font-face {
    font-family: Interop-Light;
    src: url('../fonts/Interop-Light.woff') format('woff'), url('../fonts/Interop-Light.woff2') format('woff2'), url('../fonts/Interop-ExtraLight.otf') format('opentype');
    unicode-range: U+0000-U+FFFF;
  }

  @font-face {
    font-family: Interop-Regular;
    src: url('../fonts/Interop-Regular.woff') format('woff'), url('../fonts/Interop-Regular.woff2') format('woff2'), url('../fonts/Interop-Light.otf') format('opentype');
    unicode-range: U+0000-U+FFFF;
  }

  @font-face {
    font-family: Interop-Medium;
    src: url('../fonts/Interop-Medium.woff') format('woff'), url('../fonts/Interop-Medium.woff2') format('woff2'), url('../fonts/Interop-Regular.otf') format('opentype');
    unicode-range: U+0000-U+FFFF;
  }

  @font-face {
    font-family: Interop-SemiBold;
    src: url('../fonts/Interop-SemiBold.woff') format('woff'), url('../fonts/Interop-SemiBold.woff2') format('woff2'), url('../fonts/Interop-Medium.otf') format('opentype');
    unicode-range: U+0000-U+FFFF;
  }

  @font-face {
    font-family: Interop-Bold;
    src: url('../fonts/Interop-Bold.woff') format('woff'), url('../fonts/Interop-Bold.woff2') format('woff2'), url('../fonts/Interop-SemiBold.otf') format('opentype');
    unicode-range: U+0000-U+FFFF;
  }

  @font-face {
    font-family: Interop-ExtraBold;
    src: url('../fonts/Interop-ExtraBold.woff') format('woff'), url('../fonts/Interop-ExtraBold.woff2') format('woff2'), url('../fonts/Interop-ExtraBold.otf') format('opentype');
    unicode-range: U+0000-U+FFFF;
  }

  :root {
    --fontFamily: Interop-Medium, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --fontSize-root--big: 16px;
    --fontSize-root--small: 14px;
    --lineHeight-normal: 1;
    --lineHeight-loose: 1.25;
    --lineHeight-relaxed: 1.5;
    --color-maingreen--100: #36CCC8;
    --color-maingreen--75: #68D9D6;
    --color-maingreen--50: #9BE6E3;
    --color-maingreen--25: #CDF2F1;
    --color-red: #FF5252;
    --color-red--25: #FFD4D4;
    --color-yellow: #F9CD50;
    --color-blue: #2762F4;
    --color-black: #1D1D21;
    --color-darkgray: #474751;
    --color-gray: #969699;
    --color-lightgray: #DCDCDD;
    --color-darkwhite: #f5f5f5;
    --color-white: #FFFFFF;
    --color-shadow: #1D1D2140;
  }
`;

export default GlobalStyle;
