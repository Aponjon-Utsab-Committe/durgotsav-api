exports.up = async function (knex) {
  await Promise.all([
    knex.schema.createTable("events", (table) => {
      table.increments();
      table.string("name").notNullable().unique();
      table.text("venue").notNullable();
      table.timestamp("from").notNullable();
      table.timestamp("to").notNullable();
      table.enu("status", ["ACTIVE", "CANCELLED"]).defaultTo("ACTIVE");
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = async function (knex) {
  await Promise.all([knex.schema.dropTable("events")]);
};
