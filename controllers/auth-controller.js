const HttpError = require("../models/http-error");
const axios = require("axios");
const Auth = require("../models/auth-model");
const jwt = require("jsonwebtoken");

const googleOAuth = async (req, res, next) => {
  try {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.BACKEND_URI}/auth/google/callback&response_type=code&scope=profile email`;
    res.redirect(googleAuthUrl);
  } catch (err) {
    next(err);
  }
};

const authCallBack = async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return next(new HttpError("Authorization code not provided.", 404));
  }

  try {
    let accessToken;

    const tokenResponse = await axios.post(
      `https://oauth2.googleapis.com/token`,
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.BACKEND_URI}/auth/google/callback`,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    accessToken = tokenResponse.data.access_token;

    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const googleUser = userInfo.data;

    let user = await Auth.findOne({ email: googleUser.email });

    if (!user) {
      user = new Auth({
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
      });

      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/v1/profile/google?token=${token}`,
    );
  } catch (err) {
    next(err);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new HttpError("Token not found.", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    res.json({
      success: true,
      token,
      user: decoded,
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  googleOAuth,
  authCallBack,
  verifyUser
};
