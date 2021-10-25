module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "sport",
      [
        {
          id: 1,
          sportEmoji: "⚽",
          sportName: "soccer",
        },
        {
          id: 2,
          sportEmoji: "🏀",
          sportName: "basketball",
        },
        {
          id: 3,
          sportEmoji: "⚾",
          sportName: "baseball",
        },
        {
          id: 4,
          sportEmoji: "🎾",
          sportName: "tennis",
        },
        {
          id: 5,
          sportEmoji: "🎱",
          sportName: "pool",
        },
        {
          id: 6,
          sportEmoji: "🎳",
          sportName: "bowling",
        },
        {
          id: 7,
          sportEmoji: "🏐",
          sportName: "volleyball",
        },
        {
          id: 8,
          sportEmoji: "🏓",
          sportName: "Ping-Pong",
        },
        {
          id: 9,
          sportEmoji: "🏸",
          sportName: "badminton",
        },
        {
          id: 10,
          sportEmoji: "⛳",
          sportName: "golf",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("sport", null, {});
  },
};
