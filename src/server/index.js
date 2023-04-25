const express = require("express");
const os = require("os");
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const TOKEN = "my_auth_token";

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const authMiddleware = async (req, res, next) => {
  const token = req.cookies["auth_token"];
  if (token !== TOKEN)
    res.status(401).json({ success: false, message: "user not authenticated" });

  return next();
};

app.get("/api/getUsername", (req, res) =>
  res.send({ username: os.userInfo().username })
);

app.get("/api/checkAuth", authMiddleware, (req, res) =>
  res.status(200).json({ success: true, message: "User authenticated" })
);

app.post("/api/login", (req, res) => {
  const { username } = req.body;
  res.cookie("auth_token", TOKEN, { httpOnly: true });
  res.status(200).json({
    success: true,
    message: `${username} logged in`,
  });
});
app.post("/api/logout", (req, res) => {
  const { username } = req.body;
  res.cookie("auth_token", "", { httpOnly: true });
  res.status(200).json({
    success: true,
    message: `${username} logged out`,
  });
});

app.use("/frontend", express.static("dist"));

app.use("/static",authMiddleware, express.static("src/staticpages/index.html"));


app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
