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
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResults(data.result);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">

      {/* 🔴 BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-150px] top-1/3 w-[500px] h-[500px] 
                        bg-[#7F1F0E] rounded-full blur-[140px] opacity-25"></div>
        <div className="absolute left-[-150px] bottom-0 w-[400px] h-[400px] 
                        bg-[#3D0A05] rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="text-gray-400 hover:text-white mb-6 text-sm"
      >
        ← Back to Home
      </button>

      {/* 🔥 IMPORTANT: REMOVED max-w-6xl */}
      <div className="w-full px-4 md:px-10 space-y-12">

        {/* 🔥 TITLE */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#7F1F0E]">
          Bloodstain Analysis
        </h1>

        {/* 📌 INFO */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-gray-300 text-base md:text-lg backdrop-blur-md text-center leading-relaxed max-w-4xl mx-auto">
          Upload an image to analyze bloodstain patterns.  
          The system processes the image through grayscale conversion, thresholding, 
          contour detection, ellipse fitting, and trajectory reconstruction.
        </div>

        {/* 📂 UPLOAD */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-md text-center space-y-6 max-w-3xl mx-auto">

          <ImageUpload onImageSelect={setImage} />

          {image && (
            <p className="text-sm text-gray-400">
              Selected file: <span className="text-white">{image.name}</span>
            </p>
          )}

          {image && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleAnalyze}
                className="px-8 py-3 text-lg bg-[#7F1F0E] rounded-lg 
                           hover:bg-[#a12a15] 
                           shadow-[0_0_15px_rgba(127,31,14,0.5)]
                           transition"
              >
                Analyze
              </button>
            </div>
          )}

        </div>

        {/* ⏳ LOADING */}
        {loading && <Loader />}

        {/* 🧪 RESULTS */}
        {results && !loading && (
          <div className="space-y-16">

            {/* 🔬 PROCESSING PIPELINE */}
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
                Processing Pipeline
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {Object.entries(results.steps || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-md 
                               hover:border-[#7F1F0E]/40 transition"
                  >
                    <p className="text-sm text-gray-400 mb-3 capitalize">
                      {key}
                    </p>

                    <img
                      src={value}
                      alt={key}
                      className="w-full h-44 object-contain rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 🧾 FINAL ANALYSIS (ACTUAL FIX) */}
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
                Final Analysis
              </h2>

              {/* 🔥 FULL WIDTH GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start w-full">

                {/* LEFT */}
                {results.final_image && (
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <img
                      src={results.final_image}
                      alt="Final Result"
                      className="w-full max-w-xl rounded-xl border border-white/10 shadow-lg"
                    />

                    {image && (
                      <p className="text-sm text-gray-400">
                        Source: <span className="text-white">{image.name}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* RIGHT (BIG DABBA FIXED) */}
                {results.summary_text && (
                  <div className="w-full flex">

                    <div className="bg-white/5 border border-white/10 rounded-2xl 
                                    p-10 md:p-12 
                                    text-base 
                                    text-gray-300 
                                    whitespace-pre-line 
                                    backdrop-blur-md 
                                    leading-loose 
                                    shadow-[0_0_40px_rgba(127,31,14,0.2)]
                                    w-full h-full">

                      {results.summary_text}

                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Analyzer;