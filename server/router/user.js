const express = require("express");
const router = express.Router();
const { getUerInfo, removeUserInfo, modifyUserInfo } = require("../controllers/user");
const { isAuth, checkNickname } = require("../middlewares");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

aws.config.loadFromPath("./awsconfig.json");
const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "sweatmate",
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${Date.now()}.${extension}`);
    },
    ACL: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

router.get("/:userId", isAuth, getUerInfo);
router.put("/:userId", isAuth, upload.single("image"), modifyUserInfo);
router.delete("/:userId", isAuth, removeUserInfo);

module.exports = router;
