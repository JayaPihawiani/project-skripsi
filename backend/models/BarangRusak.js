import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const BarangRusak = db.define(
  "barangRusak",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    penyebab: DataTypes.STRING,
    jumlahRusak: DataTypes.INTEGER,
    barangId: DataTypes.UUID,
  },
  { freezeTableName: true }
);

export default BarangRusak;
