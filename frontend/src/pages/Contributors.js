import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Contributors() {

const [contributors, setContributors] = useState([]);
const repo = localStorage.getItem("repo");

useEffect(() => {


if (!repo) return; // ✅ safety

axios
  .get(`https://gitinsight-ewxj.onrender.com/contributors?repo=${repo}`)
  .then((res) => {
    // ✅ SAFE handling
    if (res.data && Array.isArray(res.data.contributors)) {
      setContributors(res.data.contributors);
    } else {
      setContributors([]);
    }
  })
  .catch((err) => {
    console.log("API Error:", err.message);
    setContributors([]); // ✅ prevent crash
  });


}, [repo]);

return ( <div className="flex bg-gradient-to-br from-slate-100 to-gray-200 min-h-screen">


  <Sidebar />

  <div className="ml-[220px] w-full">

    <Navbar />

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Top Contributors 👨‍💻
      </h1>

      <div className="grid grid-cols-2 gap-6">

        {contributors.length > 0 ? (

          contributors.map((c, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">
                {c.username || "Unknown"}
              </h3>

              <p className="text-gray-500">
                {c.contributions || 0} contributions
              </p>
            </div>

          ))

        ) : (

          <p className="text-gray-500">No contributors found</p>

        )}

      </div>

    </div>

  </div>

</div>


);
}

export default Contributors;
