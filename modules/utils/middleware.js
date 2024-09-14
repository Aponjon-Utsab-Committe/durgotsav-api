const jwt = require("jsonwebtoken");
const db = require("../../db");

module.exports.verifyToken = async (req, res, next) => {
  console.log(req.headers);
  const token = req.headers["x-access-token"];

  if (!token) {
    console.log("Token not found");
    return res.status(400).send({
      message: "Token is not provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const [row] = await db("users").where("id", decoded.id);

    if (!row) {
      console.log("Invalid token");
      return res.status(400).send({
        message: "The token you provided is invalid",
      });
    }

    req.user = {
      ...row,
      doj: new Date(row.created_at),
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send(error);
  }
};
