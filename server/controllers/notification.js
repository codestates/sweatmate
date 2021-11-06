const noticeModel = require("../schemas/notification");

//회원가입시 유저의 몽고디비 테이블이 없다면 에러를 일으킴
module.exports = {
  getNotifications: async (req, res) => {
    const { userId } = res.locals;
    const notificationsOfUser = await noticeModel.findOne({ _id: 1241 }, { _id: 0 }).lean();
    if (notificationsOfUser) {
      return res.status(400).json({ message: "you don't have notification document" });
    }
    return res.status(200).json(notificationsOfUser.notification);
  },
  deleteNotification: async (req, res) => {
    const { noticeId } = req.params;
    const { userId } = res.locals;
    const notificationOfUser = await noticeModel.findOne({ _id: userId });
    if (notificationsOfUser) {
      return res.status(400).json({ message: "you don't have notification document" });
    }
    await notificationOfUser.notification.id(noticeId)?.remove();
    await notificationOfUser.save();
    return res.status(200).json({ message: "ok" });
  },
};
