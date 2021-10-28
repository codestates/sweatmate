const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const areaList = require("../../resource/areaList");
const sportsList = require("../../resource/sportList");

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
  createValidObject: (queries) => {
    return Object.keys(queries)
      .filter((el) => queries[el])
      .reduce((acc, cur) => {
        return { ...acc, [cur]: queries[cur] };
      }, {});
  },
  creatRandomNumber: (startRange, endRange) => {
    return Math.floor(Math.random() * endRange + startRange);
  },
  TranslateFromSportNameToSportName: (sportName) => {
    return sportsList.filter((el) => el.sportName === sportName)[0]?.id;
  },
  TranslateFromAreaNameToAreaName: (areaName) => {
    return areaList.filter((el) => el.areaName === areaName)[0]?.id;
  },
};
