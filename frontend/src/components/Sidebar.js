import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Sidebar() {
  return (

    <div className="w-[220px] h-screen bg-slate-900 text-white p-6 fixed">

      {/* 🔹 Logo + Project Name */}
      <div className="flex items-center gap-3 mb-10">
       <img
          src={logo}
            alt="logo"
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
          />
        <h2 className="text-xl font-bold">GitInsight</h2>
      </div>

      {/* 🔹 Menu */}
      <ul className="space-y-5">

        <li>
          <Link
            to="/"
            className="flex items-center gap-3 hover:text-indigo-400 transition"
          >
            🏠 <span>Home</span>
          </Link>
        </li>

        <li>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 hover:text-indigo-400 transition"
          >
            📊 <span>Dashboard</span>
          </Link>
        </li>

        <li>
          <Link
            to="/charts"
            className="flex items-center gap-3 hover:text-indigo-400 transition"
          >
            📈 <span>Charts</span>
          </Link>
        </li>

        <li>
          <Link
            to="/contributors"
            className="flex items-center gap-3 hover:text-indigo-400 transition"
          >
            👨‍💻 <span>Contributors</span>
          </Link>
        </li>

        <li>
          <Link
            to="/compare"
            className="flex items-center gap-3 hover:text-indigo-400 transition"
          >
            ⚔️ <span>Compare</span>
          </Link>
        </li>

        <li>
          <Link
            to="/user"
            className="flex items-center gap-3 hover:text-indigo-400 transition"
          >
            👤 <span>User Analyzer</span>
          </Link>
        </li>

      </ul>

    </div>

  );
}

export default Sidebar;