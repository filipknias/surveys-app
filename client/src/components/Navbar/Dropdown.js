import React, { useState } from "react";

function Dropdown({ open }) {
  const [click, setClick] = useState(false);

  //   const handleClick = () => setOpen(!open);

  return (
    <ul className={open ? "nav-dropdown open" : "nav-dropdown"}>
      <li className="nav-dropdown-item" onClick={() => setClick(false)}>
        Overview
      </li>
      <li className="nav-dropdown-item" onClick={() => setClick(false)}>
        Logout
      </li>
    </ul>
  );
}

export default Dropdown;
