import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const db = new Sequelize(
  process.env.DB,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    timezone: "+07:00",
  }
);

export default db;
