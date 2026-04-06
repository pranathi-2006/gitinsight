import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const repo = location.state?.repo || localStorage.getItem("repo");

  // ✅ AUTO SWITCH (LOCAL + DEPLOYED)
  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://gitinsight-ewxj.onrender.com";

  useEffect(() => {
    if (!repo) {
      console.log("❌ No repo found");
      setLoading(false);
      return;
    }

    console.log("Fetching repo:", repo);

    axios
      .get(`${BASE_URL}/repo?repo=${repo}`)
      .then((res) => {
        console.log("API DATA:", res.data);

        // ✅ ALWAYS SET DATA (no strict error check)
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("API ERROR:", err.message);
        setData(null);
        setLoading(false);
      });
  }, [repo, BASE_URL]);

  // ✅ Loading UI
  if (loading) {
    return <h2 className="text-center mt-10 text-xl">Loading...</h2>;
  }

  // ❌ No repo case
  if (!repo) {
    return <h2 className="text-center mt-10 text-xl">No repo selected ❌</h2>;
  }

  // ❌ No data case
  if (!data) {
    return <h2 className="text-center mt-10 text-xl">No data found ❌</h2>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-gray-200">
      <Sidebar />

      <div className="ml-[220px] w-full">
        <Navbar />

        <div className="p-10">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Repository Dashboard
          </h1>

          <div className="grid grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Repository</h3>
              <p className="text-xl font-bold mt-2">
                {data.name || "N/A"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Stars ⭐</h3>
              <p className="text-xl font-bold text-blue-600 mt-2">
                {data.stars ?? 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Forks 🔀</h3>
              <p className="text-xl font-bold text-green-600 mt-2">
                {data.forks ?? 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Language 💻</h3>
              <p className="text-xl font-bold text-purple-600 mt-2">
                {data.language || "N/A"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Open Issues 🐞</h3>
              <p className="text-xl font-bold text-orange-600 mt-2">
                {data.issues ?? 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Repository Size 📦</h3>
              <p className="text-xl font-bold text-red-600 mt-2">
                {data.size ?? 0} KB
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;