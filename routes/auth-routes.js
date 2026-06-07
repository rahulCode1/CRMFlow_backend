const express = require("express");
const router = express.Router();
const {
  googleOAuth,
  authCallBack,
  verifyUser,
} = require("../controllers/auth-controller");

router.get("/auth/google", googleOAuth);
router.get("/auth/google/callback", authCallBack);
router.get("/user/me", verifyUser);


module.exports = router;
