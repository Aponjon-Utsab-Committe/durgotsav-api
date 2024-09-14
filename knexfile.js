module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "auc",
      user: "postgres",
      password: "admin",
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: "na",
      database: "auc",
      user: "postgres",
      password: "3",
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
