import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
function Compare() {

  const [repo1, setRepo1] = useState("");
  const [repo2, setRepo2] = useState("");
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);

  const handleCompare = async () => {

    const res1 = await axios.get(`https://gitinsight-ewxj.onrender.com/repo?repo=${repo1}`);
    const res2 = await axios.get(`https://gitinsight-ewxj.onrender.com/repo?repo=${repo2}`);

    setData1(res1.data);
    setData2(res2.data);

  };

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-gray-200">
      <Sidebar />

      <div className="ml-[220px] p-10 w-full">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Repository Comparison 🔍
        </h1>

        <div className="flex gap-4 mb-6">

          <input
            type="text"
            placeholder="Owner/repo(1)"
            value={repo1}
            onChange={(e) => setRepo1(e.target.value)}
            className="p-3 border rounded"
          />

          <input
            type="text"
            placeholder="Owner/repo(2)"
            value={repo2}
            onChange={(e) => setRepo2(e.target.value)}
            className="p-3 border rounded"
          />

          <button
            onClick={handleCompare}
            className="bg-indigo-600 text-white px-6 rounded hover:bg-indigo-700"
          >
            Compare
          </button>

        </div>

        {data1 && data2 && (

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold text-lg mb-4">{data1.name}</h2>
              <p>⭐ Stars: {data1.stars}</p>
              <p>🔀 Forks: {data1.forks}</p>
              <p>🐞 Issues: {data1.issues}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold text-lg mb-4">{data2.name}</h2>
              <p>⭐ Stars: {data2.stars}</p>
              <p>🔀 Forks: {data2.forks}</p>
              <p>🐞 Issues: {data2.issues}</p>
            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default Compare;