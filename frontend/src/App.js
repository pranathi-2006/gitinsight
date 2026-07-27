import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import Contributors from "./pages/Contributors";
import Compare from "./pages/Compare";
import UserAnalyzer from "./pages/UserAnalyzer";

function App() {
  return (
    <BrowserRouter>
    
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/charts" element={<Charts />} />

        <Route path="/contributors" element={<Contributors />} />

        <Route path="/compare" element={<Compare />} />

        <Route path="/user" element={<UserAnalyzer />} />

        

      </Routes>

    </BrowserRouter>
  );
}

export default App;