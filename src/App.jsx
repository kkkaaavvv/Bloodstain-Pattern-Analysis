import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analyzer from "./pages/Analyzer";
import ModelInsights from "./pages/ModelInsights"; // ✅ NEW

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<Analyzer />} />
        <Route path="/insights" element={<ModelInsights />} /> {/* ✅ NEW */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;