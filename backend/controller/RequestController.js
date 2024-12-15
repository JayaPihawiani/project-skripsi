import RequestBrg from "../models/RequestUser.js";
import User from "../models/UserModel.js";
import fs from "fs";

class RequestController {
  createReqBrg = async (req, res) => {
    if (!req.files || !req.files.file)
      return res.status(400).json({ msg: "Harap upload file!" });
    // variable
    const { name, desc, qty } = req.body;
    const { file } = req.files;
    const ext = `.${file.name.split(".")[1]}`;
    const fileName = file.md5 + Date.now() + ext;
    const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
    const fileType = [".pdf", ".xlsx", ".docx"];
    console.log(file);
    console.log(req.files);
    // actions

    if (!name || !desc || !qty)
      return res.status(400).json({ msg: "Field ada yang kosong!" });

    if (!fileType.includes(ext.toLocaleLowerCase()))
      return res.status(400).json({
        msg: "Format file tidak didukung! File support: pdf, xlsx, docx",
      });

    file.mv("./public/files/" + fileName, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      await RequestBrg.create({
        name,
        desc,
        qty,
        file: fileName,
        url,
        userId: req.uid,
      });

      res.status(201).json({ msg: "Berhasil membuat permintaan barang!" });
    });
  };

  getRequestBarg = async (req, res) => {
    try {
      let response;
      if (req.role === "admin") {
        response = await RequestBrg.findAll({
          include: {
            model: User,
            attributes: ["username", "divisi", "role", "idPegawai"],
          },
        });
      } else {
        response = await RequestBrg.findAll({
          where: { userId: req.uid },
          include: { model: User, attributes: ["username", "divisi", "role"] },
        });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getRequestBargById = async (req, res) => {
    try {
      let response;
      if (req.role === "admin") {
        response = await RequestBrg.findOne({
          where: { id: req.params.id },
          include: {
            model: User,
            attributes: ["username", "divisi", "role", "idPegawai"],
          },
        });
      } else {
        response = await RequestBrg.findOne({
          where: { id: req.params.id, userId: req.uid },
          include: { model: User, attributes: ["username", "divisi", "role"] },
        });
      }

      if (!response)
        return res.status(404).json({ msg: "Data request tidak ditemukan!" });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  deleteRequest = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    try {
      const checkRequest = await RequestBrg.findOne({
        where: { id: req.params.id },
      });

      if (!checkRequest)
        return res.status(404).json({ msg: "Data request tidak ditemukan!" });
      fs.unlinkSync("./public/files/" + checkRequest.file);
      await RequestBrg.destroy({ where: { id: checkRequest.id } });

      res.status(200).json({ msg: "Berhasil menghapus data request." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

export default RequestController;
