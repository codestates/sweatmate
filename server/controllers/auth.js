const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const { userFindOne, createUser } = require("./functions/sequelize");
const { sendGmail } = require("./functions/mail");
const { DBERROR } = require("./functions/utility");
const { generateAccessToken, setCookie, clearCookie } = require("./functions/token");
const {
  bcrypt: { saltRounds },
} = require("../config");
const emailForm = require("../views/emailFormat");
/*
  스케줄러 구성요소, 매 24시간마다 모임일정이 지난 게더링들 done = 1;
  매 24시간마다 예상하지 못한 서버 재실행에 의해서 사라진 셋타임함수들을 대비해서
  게스트의 createdAt이 24시간이 지난 유저에 대해서 삭제 
  이메일 인증이 1시간이 지난  유저 삭제
*/
const guestTable = {};

module.exports = {
  validNickname: async (req, res) => {
    return res.status(200).json({ message: "Valid nickname" });
  },
  validEmail: async (req, res) => {
    return res.status(200).json({ message: "Valid Email" });
  },
  signup: async (req, res) => {
    const { email, password, nickname } = req.body;

    const hashed = await bcrypt.hash(password, saltRounds);
    const authKey = Math.random().toString(36).slice(2);

    try {
      await createUser({
        id: uuid(),
        nickname,
        email,
        password: hashed,
        authKey,
      });

      setTimeout(async () => {
        const userInfo = await userFindOne({ authKey });
        if (!userInfo.dataValues.authStatus) {
          await userInfo.destroy();
          console.log(userInfo.dataValues, "유저 정보가 삭제되었습니다.");
        }
      }, 60 * 60 * 1000);

      sendGmail({
        toEmail: email,
        subject: "안녕하세요 Sweatmate입니다.",
        html: emailForm(authKey),
      });

      return res.status(201).json({ message: "1시간 이내에 이메일 인증을 진행해주세요" });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  certifyEmail: async (req, res) => {
    const { authKey } = req.params;
    try {
      const userInfo = await userFindOne({ authKey });
      if (!userInfo) return res.status(400).send("인증 시간이 초과되었습니다.");
      userInfo.update({ authStatus: 1, authKey: null });
      const token = generateAccessToken(userInfo.dataValues.id, userInfo.dataValues.type);
      setCookie(res, token);
      return res.redirect(`${process.env.CLIENT_URL}`);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  signin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const foundUserByEmail = await userFindOne({ email });
      if (!foundUserByEmail) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (!foundUserByEmail.dataValues.authStatus) {
        return res.status(400).json({ message: "Need to verify your email first" });
      }
      const isValidPassword = await bcrypt.compare(password, foundUserByEmail.dataValues.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = generateAccessToken(
        foundUserByEmail.dataValues.id,
        foundUserByEmail.dataValues.type
      );
      setCookie(res, token);
      const { id, image, nickname } = foundUserByEmail.dataValues;
      return res.status(200).json({ id, image, nickname });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  me: async (req, res) => {
    const { userId, type } = res.locals;
    try {
      const userInfo = await userFindOne({ id: userId });
      const { id, image, nickname } = userInfo;
      // 유저가 만약 2시간동안 아무런 요청이 없다면 자동으로 관련 정보 삭제
      if (type === "guest") {
        const setTimeOutId = guestTable[userId];
        clearTimeout(setTimeOutId);
        guestTable[userId] = setTimeout(() => {
          delete guestTable[guestUUID];
          userInfo.destroy();
        }, 7200000);
      }
      return res.status(200).json({ id, image, nickname });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  signout: (req, res) => {
    clearCookie(res);
    return res.status(205).json({ message: "Signed out" });
  },
  guestSignin: async (req, res) => {
    const guestUUID = uuid();
    const guestUser = await createUser({
      id: guestUUID,
      email: guestUUID,
      nickname: guestUUID.split("-")[0],
      authStatus: 1,
      type: "guest",
    });
    const token = generateAccessToken(guestUser.dataValues.id, guestUser.dataValues.type);
    setCookie(res, token);
    const { id, nickname } = guestUser.dataValues;
    guestTable[guestUUID] = setTimeout(() => {
      delete guestTable[guestUUID];
      guestUser.destroy();
    }, 7200000);
    //게스트로그인에 nickname는 UUID 의 첫 번째, 이미지는 미설정시 null 이기 때문에 null을 추가로 넣어줌
    return res.status(200).json({ id, image: null, nickname });
  },
};
