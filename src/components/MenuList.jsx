import React from "react";
import MenuItem from "./MenuItem.jsx";

export default function MenuList({items = []}){
  return (
    <div className="menu-grid">
      {items.map(i => <MenuItem key={i.id} item={i} />)}
    </div>
  );
}