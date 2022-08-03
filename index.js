const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const signup = require("./routes/signup.route");
const login = require("./routes/login.route");
const authToken = require("./middleware/authToken");
const refreshToken = require("./routes/refreshToken.route");
require("dotenv/config")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(
  process.env.DB_CONNECT_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("database connected")
);

app.use("/signup", signup);
app.use("/login", login);
app.use("/refreshToken", refreshToken);

app.get("/", (req, res) => {
  res.status(200).send({
    greetings: "welcome",
  });
});

app.get("/private", authToken, (req, res) => {
  res.status(200).send({
    greetings: "welcome to protected route",
  });
});

app.listen(process.env.PORT || 5000, () => console.log("user hit the server"));
