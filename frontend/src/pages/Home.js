import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Home() {

  const [repo, setRepo] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (!repo.trim()) return;
    localStorage.setItem("repo", repo);
    navigate("/dashboard", { state: { repo } });
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-[420px]">

        {/* 🔹 Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 rounded-full object-cover shadow mb-3"
          />
          <h1 className="text-3xl font-bold text-gray-800">
            GitInsight
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Analyze GitHub repositories easily
          </p>
        </div>

        {/* 🔹 Input */}
        <input
          type="text"
          placeholder="owner/repo (e.g., facebook/react)"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAnalyze();
          }}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* 🔹 Button */}
        <button
          onClick={handleAnalyze}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Analyze 🚀
        </button>

      </div>

    </div>

  );
}

export default Home;