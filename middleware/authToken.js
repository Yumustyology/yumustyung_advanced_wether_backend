const JWT = require("jsonwebtoken");

const authToken = async (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log("token ",token);
  if (!token) {
    res.status(401).json({
      error: [
        {
          message: "token not found",
        },
      ],
    });
  } else {
    try {
      const user = await JWT.verify(token, "YUMUSTYUNGWEATHERAPPSALT");
      res.user = user.email;
      next();
    } catch (error) {
      res.status(403).json({
        error: [
          {
            message: "Invalid token",
          },
        ],
      });
    }
  }
};

module.exports = authToken;
