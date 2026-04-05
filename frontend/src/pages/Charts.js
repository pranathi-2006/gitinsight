import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Bar } from "react-chartjs-2";

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
  const repo = localStorage.getItem("repo");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/repo?repo=${repo}`)
      .then((res) => setData(res.data));
  }, [repo]);

  if (!data) return <h2 className="text-centre mt-10 text-xl">Loading...</h2>;

  const chartData = {
  labels: [""],
  datasets: [
    {
      label: "Stars ⭐",
      data: [data.stars],
      backgroundColor: "#3b82f6",
    },
    {
      label: "Forks 🔀",
      data: [data.forks],
      backgroundColor: "#22c55e",
    },
    {
      label: "Issues 🐞",
      data: [data.issues],
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

          <div className="bg-white p-8 rounded-2xl shadow-xl w-[800px] mx-auto hover:shadow-2xl transition">

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