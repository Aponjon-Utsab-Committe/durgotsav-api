require("dotenv").config();
const http = require("http");
const https = require("https");
const fs = require("fs");
const app = require("express")();
const bodyParser = require("body-parser");
const modules = require("./modules");
const cors = require("cors");
const _ = require("lodash");

const privateKey = fs.readFileSync("certs/ca.key");
const certificate = fs.readFileSync("certs/ca.pem");

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

/* ===== For Local ====*/
app.listen(process.env.PORT || 3000, () => {
  console.log("Express server started at " + (process.env.PORT || 3000));
});
/* ====================*/

/* ===== For Self Signed Certifcate in Local ====*/
// Listen both http & https ports
// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(
//   {
//     key: privateKey,
//     cert: certificate,
//   },
//   app
// );

// httpServer.listen(80, () => {
//   console.log("HTTP Server running on port 80");
// });

// httpsServer.listen(443, () => {
//   console.log("HTTPS Server running on port 443");
// });
/* ==============================================*/

module.exports = app;
