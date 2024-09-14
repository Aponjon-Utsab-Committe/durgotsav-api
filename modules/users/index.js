const router = require("express").Router();

/**
 * User Registration
 */
router.post("/registration", async (req, res) => {
    return "User Registration";
});

/**
 * User signin
 */
router.post("/signin", async (req, res) => {
    return "User Signin";
});

module.exports = router;
