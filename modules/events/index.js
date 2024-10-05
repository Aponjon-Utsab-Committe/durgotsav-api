const _ = require("lodash");
const router = require("express").Router();
const db = require("../../db");
const middleware = require("../utils/middleware");

/**
 * Create event
 */
router.post("/", middleware.verifyToken, async (req, res) => {
  console.log("POST /events");
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).send({
        message: "Only ADMIN can create event",
      });
    }
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
    const list = await query
      .limit(limit)
      .offset(offset)
      .orderBy("updated_at", "desc");

    return res.status(200).send({
      list,
      page_no: index,
      page_size: limit,
      total: Number(total),
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
  console.log(`GET /events/${req.params.id}`);
  try {
    const [row] = await db("events").where({ id: req.params.id });

    if (!row) {
      return res.status(404).send({
        message: "Event not found",
      });
    }

    const activities = await db("activities").where({
      event_id: req.params.id,
    });

    return res.status(200).send({ ...row, activities });
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
  console.log(`PUT /events/${req.params.id}`);
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).send({
        message: "Only ADMIN can update event",
      });
    }

    const [existingEvent] = await db("events").where({ id: req.params.id });

    if (!existingEvent) {
      return res.status(404).send({
        message: "Event doesn't exist",
      });
    }

    if (req.body.name) {
      const [row] = await db("events")
        .where({ name: req.body.name.trim() })
        .whereNot({ id: req.params.id });

      if (row) {
        return res.status(500).send({
          message: "Another event with same event name already exists",
        });
      }
    }

    const payload = {
      ...existingEvent,
      ...req.body,
    };

    delete payload.id;
    delete payload.created_at;
    payload.updated_at = new Date();

    await db("events").update(payload).where({ id: req.params.id });

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

/**
 * Get event by id
 */
router.get("/:id/coupons", async (req, res) => {
  console.log(`GET /events/${req.params.id}/coupons`);
  try {
    let coupons = await db
      .select("coupons.*", "activities.id as activity_id", "activities.name")
      .count("coupon_usage")
      .from("events")
      .leftJoin("activities", "events.id", "activities.event_id")
      .leftJoin("coupons", "events.id", "coupons.event_id")
      .leftJoin("coupon_usage", "coupons.id", "coupon_usage.coupon_id")
      .groupBy("events.id", "activities.id", "coupons.id")
      .where("events.id", Number(req.params.id))
      .orderBy("coupons.id", "activities.id");

    if (!coupons) {
      return res.status(404).send({
        message: "Event doesn't exist",
      });
    }

    coupons = _.map(_.groupBy(coupons, "id"), (c) => {
      let coupon = _.pick(c[0], [
        "id",
        "event_id",
        "number",
        "owner",
        "user_count",
        "status",
        "created_at",
        "updated_at",
      ]);
      coupon.usgae = _.map(c, (a)=> {
        return {
          activity_id: a.activity_id,
          name: a.name,
          count: a.count
        }
      });
      console.log(coupon);
      return coupon;
    });

    return res.status(200).send(coupons);
  } catch (e) {
    console.log("err:", e);
    return res.status(500).send({
      error: e,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
