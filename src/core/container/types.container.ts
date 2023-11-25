const TOKEN = {
  DataSource: {
    Postgres: Symbol.for('PostgresDataSource'),
  },
  Repositories: {
    User: Symbol.for('UserRepository'),
  },

  Services: {
    User: Symbol.for('UserService'),
  },
};

export default TOKEN;
