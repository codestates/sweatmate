module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("gathering", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      sportId: {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        references: {
          model: {
            tableName: "sport",
            schema: "",
          },
          key: "id",
        },
        allowNull: true,
      },
      areaId: {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        references: {
          model: {
            tableName: "area",
            schema: "",
          },
          key: "id",
        },
        allowNull: true,
      },
      placeName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DECIMAL(13, 10),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(13, 10),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timeDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currentNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      creatorId: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "user",
            schema: "",
          },
          key: "id",
        },
        allowNull: false,
      },
      done: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("gathering");
  },
};
