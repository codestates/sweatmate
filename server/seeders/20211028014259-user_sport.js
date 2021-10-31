module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "user_sport",
      [
        {
          id: 1,
          userId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          sportId: 1,
          skill: 1,
        },
        {
          id: 2,
          userId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          sportId: 2,
          skill: 2,
        },
        {
          id: 3,
          userId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          sportId: 3,
          skill: 3,
        },
        {
          id: 4,
          userId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          sportId: 4,
          skill: 4,
        },
        {
          id: 5,
          userId: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          sportId: 1,
          skill: 1,
        },
        {
          id: 6,
          userId: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          sportId: 2,
          skill: 2,
        },
        {
          id: 7,
          userId: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          sportId: 3,
          skill: 3,
        },
        {
          id: 8,
          userId: "59117a45-6b95-4c2e-a19e-ackie019rhfi",
          sportId: 4,
          skill: 4,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("user_sport", null, {});
  },
};
