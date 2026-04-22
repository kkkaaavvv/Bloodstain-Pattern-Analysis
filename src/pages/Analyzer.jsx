import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function Analyzer() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("RESULT:", data);

      setResults(data.result);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-150px] top-1/3 w-[500px] h-[500px] 
                        bg-[#7F1F0E] rounded-full blur-[140px] opacity-25"></div>
        <div className="absolute left-[-150px] bottom-0 w-[400px] h-[400px] 
                        bg-[#3D0A05] rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="text-gray-400 hover:text-white mb-6"
      >
        ← Back to Home
      </button>

      <div className="max-w-6xl mx-auto space-y-10">

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-semibold text-center">
          Bloodstain Analysis
        </h1>

        {/* INFO */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-gray-300 text-sm backdrop-blur-md text-center">
          Upload an image to analyze bloodstain patterns.  
          The system processes the image through grayscale conversion, thresholding, 
          contour detection, ellipse fitting, and trajectory reconstruction.
        </div>

        {/* UPLOAD */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <ImageUpload onImageSelect={setImage} />

          {image && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleAnalyze}
                className="px-6 py-2 bg-[#7F1F0E] rounded-lg 
                           hover:bg-[#a12a15] transition shadow-md"
              >
                Analyze
              </button>
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading && <Loader />}

        {/* RESULTS */}
        {results && !loading && (
          <div className="space-y-10">

            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">
                Processing Pipeline
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(results.steps || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-md"
                  >
                    <p className="text-sm text-gray-400 mb-2 capitalize">
                      {key}
                    </p>

                    <img
                      src={value}
                      alt={key}
                      className="w-full h-40 object-contain rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">
                Analysis Results
              </h2>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md text-center text-gray-500">
                Results will be displayed here after processing.
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Analyzer;