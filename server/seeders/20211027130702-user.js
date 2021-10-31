//비밀번호 1111
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "user",
      [
        {
          id: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          email: "wjdrlfgg@naver.com",
          areaId: 1,
          password: "$2b$12$DX3oLVJY2DiP8.LlYwAgheTPhWc.BmUrUAuUD92Ua9O2Yd7ajCH.O",
          age: 27,
          gender: "남",
          nickname: "muyaho",
          image: "https://sweatmate.s3.ap-northeast-2.amazonaws.com/1635326740228.png",
          type: "local",
          authKey: null,
          authStatus: 1,
        },
        {
          id: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          email: "local@local.com",
          areaId: 3,
          password: "$2b$12$DX3oLVJY2DiP8.LlYwAgheTPhWc.BmUrUAuUD92Ua9O2Yd7ajCH.O",
          age: 23,
          gender: "남",
          nickname: "bear",
          image: "https://sweatmate.s3.ap-northeast-2.amazonaws.com/1635326740228.png",
          type: "local",
          authKey: null,
          authStatus: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("user", null, {});
  },
};
