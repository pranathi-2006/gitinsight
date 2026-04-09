import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function UserAnalyzer() {

  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://gitinsight-ewxj.onrender.com";

  const handleSearch = async () => {

    if (!username.trim()) {
      alert("Enter GitHub username");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/user?username=${username}`
      );

      console.log("User Data:", res.data);

      setData(res.data);

    } catch (error) {
      console.error("User API error:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex bg-gradient-to-br from-slate-100 to-gray-200 min-h-screen">

      <Sidebar />

      <div className="ml-[220px] w-full">

        <Navbar />

        <div className="p-10">

          <h1 className="text-3xl font-bold mb-6">
            GitHub User Analyzer 🔍
          </h1>

          <div className="flex gap-4 mb-8">

            <input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-6 rounded hover:bg-indigo-700"
            >
              Search
            </button>

          </div>

          {/* ✅ Loading */}
          {loading && (
            <p className="text-gray-500">Loading...</p>
          )}

          {/* ✅ Data */}
          {data && data.name !== "User not found" && (

            <div className="bg-white p-6 rounded-xl shadow flex gap-6 items-center">

              {/* ✅ Fix avatar */}
              <img
                src={data.avatar || "https://via.placeholder.com/80"}
                alt="avatar"
                className="w-20 h-20 rounded-full"
              />

              <div>

                <h2 className="text-xl font-bold">
                  {data.name}
                </h2>

                <p className="text-gray-500">
                  {data.bio || "No bio available"}
                </p>

                <div className="flex gap-6 mt-3">

                  <p>📦 Repos: {data.repos ?? 0}</p>
                  <p>👥 Followers: {data.followers ?? 0}</p>
                  <p>➡ Following: {data.following ?? 0}</p>

                </div>

              </div>

            </div>

          )}

          {/* ❌ Error */}
          {data && data.name === "User not found" && (
            <p className="text-red-500 font-semibold">
              User not found ❌
            </p>
          )}

        </div>

      </div>

    </div>

  );
}

export default UserAnalyzer;