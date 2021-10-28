const { User, Gathering, Sport, User_sport, User_gathering } = require("../../models");

module.exports = {
  userFindOne: async (queries, attributes = []) => {
    return await User.findOne({
      where: { ...queries },
      attributes: { exclude: [...attributes] },
    });
  },
  createUser: (queries) => {
    return User.create(object);
  },
  findSportsOfUser: async (queries, attributes = []) => {
    return await User_sport.findAll({
      where: { ...queries },
      attributes: { exclude: [...attributes] },
    });
  },
  findGatheringOfUser: async (queries, attributes = []) => {
    return await User_gathering.findAll({
      where: { ...queries },
      attributes: { exclude: [...attributes] },
    });
  },
  modifyUserSportList: async (queries, sportList) => {
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
      attributes: { exclude: ["creatorId", "createdAt"] }, //TODO: 생성일자는 필요없는지 상의
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
};
