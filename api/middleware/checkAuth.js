const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ msg: "No token provided!" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = verify;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token!" });
  }
};
