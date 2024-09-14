exports.up = async function (knex) {
    await Promise.all([
      knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("first_name").notNullable();
        table.string("last_name");
        table.string("org_name").notNullable();
        table.string("email").unique();
        table.string("password").notNullable();
        table.string("phone");
        table.string("building");
        table.string("flat_number");
        table.enu("role", ["ADMIN", "ORGANIZER"]);
        table.enu("status", ["UNVERIFIED", "VERIFIED"]).defaultTo("UNVERIFIED");
        table.timestamps(true, true);
      }),
    ]);
  };
  
  exports.down = async function (knex) {
    await Promise.all([knex.schema.dropTable("users")]);
  };
  