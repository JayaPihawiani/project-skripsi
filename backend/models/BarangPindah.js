import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Lokasi from "./Lokasi.js";

const PindahBrg = db.define(
  "pindahBrg",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    desc: DataTypes.STRING,
    jumlahPindah: DataTypes.INTEGER,
    from: { type: DataTypes.UUID, references: { model: Lokasi, key: "id" } },
    to: { type: DataTypes.UUID, references: { model: Lokasi, key: "id" } },
    barangId: DataTypes.UUID,
    tglPemindahan: DataTypes.DATE,
  },
  { freezeTableName: true }
);

Lokasi.hasMany(PindahBrg, { foreignKey: "from", as: "pindahFrom" });
Lokasi.hasMany(PindahBrg, { foreignKey: "to", as: "pindahTo" });

PindahBrg.belongsTo(Lokasi, { foreignKey: "from", as: "fromLoc" });
PindahBrg.belongsTo(Lokasi, { foreignKey: "to", as: "toLoc" });

export default PindahBrg;
