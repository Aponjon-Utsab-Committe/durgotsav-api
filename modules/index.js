const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/events", require("./events"));
router.use("/coupons", require("./coupons"));

module.exports = router;
