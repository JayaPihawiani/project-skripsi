import argon2 from "argon2";
import User from "../models/UserModel.js";

class AuthController {
  loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: "Field ada yang kosong!" });

    try {
      const checkUser = await User.findOne({
        where: { username },
      });
      if (!checkUser)
        return res
          .status(404)
          .json({ msg: "Akun dengan Username ini tidak ditemukan!" });

      const verifyPassword = await argon2.verify(checkUser.password, password);

      if (!verifyPassword)
        return res.status(404).json({ msg: "Password yang dimasukkan salah!" });

      req.session.uid = checkUser.id;

      res.status(200).json({
        id: checkUser.idPegawai,
        username: checkUser.username,
        divisi: checkUser.divisi,
        role: checkUser.role,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message, stack: error.stack });
    }
  };

  userInfo = async (req, res) => {
    if (!req.session.uid)
      return res
        .status(401)
        .json({ msg: "Sesi anda telah habis! Lakukan login kembali." });

    try {
      const response = await User.findOne({
        where: { id: req.session.uid },
        attributes: ["id", "idPegawai", "username", "role"],
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  logoutUser = async (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ msg: err.message });
      res.clearCookie("connect.sid");
      res.status(200).json({ msg: "Berhasil logout." });
    });
  };
}

export default AuthController;
