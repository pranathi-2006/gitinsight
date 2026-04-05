import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) return;

    localStorage.setItem("repo", search);
    navigate("/dashboard", { state: { repo: search } });
  };

  return (

    <div className="w-full bg-white shadow p-4 flex justify-between items-center">

      {/* 🔹 Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h1 className="text-xl font-semibold text-gray-700">
          GitInsight
        </h1>
      </div>

      {/* 🔹 Search Section */}
      <div className="flex items-center gap-3">

        <input
          type="text"
          placeholder="owner/repo (e.g., facebook/react)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="border p-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Search
        </button>

      </div>

    </div>

  );
}

export default Navbar;