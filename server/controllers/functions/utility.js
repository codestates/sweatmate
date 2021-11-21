const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const mongoose = require("mongoose");
const chatModel = require("../../schemas/chat");
const noticeModel = require("../../schemas/notification");
const { getGatheringIdsOfUser } = require("./sequelize");
const areaList = require("../../resource/areaList");
const sportsList = require("../../resource/sportList");
const areaListById = require("../../resource/areaListById");
const sportListById = require("../../resource/sportListById");
module.exports = {
  DBERROR: (res, err) => {
    return res.status(500).json({ message: `Error occured in database: ${err}` });
  },
  deleteImageinTable: (image) => {
    const imageKey = /[\d]{13}\.[\w]+/.exec(image)?.[0];
    if (!imageKey) return;
    const params = {
      Bucket: "sweatmate",
      Key: imageKey,
    };
    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log();
    });
  },
  createValidObject: (queries) => {
    return Object.keys(queries)
      .filter((el) => queries[el])
      .reduce((acc, cur) => {
        return { ...acc, [cur]: queries[cur] };
      }, {});
  },
  TranslateFromSportNameToSportInfo: (sportName) => {
    return sportsList.filter((el) => el.sportName === sportName)[0];
  },
  TranslateFromAreaNameToAreaInfo: (areaName) => {
    return areaList.filter((el) => el.areaName === areaName)[0];
  },
  getCurrentTime: function timestamp() {
    const today = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString().replace("T", " ").substring(0, 16);
  },
  modifyGatheringFormat: (gatheringList) => {
    // gatheringList.push(1);
    // let temporary = [];
    // const sortedGatheringList = gatheringList.reduce((acc, cur) => {
    //   if (temporary[0]?.date !== cur?.date && temporary.length && cur !== 1) {
    //     acc.push(...temporary);
    //     temporary = [];
    //   }
    //   if (cur === 1) {
    //     if (!temporary.length) {
    //       return acc;
    //     }
    //     acc.push(...temporary);
    //     return acc;
    //   }
    //   if (cur?.currentNum >= cur?.totalNum) {
    //     temporary.push(cur);
    //     return acc;
    //   }
    //   acc.push(cur);
    //   return acc;
    // }, []);
    const sortedGatheringList = gatheringList
      .reduce(
        (acc, cur) => {
          if (cur.currentNum >= cur.totalNum) {
            acc[1].push(cur);
            return acc;
          }
          acc[0].push(cur);
          return acc;
        },
        [[], []]
      )
      .flat();
    return sortedGatheringList.map((el) => {
      el.areaName = areaListById[el.areaId];
      delete el.areaId;
      const { sportName, sportEmoji, sportEngName } = sportListById[el.sportId];
      delete el.sportId;
      el.sportName = sportName;
      el.sportEmoji = sportEmoji;
      el.sportEngName = sportEngName;
      return el;
    });
  },
  dropUser: async (userId, req) => {
    //유저의 몽고디비 도큐멘트 삭제
    await noticeModel.removeUser(userId);
    await chatModel.removeChatOfUser(userId);

    const gatheringIdAndTitles = await getGatheringIdsOfUser(userId);
    const realTime = req.app.get("realTime");
    const main = req.app.get("main");
    const chat = req.app.get("chat");
    const _id = mongoose.Types.ObjectId();
    gatheringIdAndTitles.forEach((el) => {
      const { id, title } = el;
      if (!realTime[id]) return;
      const noticeInfo = {
        id: _id,
        gatheringId: id,
        type: "remove",
        url: null,
        target: null,
        title: title,
        message: `모임을 만든 유저가 회원탈퇴하여 모임이 삭제되었습니다`,
      };
      const userIds = Object.keys(realTime[id]);
      noticeModel.createNotice(userIds, noticeInfo);
      // 참여중인 (채팅 안밖유저에게 전부 알림이 가야함)
      main.to(id).emit("notice", noticeInfo);
      chat.to(id).emit("notice", noticeInfo);
      //참여중인 유저가 있다면 방에서 나가게 함
      chat.in(id).disconnectSockets();
      delete realTime[id];
    });
  },
  getYesterdayDate: function () {
    const today = new Date();
    today.setHours(today.getHours() + 9);
    today.setDate(today.getDate() - 1);
    return today.toISOString().replace("T", " ").substring(0, 10);
  },
  getTomorrowDate: function () {
    const today = new Date();
    today.setHours(today.getHours() + 9);
    today.setDate(today.getDate() + 1);
    return today.toISOString().replace("T", " ").substring(0, 10);
  },
};
