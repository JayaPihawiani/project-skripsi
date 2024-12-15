import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Lokasi = db.define(
  "lokasi",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
  },
  { freezeTableName: true }
);

export default Lokasi;
