import React from "react";
import intanLogo from "../images/intan.png";
import Input from "../components/Input";

const LoginPage = () => {
  return (
    <div className="container-fluid">
      <div className="container d-flex vh-100 position-fixed start-50 top-50 translate-middle justify-content-center align-items-center">
        <div className="card p-3">
          <img src={intanLogo} alt="intan logo" width={200} />
          <div className="card-body">
            <form className="d-flex flex-column">
              <label className="form-label">Username</label>
              <Input placeHolder="Enter username" type="text" />
              <label className="form-label mt-3 ">Password</label>
              <Input placeHolder="Enter password" type="password" />
              <button className="btn btn-primary mt-3">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
