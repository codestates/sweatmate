module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "user_gathering",
      [
        {
          id: 1,
          userId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          gatheringId: 1,
        },
        {
          id: 2,
          userId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          gatheringId: 2,
        },
        {
          id: 3,
          userId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          gatheringId: 3,
        },
        {
          id: 4,
          userId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          gatheringId: 4,
        },
        {
          id: 5,
          userId: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          gatheringId: 1,
        },
        {
          id: 6,
          userId: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          gatheringId: 2,
        },
        {
          id: 7,
          userId: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          gatheringId: 3,
        },
        {
          id: 8,
          userId: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          gatheringId: 4,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("user_gathering", null, {});
  },
};
