module.exports = (authKey) => {
  return `
  <img src="https://sweatmate.s3.ap-northeast-2.amazonaws.com/logo-transparent3x.png" width="400">
  <h1>안녕하세요! SweatMate 입니다.</h1>
  <p>
    이메일 확인 버튼을 눌러 인증을 진행해주세요!
    <a href= ${process.env.SERVER_URL}/auth/certification/${authKey}
      target="_blank"><button>이메일 확인</button>
    </a>
  </p>
  `;
};
