const router = require("express").Router();
const db = require("../../db");
const middleware = require("../utils/middleware");

/**
 * Create event
 */
router.post("/", middleware.verifyToken, async (req, res) => {
  console.log("POST /events");
  try {
    const [row] = await db("events").where({ name: req.body.name.trim() });

    if (row) {
      return res.status(500).send({
        message: "Event alredy exists",
      });
    }

    await db("events").insert({
      ...req.body,
    });

    return res.status(201).send({
      message: "Event successfully created",
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
 * Get events
 */
router.get("/", async (req, res) => {
  console.log("GET /events");
  try {
    const limit = req.query.page_size || 10;
    const index = req.query.page_no || 1;
    const offset = (index - 1) * limit;

    let query = db("events");
    if (req.query.status) {
      query = query.where({ status: req.query.status });
    }

    const [{ count: total }] = await query.clone().count();
    const list = await query.limit(limit).offset(offset);

    return res.status(200).send({
      list,
      page_no: index,
      page_size: limit,
      total,
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
 * Get event by id
 */
router.get("/:id", async (req, res) => {
  console.log(`GET /events/${req.query.id}`);
  try {
    const [row] = await db("events").where({ id: req.params.id });

    if (!row) {
      return res.status(404).send({
        message: "Event not found",
      });
    }

    return res.status(200).send(row);
  } catch (e) {
    console.log("err:", e);
    return res.status(500).send({
      error: e,
      message: "Internal Server Error",
    });
  }
});

/**
 * Get event by id
 */
router.put("/:id", middleware.verifyToken, async (req, res) => {
  console.log(`PUT /events/${req.query.id}`);
  try {
    const [row] = await db("events")
      .where({ name: req.body.name.trim() })
      .whereNot({ id: req.params.id });

    if (row) {
      return res.status(500).send({
        message: "Another event with same event name already exists",
      });
    }

    delete req.body.id;
    delete req.body.created_at;
    delete req.body.updated_at;

    await db("events")
      .update({
        ...req.body,
      })
      .where({ id: req.params.id });

    return res.status(200).send({
      message: "Event successfully updated",
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
