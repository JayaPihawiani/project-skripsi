import Lokasi from "../models/Lokasi.js";

class LokasiController {
  createLokasi = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCES" });

    const { name, desc } = req.body;

    try {
      if (!name || !desc)
        return res.status(400).json({ msg: "Field ada yang kosong!" });

      await Lokasi.create({ name, desc });
      res.status(201).json({ msg: "Berhasil menambah data lokasi." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getLokasi = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCES" });

    try {
      const response = await Lokasi.findAll();
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

  getLokasiById = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCES" });

    try {
      const response = await Lokasi.findOne({ where: { id: req.params.id } });
      if (!response)
        return res.status(404).json({ msg: "Data lokasi tidak ditemukan!" });

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

  updateLokasi = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCES" });

    const { name, desc } = req.body;

    try {
      const response = await Lokasi.findOne({ where: { id: req.params.id } });
      if (!response)
        return res.status(404).json({ msg: "Data lokasi tidak ditemukan!" });

      await Lokasi.update({ name, desc }, { where: { id: response.id } });

      res.status(200).json({ msg: "Berhasil mengupdate data lokasi." });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

  deleteLokasi = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCES" });

    try {
      const response = await Lokasi.findOne({ where: { id: req.params.id } });
      if (!response)
        return res.status(404).json({ msg: "Data lokasi tidak ditemukan!" });

      await Lokasi.destroy({ where: { id: response.id } });

      res.status(200).json({ msg: "Berhasil menghapus data lokasi." });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };
}

export default LokasiController;
