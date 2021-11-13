/*
  스케줄러 구성요소, 매 24시간마다 모임일정이 지난 게더링들 done = 1 + 종료 이벤트 notification 알림 
  게스트의 createdAt이 24시간이 지난 유저에 대해서 삭제 + 유저의 참여중인 게더링 currentNum - 1 + s3 이미지 삭제
  이메일 인증이 1시간이 지난 유저 삭제
  모임 07, 12, 17 시마다 모임 시작 알림 보내기
*/
const schedule = require("node-schedule");
const mongoose = require("mongoose");
const noticeModel = require("./schemas/notification");
const {
  getYesterdayDate,
  getTomorrowDate,
  dropUser,
  deleteImageinTable,
  getCurrentTime,
} = require("./controllers/functions/utility");
const { finishGatherings } = require("./controllers/functions/sequelize");
const { User, Gathering } = require("./models");
const { Op } = require("sequelize");

module.exports = (app) => {
  const realTime = app.get("realTime");
  const main = app.get("main");
  const chat = app.get("chat");

  schedule.scheduleJob("0 0 0 * * *", async function () {
    const gatheringIdAndTitles = await finishGatherings(getYesterdayDate());
    const _id = mongoose.Types.ObjectId();
    gatheringIdAndTitles.forEach((el) => {
      const { id, title } = el;
      const noticeInfo = {
        id: _id,
        gatheringId: id,
        type: "done",
        url: null,
        target: null,
        title: title,
        message: `모임이 종료되었습니다`,
      };
      const userIds = Object.keys(realTime[id]);
      noticeModel.createNotice(userIds, noticeInfo);
      main.to(id).emit("notice", noticeInfo);
      chat.to(id).emit("notice", noticeInfo);
      chat.sockets.clients(id).forEach(function (s) {
        s.leave(id);
      });
      delete realTime[id];
    });
  });
  schedule.scheduleJob("0 0,30 * * * *", async function () {
    const date = new Date();
    date.setHours(date.getHours() - 15);
    const unidentifiedUsers = await User.findAll({
      where: { type: "local", authStatus: 0, createdAt: { [Op.lte]: date } },
      attributes: ["id"],
    });
    unidentifiedUsers.forEach((el) => {
      el.destroy();
    });
    // 게스트 유저 정보 삭제
    date.setHours(date.getHours() + 12);
    const guestUsers = await User.findAll({
      where: { type: "guest", createdAt: { [Op.lte]: date } },
      attributes: ["id", "image"],
    });
    guestUsers.forEach((el) => {
      const { id, image } = el.dataValues;
      dropUser(id, { app });
      deleteImageinTable(image);
      el.destroy();
    });
  });

  schedule.scheduleJob("0 0 7,12,17 * * *", async function () {
    const curruntDate = getCurrentTime();
    const curruntHour = new Date(curruntDate).getHours;
    const curruntDay = curruntDate.split(" ")[0];
    let time;

    switch (curruntHour) {
      case "7":
        time = "오전";
        break;
      case "12":
        time = "오후";
        break;
      case "17":
        tiem = "저녁";
        break;
      default:
        return;
    }

    const _id = mongoose.Types.ObjectId();

    const theDayGatherings = await Gathering.findAll({
      where: { time: time, date: curruntDay },
      attributes: ["id", "title"],
    });
    theDayGatherings.forEach((el) => {
      const { id, title } = el.dataValues;
      const noticeInfo = {
        id: _id,
        gatheringId: id,
        type: "notice",
        url: `/chat/${id}`,
        target: null,
        title: title,
        message: `오늘 모임이 ${time}에 시작돼요!`,
      };
      const userIds = Object.keys(realTime[id]);
      noticeModel.createNotice(userIds, noticeInfo);
      main.to(id).emit("notice", noticeInfo);
      chat.to(id).emit("notice", noticeInfo);
    });

    if (time === "오후") {
      const tomorrowGatherings = await Gathering.findAll({
        where: { date: getTomorrowDate() },
        attributes: ["id", "title"],
      });
      tomorrowGatherings.forEach((el) => {
        const { id, title } = el.dataValues;
        const noticeInfo = {
          id: _id,
          gatheringId: id,
          type: "notice",
          url: `/chat/${id}`,
          target: null,
          title: title,
          message: `내일 모임이 시작돼요!`,
        };
        const userIds = Object.keys(realTime[id]);
        noticeModel.createNotice(userIds, noticeInfo);
        main.to(id).emit("notice", noticeInfo);
        chat.to(id).emit("notice", noticeInfo);
      });
    }
  });

  console.log("Schedule ON");
};
