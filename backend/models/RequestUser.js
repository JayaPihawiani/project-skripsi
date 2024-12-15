import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const RequestBrg = db.define(
  "requestBrg",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    userId: DataTypes.UUID,
    file: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  { freezeTableName: true }
);

export default RequestBrg;
