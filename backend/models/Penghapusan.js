import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Penghapusan = db.define(
  "penghapusan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    alasanHapus: DataTypes.STRING,
    jumlahHapus: DataTypes.INTEGER,
    barangId: DataTypes.UUID,
    tglPenghapusan: DataTypes.DATE,
  },
  { freezeTableName: true }
);

export default Penghapusan;
