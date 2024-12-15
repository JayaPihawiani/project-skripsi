import SequelizeStore from "connect-session-sequelize";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import db from "./config/Database.js";
import authRouter from "./routes/AuthRoutes.js";
import brgRouter from "./routes/BarangRoutes.js";
import rusakRouter from "./routes/BrgRusakRoutes.js";
import hpsRouter from "./routes/HapusRoutes.js";
import kateRouter from "./routes/KategoryRoutes.js";
import locRouter from "./routes/LokasiRoutes.js";
import pindahRouter from "./routes/PindahRoutes.js";
import reqRouter from "./routes/RequestRoutes.js";
import userRouter from "./routes/UserRoutes.js";

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected...");
    // await db.sync({ alter: true });
  } catch (error) {
    console.log(error.message);
  }
})();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({ db });

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    store,
    saveUninitialized: false,
    cookie: { secure: "auto", maxAge: 1000 * 60 * 60 * 8, httpOnly: true },
  })
);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(fileUpload());

app.use(express.static("public"));
app.use("/api/user", userRouter);
app.use("/api", authRouter);
app.use("/api/barang", brgRouter);
app.use("/api/hapus", hpsRouter);
app.use("/api/rusak", rusakRouter);
app.use("/api/request", reqRouter);
app.use("/api/pindah", pindahRouter);
app.use("/api/kategori", kateRouter);
app.use("/api/lokasi", locRouter);

app.use("/", (req, res) => res.send("./public/index.html"));
// store.sync();

app.listen(port, () => console.log("Server running on " + port));
