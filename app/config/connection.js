// Set SQL Server
import { ConnectionPool } from "mssql";

// Set database wrapper
const makeDb = (config) => {
  const connection = ConnectionPool(config);
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.close).call(connection);
    },
  };
};

// Configure connection
const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: "localhost",
  database: "gt-12-employee-management-system",
  port: 1433,
  options: {
    encrypt: false,
  },
};

// Make connection
const connection = makeDb(config);

module.exports = connection;
