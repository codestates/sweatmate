const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const areaList = require("../../resource/areaList");
const sportsList = require("../../resource/sportList");
const areaListById = require("../../resource/areaListById");
const sportListById = require("../../resource/sportListById");
module.exports = {
  DBERROR: (res, err) => {
    return res.status(500).json({ message: `Error occured in database: ${err}` });
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
  TranslateFromSportNameToSportInfo: (sportName) => {
    return sportsList.filter((el) => el.sportName === sportName)[0];
  },
  TranslateFromAreaNameToAreaInfo: (areaName) => {
    return areaList.filter((el) => el.areaName === areaName)[0];
  },
  getCurrentTime: function timestamp() {
    const today = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString().replace("T", " ").substring(0, 19);
  },
  modifyGatheringFormat: (gatheringList) => {
    return gatheringList.map((el) => {
      el.areaName = areaListById[el.areaId];
      delete el.areaId;
      const { sportName, sportEmoji } = sportListById[el.sportId];
      delete el.sportId;
      el.sportName = sportName;
      el.sportEmoji = sportEmoji;
      return el;
    });
  },
};
