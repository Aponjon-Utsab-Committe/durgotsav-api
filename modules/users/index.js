const router = require("express").Router();
const db = require("../../db");
const authHelper = require("../utils/authHelper");
const middleware = require("../utils/middleware");

/**
 * User Registration
 */
router.post("/registration", async (req, res) => {
  console.log("POST /users/registration");
  try {
    if (!authHelper.isValidEmail(req.body.email)) {
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

    const password = authHelper.hashPassword(req.body.password);

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
  console.log("POST /users/signin");
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Either email, password or both are missing",
      });
    }

    if (!authHelper.isValidEmail(req.body.email)) {
      return res.status(400).send({
        message: "Please enter a valid email address",
      });
    }

    const [row] = await db("users").where("email", req.body.email);

    if (!row) {
      return res.status(400).send({
        message: "The credentials you provided is incorrect",
      });
    }

    if (!authHelper.comparePassword(row.password, req.body.password)) {
      return res.status(400).send({
        message: "The credentials you provided is incorrect",
      });
    }

    const token = authHelper.generateToken(
      row.id,
      row.role,
      row.email,
      row.first_name,
      row.last_name,
      row.org_name,
      row.status,
      row.phone,
      row.building,
      row.flat_number
    );

    return res.status(200).send({
      token: token,
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
  console.log("POST /users/signin");
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Either email, password or both are missing",
      });
    }

    if (!authHelper.isValidEmail(req.body.email)) {
      return res.status(400).send({
        message: "Please enter a valid email address",
      });
    }

    const [row] = await db("users").where("email", req.body.email);

    if (!row) {
      return res.status(400).send({
        message: "The credentials you provided is incorrect",
      });
    }

    if (!authHelper.comparePassword(row.password, req.body.password)) {
      return res.status(400).send({
        message: "The credentials you provided is incorrect",
      });
    }

    const token = authHelper.generateToken(
      row.id,
      row.role,
      row.email,
      row.first_name,
      row.last_name,
      row.org_name,
      row.status,
      row.phone,
      row.building,
      row.flat_number
    );

    return res.status(200).send({
      token: token,
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
 * Change password
 */
router.put("/change_password", middleware.verifyToken, async (req, res) => {
  try {
    const [row] = await db("users").where("id", req.user.id);

    if (req.body.old_password === req.body.new_password) {
      return res.status(400).send({
        message: "New password cannot be same as old password",
      });
    }

    if (!authHelper.comparePassword(row.password, req.body.old_password)) {
      return res.status(400).send({
        message: "The credentials you provided is incorrect",
      });
    }

    const password = authHelper.hashPassword(req.body.new_password);

    await db("users")
      .update({
        password: password,
      })
      .where("id", req.user.id);

    return res.status(200).send({
      message: "Password changed successfully",
    });
  } catch (e) {
    console.log("err:", e);
    return res.status(500).send({
      error: e,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
