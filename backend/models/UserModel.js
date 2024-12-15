import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Barang from "./Barang.js";
import RequestBrg from "./RequestUser.js";

const User = db.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    divisi: DataTypes.STRING,
    idPegawai: DataTypes.STRING(35),
    role: DataTypes.ENUM(["user", "admin"]),
  },
  { freezeTableName: true }
);

User.hasMany(Barang, { foreignKey: "userId", onDelete: "CASCADE" });
Barang.belongsTo(User, { foreignKey: "userId", onUpdate: "CASCADE" });

User.hasMany(RequestBrg, { foreignKey: "userId", onDelete: "CASCADE" });
RequestBrg.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

export default User;
