import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
function Dashboard() {

  const [data, setData] = useState(null);

  const location = useLocation();
const repo = location.state?.repo || localStorage.getItem("repo");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/repo?repo=${repo}`)
      .then((res) => setData(res.data));
  }, [repo]);

  if (!data) return <h2 className="text-center mt-10 text-xl">Loading...</h2>;

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
          
            {/* Repository Card */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 transition transform duration-200">

              <h3 className="text-gray-500">Repository</h3>
              <p className="text-xl font-bold mt-2">
                {data.name}
              </p>
            </div>

            {/* Stars Card */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 transition transform duration-200">
              <h3 className="text-gray-500">Stars ⭐</h3>
              <p className="text-xl font-bold text-blue-600 mt-2">
                {data.stars}
              </p>
            </div>

            {/* Forks Card */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 transition transform duration-200">
              <h3 className="text-gray-500">Forks 🔀</h3>
              <p className="text-xl font-bold text-green-600 mt-2">
                {data.forks}
              </p>
            </div>

            {/* Language Card */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 transition transform duration-200">
              <h3 className="text-gray-500">Language 💻</h3>
              <p className="text-xl font-bold text-purple-600 mt-2">
                {data.language}
              </p>
            </div>

            {/* Issues Card */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 transition transform duration-200">
              <h3 className="text-gray-500">Open Issues 🐞</h3>
              <p className="text-xl font-bold text-orange-600 mt-2">
                {data.issues}
              </p>
            </div>

            {/* Size Card */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 transition transform duration-200">
              <h3 className="text-gray-500">Repository Size 📦</h3>
              <p className="text-xl font-bold text-red-600 mt-2">
                {data.size} KB
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;