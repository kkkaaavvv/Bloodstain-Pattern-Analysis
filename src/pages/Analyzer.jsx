import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import ModeSelector from "../components/ModeSelector";
import Loader from "../components/Loader";
import ImageDisplay from "../components/ImageDisplay";
import ResultsPanel from "../components/ResultsPanel";

function Analyzer() {
  const [image, setImage] = useState(null);
  const [mode, setMode] = useState("cv");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = () => {
    if (!image) return;

    setLoading(true);
    setResults(null);

    setTimeout(() => {
      if (mode === "cv") {
        setResults({
          type: "cv",
          totalStains: 24,
          meanAngle: 32,
          maxAngle: 67,
        });
      } else {
        setResults({
          type: "yolo",
          accuracy: 91,
          precision: 88,
          recall: 85,
          f1: 86,
        });
      }

      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="w-full max-w-5xl bg-white/5 border border-white/10 rounded-2xl p-6">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Bloodstain Pattern Analyzer
        </h1>

        <ImageUpload onImageSelect={setImage} />
        <ModeSelector mode={mode} setMode={setMode} />

        {image && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAnalyze}
              className="px-6 py-2 bg-red-600 text-white rounded-lg"
            >
              Analyze
            </button>
          </div>
        )}

        {loading && <Loader />}
        {image && !loading && (
          <ImageDisplay image={image} results={results} />
        )}
        {!loading && <ResultsPanel results={results} />}

      </div>
    </div>
  );
}

export default Analyzer;