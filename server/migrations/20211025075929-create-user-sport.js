"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_sport", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
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
      sportId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "sport",
            schema: "",
          },
          key: "id",
        },
        allowNull: false,
      },
      skill: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_sport");
  },
};
