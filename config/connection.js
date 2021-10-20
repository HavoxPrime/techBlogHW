const Sequelize = require("sequelize");
require("dotenv").config();

const port = process.env.PORT || 3306;

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: "localhost",
        dialect: "mysql",
        port: port,
      }
    );

module.exports = sequelize;
