require("dotenv");
const app = require("express")();
const bodyParser = require("body-parser");
const modules = require("./modules");
const cors = require("cors");
const _ = require("lodash");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * Server Info
 */
app.get("", (req, res) => {
  return res.status(200).send("Aponjon Utsav Committe API");
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  return res.status(200).send("OK");
});

app.use("/api", modules);

app.listen(process.env.PORT || 3000, () => {
  console.log("Express server started at " + (process.env.PORT || 3000));
});

module.exports = app;
