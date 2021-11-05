const { User, Gathering, Sport, User_sport, User_gathering } = require("../../models");

module.exports = {
  userFindOne: async (queries, attributes = []) => {
    return await User.findOne({
      where: { ...queries },
      attributes: { exclude: [...attributes] },
    });
  },
  createUser: (queries) => {
    return User.create(queries);
  },
  findSportsOfUser: async (queries, attributes = []) => {
    return await User_sport.findAll({
      where: { ...queries },
      attributes: { exclude: [...attributes] },
    });
  },
  findGatheringOfUser: async (queries, attributes = []) => {
    //모든 user_gathering을 찾습니다
    return await User_gathering.findAll({
      where: { ...queries },
      attributes: { exclude: [...attributes] },
    });
  },
  modifyUserSportList: async (queries, sportList) => {
    //유저의 스포츠목록을 통째로 변경합니다.
    await User_sport.destroy({ where: { ...queries } });
    await User_sport.bulkCreate(sportList);
  },
  findAllGathering: async (queries) => {
    const gatheringList = await Gathering.findAll({
      where: { ...queries },
      include: [
        { model: User, as: "creator", attributes: ["id", "nickname", "image"] },
        {
          model: User_gathering,
          include: { model: User, attributes: ["id", "nickname", "image"] },
          attributes: { exclude: ["userId", "gatheringId"] },
        },
      ],
      order: ["date"],
      attributes: { exclude: ["creatorId", "createdAt"] },
    });
    return Promise.all(
      gatheringList.map((element) => {
        const users = element.dataValues.User_gatherings.map((userInfo) => {
          return userInfo.User.dataValues;
        });
        delete element.dataValues.User_gatherings;
        return { ...element.dataValues, users };
      })
    );
  },
  createGathering: async (queries, userId) => {
    const createdGathering = await Gathering.create(queries);
    const gatheringId = createdGathering.dataValues.id;
    await User_gathering.create({ userId, gatheringId });
    return await module.exports.findAllGathering({ id: gatheringId });
  },
  gatheringFindOne: async (queries) => {
    return Gathering.findOne({ where: { ...queries } });
  },
  findOrCreateUser_gathering: async (queries) => {
    return User_gathering.findOrCreate({ where: queries });
  },
  User_gatheringFindOne: async (queries) => {
    return User_gathering.findOne({ where: queries });
  },
  getUniqueNickname: async (nick, num = 1) => {
    let tempNick = nick;
    const foundUserByNickname = await User.findOne({ where: { nickname: nick } });
    if (foundUserByNickname) {
      if (num !== 1) {
        [tempNick] = tempNick.split("_");
      }
      tempNick = `${tempNick}_${num}`;
      return getUniqueNickname(tempNick, num + 1);
    }
    return nick;
  },
  getVaildGatheringId: async (userId) => {
    const usersGatherings = await User_gathering.findAll({
      where: { userId },
      attributes: [],
      include: {
        model: Gathering,
        where: { done: 0 },
        attributes: ["id"],
      },
    });
    const gatheringIds = usersGatherings.map((el) => {
      return el.dataValues.Gathering.dataValues.id;
    });
    return gatheringIds;
  },
  decrementGatheringsOfUser: async (userId) => {
    // 회원탈퇴 전 유저가 참여중인 게더링에 현인원 - 1
    const User_gatheringlist = await User_gathering.findAll({
      where: { userId },
      include: { model: Gathering },
    });
    await Promise.all(
      User_gatheringlist.map(async (el) => await el.Gathering.decrement("currentNum", { by: 1 }))
    );
  },
  realTimeUserStatus: async () => {
    // 일정이 끝나지 않은 게더링과 그 게더링에 참여중인 유저 아이디들을 불러옴
    const gatheringList = await Gathering.findAll({
      where: { done: 0 },
      attributes: ["id"],
      include: {
        model: User_gathering,
        attributes: ["userId"],
      },
    });
    const result = {};
    gatheringList.forEach((gathering) => {
      const { id } = gathering.dataValues;
      result[id] = {};
      gathering.dataValues.User_gatherings.forEach((UG) => {
        const { userId } = UG.dataValues;
        result[id][userId] = 0;
      });
    });
    return result;
  },
};
