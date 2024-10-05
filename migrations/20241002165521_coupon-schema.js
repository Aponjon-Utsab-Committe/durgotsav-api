exports.up = async function (knex) {
  await Promise.all([
    knex.schema.createTable("coupons", (table) => {
      table.increments();
      table.integer("event_id").references("id").inTable("events");
      table.string("number").notNullable();
      table.string("owner").notNullable();
      table.integer("user_count").notNullable();
      table.enu("status", ["VALID", "INVALID"]);
      table.timestamps(true, true);
      table.unique(["event_id", "number"]);
    }),
    knex.schema.createTable("coupon_usage", (table) => {
      table.increments();
      table.integer("event_id").references("id").inTable("events");
      table.integer("activity_id").references("id").inTable("activities");
      table.integer("coupon_id").references("id").inTable("coupons");
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = async function (knex) {
  await Promise.all([
    knex.schema.dropTable("coupon_usage"),
    knex.schema.dropTable("coupons"),
  ]);
};
