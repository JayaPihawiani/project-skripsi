import KategoriBrg from "../models/Kategori.js";

class CategoryController {
  createCategory = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    try {
      const checkCategory = await KategoriBrg.findOne({
        where: { name: req.body.name },
      });

      if (checkCategory)
        return res.status(400).json({ msg: "Kategori ini sudah ada!" });

      await KategoriBrg.create({ name: req.body.name });
      res.status(201).json({ msg: "Berhasil menambah kategori" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  deleteCategory = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    try {
      const check = await KategoriBrg.findByPk(req.params.id);

      if (!check)
        return res.status(404).json({ msg: "Kategori tidak ditemukan!" });
      await KategoriBrg.destroy({ where: { id: check.id } });

      res.status(200).json({ msg: "Berhasil menghapus kategori." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getCategory = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    try {
      const response = await KategoriBrg.findAll();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  updateCategory = async (req, res) => {
    try {
      const check = await KategoriBrg.findOne({ where: { id: req.params.id } });
      if (!check) return res.status(404).json("Data kategori tidak ditemukan!");

      await KategoriBrg.update(
        { name: req.body.name },
        { where: { id: check.id } }
      );

      res.status(200).json({ msg: "Berhasil mengupdate data kategori." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

export default CategoryController;
