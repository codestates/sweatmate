module.exports = (authKey, nickname) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      #background {
        background-image: url("https://sweatmate.s3.ap-northeast-2.amazonaws.com/cover-bg-2.png");
        font-size: 1rem;
      }
      .button {
        border: 1px solid #36CCC8;
        background-color: rgba(160, 156, 156, 0);
        color: #36CCC8;
        padding: 5px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        margin-right: -4px;
        width: 400px;
        font-weight: 700;
      }
      .button:hover {
        color: white;
        background-color: #36CCC8;
      }
      h1 {
        color: #1D1D21;
      }
      b {
        color: #36CCC8;
      }
      .sweatmate {
        color: #36CCC8;
        font-weight: 700;
      }
    </style>
  </head>
  
  <body>
  <div id="background">
    <img src="https://sweatmate.s3.ap-northeast-2.amazonaws.com/logo-transparent3x.png" width="400">
    <h2>안녕하세요 ${nickname}님! </h2>
    <h2><span class="sweatmate">SweatMate</span> 메일인증 입니다.</h2>
    <p>
      <b>SweatMate 시작하기!</b> 버튼을 눌러 이메일 인증을 완료해주세요!
    </p>
    <a href=${process.env.SERVER_URL}/auth/certification/${authKey} target="_blank">
      <button class="button">SweatMate 시작하기!</button>
    </a>
  <div>
  </body>
  
  </html>
  `;
};
