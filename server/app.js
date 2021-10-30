const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");
const config = require("./config");
const mongooseConnect = require("./schemas");
const SocketIO = require("./socket");
const {
  port,
  cors: { allowedOrigin },
} = require("./config");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./sweatmate.yaml");

const authRouter = require("./router/auth");
const userRouter = require("./router/user");
const gatheringRouter = require("./router/gathering");
const notificationRouter = require("./router/notification");
const chatRouter = require("./router/chat");

const app = express();

const corsOption = { origin: allowedOrigin, optionsSuccessStatus: 200, credentials: true };
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors(corsOption));
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Let's Sweatmate!");
});
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/gathering", gatheringRouter);
app.use("/chat", notificationRouter);
app.use("/notification", chatRouter);

app.use((req, res) => {
  res.status(400).json({ message: "Invalid request" });
});
app.use((err, req, res, next) => {
  res.status(500).json({ message: `Something went wrong: ${err}` });
});

const sweatmateServer = app.listen(config.port, async () => {
  console.log(`🚀 Listening on PORT: ${config.port}`);
  mongooseConnect();
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

SocketIO(sweatmateServer, app);
