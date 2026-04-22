import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analyzer from "./pages/Analyzer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<Analyzer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;