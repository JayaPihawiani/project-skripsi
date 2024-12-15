import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import PindahBrg from "./BarangPindah.js";
import BarangRusak from "./BarangRusak.js";
import KategoriBrg from "./Kategori.js";
import Penghapusan from "./Penghapusan.js";

const Barang = db.define(
  "barang",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    tglPembelian: DataTypes.DATE,
    harga: DataTypes.INTEGER,
    estimasiPakai: DataTypes.DOUBLE,
    kondisi: DataTypes.INTEGER,
    riwayatPemeliharaan: DataTypes.INTEGER,
    penyebabRusak: DataTypes.INTEGER,
    statusPerbaikan: DataTypes.INTEGER,
    userId: DataTypes.UUID,
  },
  { freezeTableName: true }
);

Barang.hasOne(Penghapusan, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Penghapusan.belongsTo(Barang, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Barang.hasOne(BarangRusak, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BarangRusak.belongsTo(Barang, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Barang.hasOne(PindahBrg, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

PindahBrg.belongsTo(Barang, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Barang.belongsTo(KategoriBrg, {
  foreignKey: "kategoryId",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

KategoriBrg.hasMany(Barang, {
  foreignKey: "kategoryId",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

export default Barang;
