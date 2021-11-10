//비밀번호 "qwe123"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "user",
      [
        {
          id: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          email: "wjdrlfgg@naver.com",
          areaId: 1,
          password: "$2b$12$9PYxnIgGVxjyDGKqDH1o6ONxj7onOnZqK3HIgX6TKfvaB4.USUU2.",
          age: 27,
          gender: "남",
          nickname: "muyaho",
          image: null,
          type: "local",
          authKey: null,
          authStatus: 1,
        },
        {
          id: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          email: "local@local.com",
          areaId: 3,
          password: "$2b$12$9PYxnIgGVxjyDGKqDH1o6ONxj7onOnZqK3HIgX6TKfvaB4.USUU2.",
          age: 23,
          gender: "남",
          nickname: "bear",
          image: null,
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
