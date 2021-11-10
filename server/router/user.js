const express = require("express");
const router = express.Router();
const { getUerInfo, removeUserInfo, modifyUserInfo } = require("../controllers/user");
const { isAuth, checkPermission } = require("../middlewares");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

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
router.put("/:userId", isAuth, checkPermission, upload.single("image"), modifyUserInfo);
router.delete("/:userId", isAuth, checkPermission, removeUserInfo);

module.exports = router;
