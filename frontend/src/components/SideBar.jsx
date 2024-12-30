import React from "react";
import {
  BsArrowsMove,
  BsCalendarXFill,
  BsCaretDownFill,
  BsDoorOpenFill,
  BsEnvelopePaperFill,
  BsFileEarmarkPersonFill,
  BsGeoAltFill,
  BsGrid1X2Fill,
  BsInboxesFill,
  BsTagsFill,
  BsWrenchAdjustable,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import "../style/sidebar.css";

const SideBar = ({ children }) => {
  return (
    <React.Fragment>
      <div className="sidebar">
        <nav className="nav flex-column">
          <React.Fragment>
            {/* dashboard */}
            <Link to="/dashboard" className="nav-link">
              <span className="icons">
                <BsGrid1X2Fill />
              </span>
              <span className="side-desc">Dashboard</span>
            </Link>

            {/* dropdown menu */}
            <Link
              className="nav-link"
              data-bs-toggle="collapse"
              data-bs-target="#submenu"
              aria-expanded="true"
              aria-controls="submenu"
            >
              <span className="icon-down">
                <BsCaretDownFill />
              </span>
              <span className="side-desc">DATA ASET</span>
            </Link>

            {/* menu */}
            <div className="collapse side-bar-style" id="submenu">
              <Link to="/stock" className="nav-link">
                <span className="icons">
                  <BsInboxesFill />
                </span>
                <span className="side-desc">Stock Barang</span>
              </Link>

              <Link to="/penghapusan" className="nav-link">
                <span className="icons">
                  <BsCalendarXFill />
                </span>
                <span className="side-desc">Penghapusan</span>
              </Link>

              <Link to="/pindah" className="nav-link">
                <span className="icons">
                  <BsArrowsMove />
                </span>
                <span className="side-desc">Pemindahan</span>
              </Link>

              <Link to="/rusak" className="nav-link">
                <span className="icons">
                  <BsWrenchAdjustable />
                </span>
                <span className="side-desc">Kerusakan</span>
              </Link>
            </div>

            {/* permintaan */}
            <Link to="/permintaan" className="nav-link">
              <span className="icons">
                <BsEnvelopePaperFill />
              </span>
              <span className="side-desc">Permintaan</span>
            </Link>
            {/* kategori */}
            <Link to="/kategory" className="nav-link">
              <span className="icons">
                <BsTagsFill />
              </span>
              <span className="side-desc">Kategori</span>
            </Link>
            {/* lokasi */}
            <Link to="/lokasi" className="nav-link">
              <span className="icons">
                <BsGeoAltFill />
              </span>
              <span className="side-desc">Lokasi</span>
            </Link>
            {/* user */}
            <Link to="/user" className="nav-link">
              <span className="icons">
                <BsFileEarmarkPersonFill />
              </span>
              <span className="side-desc">User</span>
            </Link>
            {/* logout */}
            <button
              to="/user"
              className="nav-link"
              onClick={() => console.log("Sudah Logout")}
            >
              <span className="icons">
                <BsDoorOpenFill />
              </span>
              <span className="side-desc">Log out</span>
            </button>
          </React.Fragment>
        </nav>
      </div>
      <section className="body-page">{children}</section>
    </React.Fragment>
  );
};

// const SideLink = ({ linkTo, icon, classname }) => {
//   return (
//     <Link to={linkTo} className={classname}>
//       <span className="icons">{icon}</span>
//       <span className="side-desc">Dashboard</span>
//     </Link>
//   );
// };

export default SideBar;
