import { useState, useRef, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function Analyzer() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();
  const resultsRef = useRef(null);

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

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [results]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="min-h-screen text-white px-6 py-10 bg-cover bg-center relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/blood-bg.jpg')",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/75 -z-10"></div>

      {/* RED GLOW */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute right-[-150px] top-1/3 w-[500px] h-[500px]
                     bg-[#7F1F0E] rounded-full blur-[140px] opacity-30"
        ></div>

        <div
          className="absolute left-[-150px] bottom-0 w-[400px] h-[400px]
                     bg-[#3D0A05] rounded-full blur-[120px] opacity-25"
        ></div>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="text-gray-100 hover:text-white mb-6 text-sm"
      >
        ← Back to Home
      </button>

      <div className="w-full px-4 md:px-10 space-y-12">

        {/* TITLE */}
        <h1 className="text-5xl md:text-6xl font-bold text-center text-white drop-shadow-lg">
          Bloodstain Analysis
        </h1>

        {/* INFO */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-8 
                        text-gray-200 text-base md:text-lg backdrop-blur-xl 
                        text-center leading-relaxed max-w-4xl mx-auto shadow-xl">
          Upload an image to analyze bloodstain patterns.
          The system processes the image through grayscale conversion,
          thresholding, contour detection, ellipse fitting, and trajectory reconstruction.
        </div>

        {/* UPLOAD */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-10 
                        backdrop-blur-xl text-center space-y-6 
                        max-w-3xl mx-auto shadow-[0_0_30px_rgba(127,31,14,0.15)]">

          <ImageUpload onImageSelect={setImage} />

          {image && (
            <p className="text-sm text-gray-300">
              Selected file: <span className="text-white">{image.name}</span>
            </p>
          )}

          {image && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleAnalyze}
                className="px-8 py-3 text-lg bg-[#7F1F0E] rounded-lg
                           hover:bg-[#a12a15]
                           shadow-[0_0_20px_rgba(127,31,14,0.5)]
                           transition"
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
          <div ref={resultsRef} className="space-y-16">

            {/* PROCESSING PIPELINE */}
            <div>
              <h2 className="text-3xl font-semibold mb-8 text-center">
                Processing Pipeline
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {Object.entries(results.steps || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white/10 border border-white/10 rounded-xl p-4 
                               text-center backdrop-blur-xl cursor-pointer
                               hover:border-[#7F1F0E]/50 transition"
                    onClick={() => setPreviewImage(value)}
                  >
                    <p className="text-sm text-gray-300 mb-3 capitalize">
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

            {/* FINAL ANALYSIS */}
            <div>
              <h2 className="text-3xl font-semibold mb-10 text-center">
                Final Analysis
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* FINAL IMAGE */}
                {results.final_image && (
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={results.final_image}
                      alt="Final Result"
                      className="w-full max-w-xl rounded-xl border border-white/10 
                                 shadow-lg cursor-pointer hover:scale-[1.01] transition"
                      onClick={() => setPreviewImage(results.final_image)}
                    />

                    <p className="text-sm text-gray-300 italic">
                      Click on the image to zoom
                    </p>

                    {image && (
                      <p className="text-sm text-gray-300">
                        Source: <span className="text-white font-medium">{image.name}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* FORENSIC REPORT */}
                <div className="space-y-6">

                  {/* CASE INFO */}
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">

                      <div>
                        <p className="text-sm text-gray-400">Case ID</p>
                        <p className="text-lg font-semibold text-white">
                          BPA-2026-014
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Generated On</p>
                        <p className="text-lg font-semibold text-white">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* REAL QUICK STATS */}
                  <div className="grid grid-cols-2 gap-4">

                    {results.total_stains && (
                      <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-xl">
                        <p className="text-sm text-gray-400">Stains Detected</p>
                        <p className="text-2xl font-bold text-white">
                          {results.total_stains}
                        </p>
                      </div>
                    )}

                    {results.mean_angle && (
                      <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-xl">
                        <p className="text-sm text-gray-400">Mean Impact Angle</p>
                        <p className="text-2xl font-bold text-white">
                          {results.mean_angle}°
                        </p>
                      </div>
                    )}

                    {results.area_of_origin && (
                      <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-xl col-span-2">
                        <p className="text-sm text-gray-400">Area of Origin</p>
                        <p className="text-lg font-semibold text-white">
                          {results.area_of_origin}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* FINAL SUMMARY */}
                  {results.summary_text && (
                    <div className="bg-white/10 border border-white/10 rounded-2xl
                                    p-8 text-base text-gray-200
                                    whitespace-pre-line backdrop-blur-xl
                                    leading-loose shadow-[0_0_40px_rgba(127,31,14,0.15)]">

                      <h3 className="text-xl font-semibold mb-4 text-white">
                        Final Summary
                      </h3>

                      {results.summary_text}
                    </div>
                  )}

                  {/* PRINT BUTTON */}
                  <button
                    onClick={handlePrint}
                    className="px-7 py-3 rounded-xl
                               bg-white text-[#7F1F0E]
                               font-semibold
                               hover:scale-105
                               transition
                               shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  >
                    Print Report
                  </button>

                </div>

              </div>
            </div>

          </div>
        )}
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md
                     flex items-center justify-center z-50 p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="max-w-6xl w-full bg-white/10 border border-white/10
                       backdrop-blur-xl rounded-3xl p-6 md:p-8
                       shadow-[0_0_50px_rgba(127,31,14,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />

            <p className="text-center text-sm text-gray-300 mt-4">
              Click outside the box to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analyzer;