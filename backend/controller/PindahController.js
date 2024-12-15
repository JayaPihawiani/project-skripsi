import { where } from "sequelize";
import Barang from "../models/Barang.js";
import PindahBrg from "../models/BarangPindah.js";
import { DateTime } from "luxon";
import Lokasi from "../models/Lokasi.js";

class PindahController {
  createPindah = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    const { barangId, desc, from, to, jumlahPindah, tglPemindahan } = req.body;

    if (!barangId || !desc || !from || !to || !jumlahPindah || !tglPemindahan) {
      return res.status(400).json({ msg: "Field ada yang kosong!" });
    }

    const checkBarang = await Barang.findOne({ where: { id: barangId } });

    if (!checkBarang)
      return res.status(404).json({ msg: "Data barang tidak ditemukan!" });

    const checkPindah = await PindahBrg.findOne({
      where: { barangId },
    });

    if (checkPindah)
      return res
        .status(400)
        .json({ msg: "Data sudah masuk dalam daftar pindah!" });

    if (checkBarang.qty < jumlahPindah || jumlahPindah <= 0)
      return res.status(400).json({ msg: "Input jumlah tidak valid!" });

    await PindahBrg.create({
      barangId,
      desc,
      from,
      to,
      jumlahPindah,
      tglPemindahan,
    });

    await Barang.update(
      { qty: checkBarang.qty - jumlahPindah },
      { where: { id: barangId } }
    );

    res.status(201).json({ msg: "Berhasil membuat data pemindahan." });
  };

  getDataPindah = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    try {
      const findBrg = await PindahBrg.findAll({
        include: [
          {
            model: Barang,
            attributes: ["name", "desc", "qty", "image", "url"],
            order: [["createdAt", "DESC"]],
          },
          {
            model: Lokasi,
            as: "fromLoc",
            attributes: ["name", "desc"],
          },
          {
            model: Lokasi,
            as: "toLoc",
            attributes: ["name", "desc"],
          },
        ],
      });

      const response = findBrg.map((e) => ({
        ...e.dataValues,
        tglPemindahan: DateTime.fromJSDate(e.tglPemindahan)
          .setZone("Asia/Jakarta")
          .toFormat("yyyy-MM-dd HH:mm:ss ZZ"),
      }));

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getDataPindahById = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    try {
      const response = await PindahBrg.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: Barang,
            attributes: ["name", "desc", "qty", "image", "url"],
            order: [["createdAt", "DESC"]],
          },
          {
            model: Lokasi,
            as: "fromLoc",
            attributes: ["name", "desc"],
          },
          {
            model: Lokasi,
            as: "toLoc",
            attributes: ["name", "desc"],
          },
        ],
      });

      if (!response)
        return res
          .status(404)
          .json({ msg: "Data pemindahan tidak ditemukan!" });

      const data = {
        ...response.dataValues,
        tglPemindahan: DateTime.fromJSDate(response.tglPemindahan)
          .setZone("Asia/Jakarta")
          .toFormat("yyyy-MM-dd HH:mm:ss ZZ"),
      };

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  updateDataPindah = async (req, res) => {
    const { desc, jumlahPindah, from, to } = req.body;

    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    const checkPindah = await PindahBrg.findOne({
      where: { id: req.params.id },
      include: { model: Barang },
    });

    if (!checkPindah)
      return res.status(404).json({ msg: "Data pemindahan tidak ditemukan!" });

    const stockBrg = checkPindah.barang.qty;
    const totalPindah = checkPindah.jumlahPindah;
    const selisih = jumlahPindah - totalPindah;

    if (selisih > stockBrg)
      return res.status(400).json({ msg: "Input jumlah tidak valid!" });

    await Barang.update(
      { qty: stockBrg - selisih },
      { where: { id: checkPindah.barang.id } }
    );

    await PindahBrg.update(
      { desc, jumlahPindah, from, to },
      { where: { id: checkPindah.id } }
    );

    res.status(200).json({ msg: "Berhasil update data!" });
  };

  deleteDataPindah = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    try {
      const response = await PindahBrg.findByPk(req.params.id);

      if (!response)
        return res
          .status(404)
          .json({ msg: "Data pemindahan tidak ditemukan!" });
      await PindahBrg.destroy({ where: { id: response.id } });
      res.status(200).json({ msg: "Berhasil menghapus data pindah!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

export default PindahController;
