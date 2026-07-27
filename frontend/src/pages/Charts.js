import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Bar } from "react-chartjs-2";
import { useLocation } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Charts() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const repo = location.state?.repo || localStorage.getItem("repo");

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    // ❌ if repo missing
    if (!repo) {
      console.log("No repo found ❌");
      setLoading(false);
      return;
    }

    axios
      .get(`${BASE_URL}/repo?repo=${repo}`)
      .then((res) => {
        console.log("Charts data:", res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Charts error:", err.message);
        setData(null);
        setLoading(false);
      });
  }, [repo, BASE_URL]);

  // ✅ Loading state
  if (loading) {
    return <h2 className="text-center mt-10 text-xl">Loading...</h2>;
  }

  // ❌ No repo
  if (!repo) {
    return <h2 className="text-center mt-10 text-xl">No repo selected ❌</h2>;
  }

  // ❌ No data
  if (!data) {
    return <h2 className="text-center mt-10 text-xl">No data found ❌</h2>;
  }

  const chartData = {
    labels: ["Stats"],
    datasets: [
      {
        label: "Stars ⭐",
        data: [data.stars ?? 0],
        backgroundColor: "#3b82f6",
      },
      {
        label: "Forks 🔀",
        data: [data.forks ?? 0],
        backgroundColor: "#22c55e",
      },
      {
        label: "Issues 🐞",
        data: [data.issues ?? 0],
        backgroundColor: "#ef4444",
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex bg-gradient-to-br from-slate-100 to-gray-200 min-h-screen">

      <Sidebar />

      <div className="ml-[220px] w-full">

        <Navbar />

        <div className="p-10">

          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-left">
            Repository Analytics 📊
          </h1>

          <div className="bg-white p-8 rounded-2xl shadow-xl w-[800px] mx-auto">

            <h2 className="text-xl font-semibold text-gray-600 mb-6 text-center">
              Repository Statistics
            </h2>

            <Bar data={chartData} options={options} height={120} />

          </div>

        </div>

      </div>

    </div>
  );
}

export default Charts;