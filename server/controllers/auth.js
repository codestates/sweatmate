const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const axios = require("axios");
const {
  userFindOne,
  createUser,
  getUniqueNickname,
  getGatheringIdsByUser,
  ModifyTheCurrentNumOfGathering,
} = require("./functions/sequelize");
const noticeModel = require("../schemas/notification");
const { sendGmail } = require("./functions/mail");
const { DBERROR, deleteImageinTable, dropUser } = require("./functions/utility");
const { generateAccessToken, setCookie, clearCookie } = require("./functions/token");
const {
  bcrypt: { saltRounds },
  google,
  kakao,
} = require("../config");
const emailForm = require("../views/emailFormat");
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
    if (!(email && password && nickname)) {
      return res.status(400).json({ message: "Incorrect format" });
    }
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

      sendGmail({
        toEmail: email,
        subject: "안녕하세요 Sweatmate입니다.",
        html: emailForm(authKey, nickname), // TODO: html 수정 필요!
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

      //유저 노티피케이션 테이블 생성 부분
      const { id } = userInfo.dataValues;
      noticeModel.signup(id);

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
      // 게스트 유저가 만약 2시간동안 아무런 요청이 없다면 자동으로 관련 정보 삭제
      if (type === "guest") {
        const setTimeOutId = guestTable[userId];
        clearTimeout(setTimeOutId);
        guestTable[userId] = setTimeout(async () => {
          //TODO: 해당 유저의 Mongo notification도 같이 삭제
          //TODO: 이 유저가 만든 게더링이 모두 삭제되기 때문에 삭제 알림 이벤트 추가
          await dropUser(userId, req);
          //s3탈퇴한 유저의 image 삭제
          deleteImageinTable(image);
          delete guestTable[userId];
          const gatheringIds = await getGatheringIdsByUser(userId);
          await userInfo.destroy();
          await ModifyTheCurrentNumOfGathering(gatheringIds);

          //회원정보가 삭제된 후에 관련된 모임들 인원수 다시 체크
        }, 7200000);
      }
      return res.status(200).json({ id, image, nickname });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  signout: (req, res) => {
    clearCookie(res);
    //TODO: socket disconnect 이벤트를 발생시켜야함 서버는 연결할때만 토큰검사를 하기 때문에 로그아웃을 했어도 소켓에 연결되어 있을 수도 있음
    return res.status(200).json({ message: "Signed out" });
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
    const { id: userId, nickname } = guestUser.dataValues;
    //몽고디비 notifications 컬렉션에 아이디 추가
    noticeModel.signup(userId);

    guestTable[guestUUID] = setTimeout(async () => {
      //TODO: 해당 유저의 Mongo notification도 같이 삭제
      //TODO: 이 유저가 만든 게더링이 모두 삭제되기 때문에 삭제 알림 이벤트 추가
      await dropUser(userId, req);
      deleteImageinTable(userInfo.dataValues.image);
      delete guestTable[userId];
      const gatheringIds = await getGatheringIdsByUser(userId);
      await guestUser.destroy();
      await ModifyTheCurrentNumOfGathering(gatheringIds);
    }, 7200000);
    //TODO: Mongo notification 생성 + 초기 알림으로 환영메시지 등록

    // 게스트로그인에 nickname는 UUID 의 첫 번째, 이미지는 미설정시 null 이기 때문에 null을 추가로 넣어줌
    return res.status(200).json({ id, image: null, nickname });
  },
  googleSignin: async (req, res) => {
    const { authorizationCode } = req.body;
    const { googleClientId, googleClientSecret } = google;
    console.log("authorizationCode 변수", authorizationCode);
    try {
      const params = {
        grant_type: "authorization_code",
        client_id: googleClientId,
        client_secret: googleClientSecret,
        code: authorizationCode,
        redirect_uri: process.env.CLIENT_URL,
      };

      const axiosRes = await axios({
        method: "post",
        url: "https://oauth2.googleapis.com/token",
        params,
      });

      const { access_token: accessToken } = axiosRes.data;
      const profileRes = await axios({
        method: "get",
        url: "https://www.googleapis.com/oauth2/v2/userinfo",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { name: nickname, email, picture: image } = profileRes.data;
      const checkUserByEmail = await userFindOne({ email });
      // 가입은 이메일 인증을 통해서만 가입이 가능하기 때문에 따로 type을 신경쓰지 않아도 됨
      // 이메일이 있다면 그 유저로 로그인
      if (checkUserByEmail) {
        const { id, image, nickname, type } = checkUserByEmail;
        const token = generateAccessToken(id, type);
        setCookie(res, token);
        return res.status(200).json({ id, image, nickname });
      }
      // 이 이메일로 가입된 정보가 없다면 정보를 바탕으로 회원가입을 진행
      // 닉네임 중복체크 함수
      const notDuplicationNickname = await getUniqueNickname(nickname);
      const createdUserInfo = await createUser({
        id: uuid(),
        email,
        image,
        nickname: notDuplicationNickname,
        authStatus: 1,
        type: "google",
      });
      const { id, type } = createdUserInfo.dataValues;
      const token = generateAccessToken(id, type);
      setCookie(res, token);
      //Mongo notification 생성 + 초기 알림으로 환영메시지 등록
      noticeModel.signup(id);

      return res.status(201).json({ id, nickname: notDuplicationNickname, image });
    } catch (err) {
      return res.status(400).json({ message: "Error occured during social login" });
    }
  },
  kakaoSignin: async (req, res) => {
    const { kakaoClientId, kakaoClientSecret } = kakao;
    const { authorizationCode } = req.body;
    try {
      const tokenResponse = await axios({
        method: "POST",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          grant_type: "authorization_code",
          client_id: kakaoClientId,
          client_secret: kakaoClientSecret,
          code: authorizationCode,
        },
      });
      const { access_token: accessToken } = tokenResponse.data;
      const kakaoUserInfo = await axios({
        method: "GET",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const {
        profile: { profile_image_url: image, nickname },
        email,
      } = kakaoUserInfo.data.kakao_account;
      const checkUserByEmail = await userFindOne({ email });
      // 가입은 이메일 인증을 통해서만 가입이 가능하기 때문에 따로 type을 신경쓰지 않아도 됨
      // 이메일이 있다면 그 유저로 로그인
      if (checkUserByEmail) {
        const { id, image, nickname, type } = checkUserByEmail;
        const token = generateAccessToken(id, type);
        setCookie(res, token);
        return res.status(200).json({ id, image, nickname });
      }
      // 이 이메일로 가입된 정보가 없다면 정보를 바탕으로 회원가입을 진행
      // 닉네임 중복체크 함수
      const notDuplicationNickname = await getUniqueNickname(nickname);
      const createdUserInfo = await createUser({
        id: uuid(),
        email,
        nickname: notDuplicationNickname,
        image,
        authStatus: 1,
        type: "kakao",
      });
      const { id, type } = createdUserInfo.dataValues;
      const token = generateAccessToken(id, type);
      setCookie(res, token);
      //Mongo notification 생성 + 초기 알림으로 환영메시지 등록
      noticeModel.signup(id);

      return res.status(201).json({ id, nickname: notDuplicationNickname, image });
    } catch (err) {
      return res.status(400).json({ message: "Error occured during social login" });
    }
  },
};
