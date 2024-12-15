import argon2 from "argon2";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

class UserController {
  createUser = async (req, res) => {
    // if (req.role !== "admin")
    //   return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    // ============>>>>>>>>>>>
    const { username, password, confirmPassword, idPegawai, role, divisi } =
      req.body;
    if (
      !idPegawai ||
      !username ||
      !password ||
      !role ||
      !divisi ||
      !confirmPassword
    )
      return res.status(400).json({ msg: "Field ada yang kosong!" });

    try {
      const checkUser = await User.findOne({
        where: {
          [Op.or]: [{ username: username }],
        },
      });

      if (checkUser)
        return res
          .status(400)
          .json({ msg: "username atau id pegawai sudah digunakan!" });

      if (password.length < 8)
        return res
          .status(400)
          .json({ msg: "Password minimal harus 8 karakter!" });

      if (password !== confirmPassword)
        return res.status(400).json({ msg: "Konfirmasi password salah!" });

      const hashed = await argon2.hash(password);
      await User.create({
        username,
        password: hashed,
        idPegawai,
        role,
        divisi,
      });

      res.status(201).json({ msg: "Berhasil membuat akun user." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  };

  deleteUser = async (req, res) => {
    if (req.role !== "admin")
      return res.status(403).json({ msg: "FORBIDDEN ACCESS" });

    try {
      const checkUser = await User.findByPk(req.params.id);
      if (!checkUser)
        return res.status(404).json({ msg: "User tidak ditemukan!" });

      await User.destroy({ where: { id: checkUser.id } });

      res.status(200).json({ msg: "Berhasil meghapus akun." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getUser = async (req, res) => {
    try {
      const response = await User.findAll({
        attributes: ["id", "idPegawai", "username", "divisi", "role"],
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

  getUserById = async (req, res) => {
    try {
      const response = await User.findOne({
        where: { id: req.params.id },
        attributes: ["id", "idPegawai", "username", "divisi", "role"],
      });
      if (!response)
        return res.status(404).json({ msg: "Akun tidak ditemukan!" });
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };

  updateUser = async (req, res) => {
    const { idPegawai, username, password, divisi } = req.body;
    try {
      const checkUser = await User.findByPk(req.params.id);
      if (!checkUser)
        return res.status(404).json({ msg: "Akun user ditemukan!" });
      const hashed = await argon2.hash(password);
      await User.update(
        { idPegawai, username, password: hashed, divisi },
        { where: { id: checkUser.id } }
      );

      res.status(200).json({ msg: "Berhasil mengupdate akun user!" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
}

export default UserController;
