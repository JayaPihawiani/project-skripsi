import Barang from "../models/Barang.js";
import BarangRusak from "../models/BarangRusak.js";

class BrgRusakController {
  createDataRusak = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    const { penyebab, jumlahRusak, barangId } = req.body;

    try {
      const checkBarang = await Barang.findOne({ where: { id: barangId } });
      const checkRusak = await BarangRusak.findOne({
        where: { barangId: barangId },
      });

      if (checkRusak)
        return res
          .status(400)
          .json({ msg: "Barang sudah masuk daftar rusak!" });

      if (jumlahRusak > checkBarang.qty || jumlahRusak <= 0)
        return res.status(400).json({ msg: "Input jumlah tidak valid!" });

      await BarangRusak.create({
        barangId,
        penyebab,
        jumlahRusak,
      });

      await Barang.update(
        { qty: checkBarang.qty - jumlahRusak },
        { where: { id: barangId } }
      );

      res.status(201).json({ msg: "Berhasil memasukkan kedaftar kerusakan." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getDataRusak = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    try {
      const response = await BarangRusak.findAll({
        attributes: ["id", "penyebab", "jumlahRusak"],
        include: {
          model: Barang,
          attributes: ["name", "desc", "qty", "image", "url", "estimasiPakai"],
          order: [["createdAt", "DESC"]],
        },
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getDataRusakById = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    try {
      const response = await BarangRusak.findOne({
        where: { id: req.params.id },
        include: {
          model: Barang,
          attributes: ["name", "desc", "qty", "image", "url", "estimasiPakai"],
        },
        attributes: ["id", "penyebab", "jumlahRusak"],
      });

      if (!response)
        return res
          .status(404)
          .json({ msg: "Data barang rusak tidak ditemukan!" });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  deleteDataRusak = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    try {
      const response = await BarangRusak.findByPk(req.params.id);
      if (!response)
        return res.status(404).json({ msg: "Data rusak tidak ditemukan!" });

      await BarangRusak.destroy({ where: { id: response.id } });
      res.status(200).json({ msg: "Berhasil menghapus data kerusakan." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  updateDataRusak = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    const { penyebab, jumlahRusak } = req.body;

    try {
      const dataRusak = await BarangRusak.findOne({
        where: { id: req.params.id },
        include: { model: Barang },
      });

      if (!dataRusak)
        return res.status(404).json({ msg: "Data rusak tidak ditemukan!" });

      const stockBrg = dataRusak.barang.qty;
      const totalRusak = dataRusak.jumlahRusak;
      const selisihRusak = jumlahRusak - totalRusak;

      if (selisihRusak > stockBrg)
        return res.status(400).json({
          msg: "Input jumlah tidak valid!!",
        });

      await Barang.update(
        { qty: stockBrg - selisihRusak },
        { where: { id: dataRusak.barang.id } }
      );

      await BarangRusak.update(
        { penyebab, jumlahRusak },
        { where: { id: req.params.id } }
      );

      res.status(200).json({ msg: "Berhasil memperbarui data kerusakan." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

export default BrgRusakController;
