import fs from "fs";
import Barang from "../models/Barang.js";
import Penghapusan from "../models/Penghapusan.js";
import { DateTime } from "luxon";
import { where } from "sequelize";

class HapusController {
  createPenghapusan = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    const { alasanHapus, jumlahHapus, barangId, tglPenghapusan } = req.body;
    try {
      const checkBrg = await Barang.findOne({
        where: { id: barangId },
      });

      const checkHapus = await Penghapusan.findOne({
        where: { barangId: checkBrg.id },
      });

      if (checkHapus)
        return res.status(404).json({ msg: "Data penghapusan sudah ada!" });

      if (jumlahHapus > checkBrg.qty || jumlahHapus <= 0)
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });

      await Penghapusan.create({
        barangId,
        alasanHapus,
        jumlahHapus,
        tglPenghapusan,
      });

      await Barang.update(
        { qty: checkBrg.qty - jumlahHapus },
        { where: { id: checkBrg.id } }
      );
      res
        .status(201)
        .json({ msg: "Berhasil memasukkan kedaftar penghapusan." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getPenghapusan = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    try {
      const response = await Penghapusan.findAll({
        include: {
          model: Barang,
          attributes: ["name", "desc", "qty", "estimasiPakai"],
        },
        attributes: ["id", "alasanHapus", "jumlahHapus", "tglPenghapusan"],
        order: [["createdAt", "DESC"]],
      });

      const data = response.map((e) => ({
        ...e.dataValues,
        tglPenghapusan: DateTime.fromJSDate(e.tglPenghapusan)
          .setZone("Asia/Jakarta")
          .toFormat("yyyy-MM-dd HH:mm:ss ZZ"),
      }));

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

  getPenghapusanById = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    try {
      const response = await Penghapusan.findOne({
        where: { id: req.params.id },
        include: {
          model: Barang,
          attributes: ["name", "desc", "qty", "estimasiPakai"],
        },
        attributes: ["id", "alasanHapus", "jumlahHapus", "tglPenghapusan"],
      });

      if (!response)
        return res
          .status(404)
          .json({ msg: "Data penghapusan tidak ditemukan!" });

      const data = {
        ...response.dataValues,
        tglPenghapusan: DateTime.fromJSDate(response.tglPenghapusan)
          .setZone("Asia/Jakarta")
          .toFormat("yyyy-mm-dd HH:mm:ss ZZ"),
      };

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

  // pembatalan penghapusan
  cancelPenghapusan = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    try {
      const checkHapus = await Penghapusan.findOne({
        where: { id: req.params.id },
        include: { model: Barang },
      });
      if (!checkHapus)
        return res
          .status(404)
          .json({ msg: "Data penghapusan tidak ditemukan!" });
      await Barang.update(
        { qty: checkHapus.barang.qty + checkHapus.jumlahHapus },
        { where: { id: checkHapus.barangId } }
      );
      await Penghapusan.destroy({ where: { id: checkHapus.id } });

      res.status(200).json({ msg: "Berhasil cancel penghapusan." });
    } catch (error) {
      console.log("err");
      res.status(500).json({ msg: error.message });
    }
  };

  // penghapusan permanent
  deletePermanent = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    try {
      const checkHapus = await Penghapusan.findOne({
        where: { id: req.params.id },
      });
      if (!checkHapus)
        return res
          .status(404)
          .json({ msg: "Data penghapusan tidak ditemukan!" });

      await Penghapusan.destroy({ where: { id: checkHapus.id } });

      res.status(200).json({
        msg: "Berhasil menghapus data Barang.",
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };

  updatePenghapusan = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    const { alasanHapus, jumlahHapus, tglPenghapusan } = req.body;

    try {
      const checkHapus = await Penghapusan.findOne({
        where: { id: req.params.id },
        include: { model: Barang },
      });

      if (!checkHapus)
        return res
          .status(404)
          .json({ msg: "Data penghapusan tidak ditemukan!" });

      if (jumlahHapus - checkHapus.jumlahHapus > checkHapus.barang.qty)
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });

      await Barang.update(
        {
          qty: checkHapus.barang.qty - jumlahHapus + checkHapus.jumlahHapus,
        },
        { where: { id: checkHapus.barang.id } }
      );

      await Penghapusan.update(
        { alasanHapus, jumlahHapus, tglPenghapusan },
        { where: { id: checkHapus.id } }
      );

      res.status(200).json({ msg: "Berhasil mengupdate data." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

export default HapusController;
