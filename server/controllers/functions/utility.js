const AWS = require("aws-sdk");
AWS.config.loadFromPath("./awsconfig.json");
const s3 = new AWS.S3();

module.exports = {
  DBERROR: (res, err) => {
    res.status(500).json({ message: `Error occured in database: ${err}` });
  },
  deleteImageinTable: (image) => {
    const imageKey = /[\d]{13}\.[\w]+/.exec(image)[0];
    if (!imageKey) return;
    const params = {
      Bucket: "sweatmate",
      Key: imageKey,
    };
    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log();
    });
  },
};
