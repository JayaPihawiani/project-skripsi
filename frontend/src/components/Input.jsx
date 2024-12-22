import React from "react";
import "../style/login.css";

const Input = ({ placeHolder, change, type, classname }) => {
  return (
    <input
      type={type}
      placeholder={placeHolder}
      onChange={change}
      className={classname}
    />
  );
};

export default Input;
