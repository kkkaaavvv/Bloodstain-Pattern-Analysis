import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Bloodstain Pattern Analyzer
        </h1>

        <p className="text-gray-400">
          Analyze bloodstains using CV and YOLO models
        </p>

        <button
          onClick={() => navigate("/analyze")}
          className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Start Analysis
        </button>
      </div>

    </div>
  );
}

export default Dashboard;