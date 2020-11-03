import React from "react";

function Menu({ options, setOptions, handleStart }) {
  return (
    <div className="container flex">
      <div className="menu flex flex-col flex-ai-c flex-jc-sa">
        <div className="btns">
          <button
            className={options.easyLevel ? "btn active" : "btn"}
            onClick={() => setOptions({ ...options, easyLevel: true })}
          >
            Easy
          </button>
          <button
            className={options.easyLevel ? "btn" : "btn active"}
            onClick={() => setOptions({ ...options, easyLevel: false })}
          >
            Normal
          </button>
        </div>
        {options.easyLevel ? easy : normal}
        <p className="description">
          In this FUN WITH MAPS you will need to specify location of country by
          double clicking on map. Press start whenever you are ready!
        </p>
        <button className="btn" onClick={() => handleStart()}>
          START
        </button>
      </div>
    </div>
  );
}

const easy = (
  <p className="level-description">
    In this mode you will <b>see</b> borders of countries.
  </p>
);
const normal = (
  <p className="level-description">
    In this mode you will <b>NOT see</b> borders of countries.
  </p>
);
export default Menu;
