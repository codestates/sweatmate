module.exports = {
  DBERROR: (res, err) => {
    res.status(500).json({ message: `Error occured in database: ${err}` });
  },
};
