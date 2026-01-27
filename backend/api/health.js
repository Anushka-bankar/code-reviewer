module.exports = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Direct Render function works"
  });
};
