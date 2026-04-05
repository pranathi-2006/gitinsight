import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Contributors() {

  const [contributors, setContributors] = useState([]);
  const repo = localStorage.getItem("repo");

  useEffect(() => {

    axios
      .get(`https://gitinsight-ewxj.onrender.com/repo?repo=${repo}`)
      .then((res) => setContributors(res.data));

  }, [repo]);

  return (

    <div className="flex bg-gradient-to-br from-slate-100 to-gray-200 min-h-screen">

      <Sidebar />

      <div className="ml-[220px] w-full">

        <Navbar />

        <div className="p-10">

          <h1 className="text-3xl font-bold mb-8">
            Top Contributors 👨‍💻
          </h1>

          <div className="grid grid-cols-2 gap-6">

            {contributors.map((c, index) => (

              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >

                <h3 className="text-lg font-semibold">
                  {c.username}
                </h3>

                <p className="text-gray-500">
                  {c.contributions} contributions
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );
}

export default Contributors;