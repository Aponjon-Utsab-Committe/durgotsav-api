exports.up = async function (knex) {
  await Promise.all([
    knex.schema.createTable("activities", (table) => {
      table.increments();
      table.integer("event_id").references("id").inTable("events");
      table.string("name").notNullable().unique();
      table.text("description").notNullable();
      table.integer("order").notNullable();
      table.timestamp("from").notNullable();
      table.timestamp("to").notNullable();
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = async function (knex) {
  await Promise.all([knex.schema.dropTable("activities")]);
};
