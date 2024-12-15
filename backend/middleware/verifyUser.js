import User from "../models/UserModel.js";

const verifyUser = async (req, res, next) => {
  if (!req.session.uid)
    return res
      .status(401)
      .json({ msg: "Sesi telah habis. Mohon login kembali!" });

  const user = await User.findByPk(req.session.uid);
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan!" });
  req.uid = user.id;
  req.role = user.role;
  next();
};

export default verifyUser;
