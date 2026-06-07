const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const authCheck = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new HttpError("Authorization header missing.", 401));
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new HttpError("Token not found.", 401));
    }

    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decodeToken.userId;

    

    next();
  } catch (error) {
    next(new HttpError("Authentication failed, Invalid or expired token", 401));
  }
};

module.exports = authCheck;
