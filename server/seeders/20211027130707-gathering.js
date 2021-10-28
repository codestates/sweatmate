module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "gathering",
      [
        {
          id: 1,
          sportId: 1,
          areaId: 1,
          placeName: "한강공원",
          latitude: 11.11111,
          longitude: 22.2222,
          date: "2021-11-25",
          time: "오후",
          timeDescription: "13~16시",
          totalNum: 4,
          currentNum: 2,
          title: "축구해요!",
          description: "한강공원에서 축구하실분~",
          creatorId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          done: 0,
        },
        {
          id: 2,
          sportId: 2,
          areaId: 2,
          placeName: "초등학교 운동장",
          latitude: 11.11111,
          longitude: 22.2222,
          date: "2021-11-24",
          time: "오전",
          timeDescription: "03~06시",
          totalNum: 4,
          currentNum: 2,
          title: "농구해요!",
          description: "초등학교 운동서에서 농구하실분~",
          creatorId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          done: 0,
        },
        {
          id: 3,
          sportId: 3,
          areaId: 3,
          placeName: "잠실야구장",
          latitude: 11.11111,
          longitude: 22.2222,
          date: "2021-11-23",
          time: "오후",
          timeDescription: "12~19시",
          totalNum: 4,
          currentNum: 2,
          title: "야구해요!",
          description: "잠실야구장에서 야구하실분~",
          creatorId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          done: 0,
        },
        {
          id: 4,
          sportId: 4,
          areaId: 4,
          placeName: "한강테니스장",
          latitude: 11.11111,
          longitude: 22.2222,
          date: "2021-11-22",
          time: "오후",
          timeDescription: "13~16시",
          totalNum: 4,
          currentNum: 2,
          title: "테니스해요!",
          description: "한강테니스장에서 테니스하실분~",
          creatorId: "59117a45-6b95-4c2e-a19e-accb9b267f9c",
          done: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("gathering", null, {});
  },
};
