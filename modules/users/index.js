const router = require("express").Router();
const db = require("../../db");
const helper = require("../utils/authHelper");

/**
 * User Registration
 */
router.post("/registration", async (req, res) => {
  try {
    if (!helper.isValidEmail(req.body.email)) {
      return res.status(500).send({
        message: "Please enter a valid email address",
      });
    }

    if (req.body.password.trim().length < 8) {
      return res.status(500).send({
        message: "Minimum 8 characters required in password.",
      });
    }

    let users = await db("users").where({ phone: req.body.phone.trim() });

    if (users.length > 0) {
      return res.status(500).send({
        message: "User with same phone no already exists",
      });
    }

    const password = helper.hashPassword(req.body.password);

    await db("users").insert({
      email: req.body.email,
      password: password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      org_name: process.env.ORG,
      phone: req.body.phone,
      building: req.body.building,
      flat_number: req.body.flat_number,
      role: req.body.role,
      status: "VERIFIED",
    });

    return res.status(201).send({
      message: "Registration successful.",
    });
  } catch (e) {
    console.log("err:", e);
    return res.status(500).send({
      error: e,
      message: "Internal Server Error",
    });
  }
});

/**
 * User signin
 */
router.post("/signin", async (req, res) => {
  return "User Signin";
});

module.exports = router;
