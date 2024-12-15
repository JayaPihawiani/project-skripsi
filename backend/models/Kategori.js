import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const KategoriBrg = db.define(
  "kategoriBrg",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  { freezeTableName: true }
);

export default KategoriBrg;
