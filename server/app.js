const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const { sequelize } = require("./models");
const config = require("./config");

const app = express();

app.use(helmet());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Let's Sweatmate!");
});

app.listen(config.port, async () => {
  console.log(`🚀 Listening on PORT: ${config.port}`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
