const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../schema/user.schema");

router.get("/", (req, res) => {
  res.send("welcome to sign up");
});

router.post(
  "/",
  [
    check("email", "invalid email").isEmail(),
    check("password", "password length should be at least 6").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { email, password, country, fullname } = req.body;
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      User.findOne({ email })
        .then(async (user) => {
          if (!user) {
            let newUser = new User({
              fullname,
              email,
              country,
              password: hashedPassword,
            });
            try {
              newUser.save().then(async (data) => {
                // generate accesToken for user
                const accessToken = await JWT.sign(
                  { email },
                  process.env.ACCESS_TOKEN_SECRET,
                  { expiresIn: "10s" }
                );
                // generate refresh token for user
                const refreshToken = await JWT.sign(
                  { email },
                  process.env.REFRESH_TOKEN_SECRET,
                  { expiresIn: "24h" }
                );
                res.status(201).json({
                  message: "User created!",
                  data,
                  accessToken,
                  refreshToken
                });
              });
            } catch (error) {
              console.log("error", error);
            }
          } else {
            return res.status(200).json({
              error: "User is already exist",
              code:112
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    }
  }
);

module.exports = router;
