const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../schema/user.schema");
const { check, validationResult } = require("express-validator");

router.get("/", (req, res) => {
  res.send("welcome to login up");
});

router.post(
  "/",
  [check("email", "Invalid email").isEmail()],
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(email);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      User.findOne({ email })
        .then(async (user) => {
          if (!user) {
            return res.status(200).json({
              error: "User email is not registered here",
              code: 111,
            });
          } else {
            try {
              // compare hashed password with user password
              let passwordMatch = await bcrypt.compare(password, user.password);
              console.log(passwordMatch);
              if (passwordMatch) {
                // generate accesToken for user
                const accessToken = await JWT.sign(
                  { email },
                  "YUMUSTYUNGWEATHERAPPSALT",
                  { expiresIn: "10s" }
                );
                // generate refresh token for user
                const refreshToken = await JWT.sign(
                  { email },
                  "YUMUSTYUNGWEATHERAPPREFRESHTOKENSALT",
                  { expiresIn: "24h" }
                );
                res.status(201).json({
                  message: "User created!",
                  user,
                  accessToken,
                  refreshToken,
                });
              } else {
                res.status(404).json({
                  message: "User password is incorrect",
                  code: 113,
                });
              }
            } catch (error) {
              console.log("error", error);
            }
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
