import tf from "@tensorflow/tfjs-node";
import fs from "fs";
import Barang from "../models/Barang.js";
import KategoriBrg from "../models/Kategori.js";

class BarangController {
  // Create barang
  createBarang = async (req, res) => {
    let model;

    // Load TensorFlow model
    const loadModel = async () => {
      try {
        model = await tf.loadLayersModel(
          "file://./data_training/model/model.json"
        );
        console.log("Model berhasil di-load");
      } catch (error) {
        console.error("Gagal memuat model:", error.message);
        return res.status(500).json({ msg: "Gagal memuat model TensorFlow" });
      }
    };

    // Periksa role user
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    const {
      name,
      desc,
      qty,
      kondisi,
      riwayatPemeliharaan,
      penyebabRusak,
      statusPerbaikan,
      harga,
      tglPembelian,
      kategoryId,
    } = req.body;

    // Periksa file
    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "File belum dipilih!" });
    }

    if (
      !name ||
      !desc ||
      !qty ||
      !kondisi ||
      !riwayatPemeliharaan ||
      !penyebabRusak ||
      !statusPerbaikan
    )
      return res.status(400).json({ msg: "Harap isi semua data!" });

    const { file } = req.files;
    const ext = `.${file.name.split(".")[1]}`;
    const fileName = "img" + new Date().getTime() + ext;
    const url = `${req.protocol}://${req.get("host")}/img/${fileName}`;
    const fileFormat = [".jpg", ".png", ".jpeg"];

    if (!fileFormat.includes(ext.toLowerCase())) {
      return res.status(400).json({
        msg: "Format tidak cocok! Format yang didukung: jpg, png, jpeg.",
      });
    }

    if (file.size > 3145728)
      return res
        .status(400)
        .json({ msg: "Ukuran file terlalu besar! Maksimal 3mb" });

    // Load model
    await loadModel();

    file.mv(`./public/img/${fileName}`, async (err) => {
      if (err) return res.status(400).json({ msg: err.message });

      try {
        const features = [
          parseFloat(kondisi),
          parseFloat(riwayatPemeliharaan),
          parseFloat(penyebabRusak),
          parseFloat(statusPerbaikan),
        ];

        // memastikan fitur valid
        if (features.some(isNaN)) {
          return res.status(400).json({ msg: "Fitur harus berupa angka" });
        }

        const featureTensor = tf.tensor2d([features], [1, 4]);
        const prediction = model.predict(featureTensor);
        const estimasiPakai = prediction.dataSync()[0].toFixed(4); // Ambil prediksi

        // Simpan data barang
        await Barang.create({
          name,
          desc,
          qty,
          image: fileName,
          url,
          estimasiPakai,
          kondisi,
          riwayatPemeliharaan,
          penyebabRusak,
          statusPerbaikan,
          userId: req.uid,
          harga,
          tglPembelian,
          kategoryId,
        });

        res.status(200).json({ msg: "Berhasil menambah barang!" });
      } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ msg: error.message });
      }
    });
  };

  // Get barang
  getBarang = async (req, res) => {
    const kategoryId = req.query.category;
    console.log(kategoryId);
    let response;
    try {
      if (kategoryId) {
        response = await Barang.findAll({
          where: {
            kategoryId,
          },
          attributes: [
            "id",
            "name",
            "desc",
            "qty",
            "image",
            "url",
            "userId",
            "estimasiPakai",
            "harga",
            "tglPembelian",
          ],
          include: { model: KategoriBrg, attributes: ["name"] },
          order: [["createdAt", "DESC"]],
        });
      } else {
        response = await Barang.findAll({
          attributes: [
            "id",
            "name",
            "desc",
            "qty",
            "image",
            "url",
            "userId",
            "estimasiPakai",
            "harga",
            "tglPembelian",
          ],
          include: { model: KategoriBrg, attributes: ["name"] },
          order: [["createdAt", "DESC"]],
        });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getBarangById = async (req, res) => {
    try {
      const response = await Barang.findOne({
        where: { id: req.params.id },
        attributes: [
          "id",
          "name",
          "desc",
          "qty",
          "image",
          "url",
          "userId",
          "estimasiPakai",
          "harga",
          "tglPembelian",
        ],
        include: { model: KategoriBrg, attributes: ["name"] },
      });
      if (!response)
        return res.status(404).json({ msg: "Data barang tidak ditemukan!" });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  updateBarang = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    // variable
    try {
      const checkBrg = await Barang.findByPk(req.params.id);
      if (!checkBrg)
        return res.status(404).json({ msg: "Data barang tidak ditemukan!" });

      let fileName;
      const { name, desc, qty } = req.body;
      // actions
      if (!req.files || req.files.file == null) {
        fileName = checkBrg.image;
      } else {
        const { file } = req.files;
        const fileFormat = [".jpg", ".jpeg", ".png"];
        const ext = `.${file.name.split(".")[1]}`;

        if (!fileFormat.includes(ext.toLowerCase()))
          return res.status(400).json({
            msg: "Format tidak cocok! Format yang didukung: jpg, png, jpeg.",
          });

        if (file.size > 3145728)
          return res
            .status(400)
            .json({ msg: "Ukuran file terlalu besar! Maksimal 3mb" });
        fileName = "img" + new Date().getTime() + ext;
        fs.unlinkSync(`./public/img/${checkBrg.image}`);
        file.mv(`./public/img/${fileName}`, (err) => {
          if (err) return res.status(400).json({ msg: err.message });
        });
      }
      const url = `${req.protocol}://${req.get("host")}/img/${fileName}`;
      // update barang
      await Barang.update(
        { name, desc, qty, image: fileName, url },
        { where: { id: req.params.id } }
      );
      res.status(200).json({ msg: "Berhasil mengupdate barang." });
    } catch (error) {
      res.status(400).json({ msg: error.message, stackTrace: error.stack });
    }
  };

  // update kondisi dan estimasi barang
  updateKondisiEstimasiBrg = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    let model;

    // Load TensorFlow model
    const loadModel = async () => {
      try {
        model = await tf.loadLayersModel(
          "file://./data_training/model/model.json"
        );
        console.log("Model berhasil di-load");
      } catch (error) {
        console.error("Gagal memuat model:", error.message);
        return res.status(500).json({ msg: "Gagal memuat model TensorFlow" });
      }
    };

    // variabel
    const { kondisi, riwayatPemeliharaan, penyebabRusak, statusPerbaikan } =
      req.body;

    try {
      const checkBrg = await Barang.findByPk(req.params.id);

      if (!checkBrg)
        return res.status(404).json({ msg: "Data barang tidak ditemukan!" });

      await loadModel();
      const features = [
        parseFloat(kondisi),
        parseFloat(riwayatPemeliharaan),
        parseFloat(penyebabRusak),
        parseFloat(statusPerbaikan),
      ];

      // memastikan fitur valid
      if (features.some(isNaN)) {
        return res.status(400).json({ msg: "Fitur harus berupa angka" });
      }

      const featureTensor = tf.tensor2d([features], [1, 4]);
      const prediction = model.predict(featureTensor);
      const estimasiPakai = prediction.dataSync()[0].toFixed(4); // Ambil prediksi

      await Barang.update(
        {
          kondisi,
          riwayatPemeliharaan,
          penyebabRusak,
          statusPerbaikan,
          estimasiPakai,
        },
        { where: { id: req.params.id } }
      );

      res.status(200).json({ msg: "Berhasil mengupdate kondisi barang." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  deleteBarang = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    try {
      const checkBrg = await Barang.findByPk(req.params.id);
      if (!checkBrg)
        return res.status(404).json({ msg: "Data barang tidak ditemukan!" });

      await Barang.destroy({ where: { id: checkBrg.id } });
      fs.unlinkSync(`./public/img/${checkBrg.image}`);
      res.status(200).json({ msg: "Berhasil menghapus data barang." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

export default BarangController;
