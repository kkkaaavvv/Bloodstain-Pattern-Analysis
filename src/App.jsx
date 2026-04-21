import { useState } from "react";

function App() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null); // reset old result
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white flex flex-col items-center px-6 py-10">

      {/* TITLE */}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-wide mb-4 text-center">
        Bloodstain Pattern Analysis
      </h1>

      {/* INTRO */}
      <p className="max-w-2xl text-center text-gray-300 mb-10 leading-relaxed">
        This forensic analysis system assists investigators in examining bloodstain
        patterns from crime scene imagery. Upload an image to begin analysis.
      </p>

      {/* ================= UPLOAD CARD ================= */}
      <div className="w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-10 text-center shadow-2xl mb-10">

        <h2 className="text-xl font-medium mb-6 tracking-wide">
          Upload Evidence Image
        </h2>

        <label className="cursor-pointer">
          <div className="border-2 border-dashed border-red-400/40 hover:border-red-400 transition p-10 rounded-xl">
            <p className="text-gray-400">
              Click to select crime scene image
            </p>
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </label>

        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            className="mt-8 rounded-xl border border-white/20"
          />
        )}

        {/* ANALYZE BUTTON */}
        <button
          onClick={handleAnalyze}
          className="mt-6 bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

      </div>

      {/* ================= RESULT SECTION ================= */}
      <div className="w-full max-w-4xl bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-2xl">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Analysis Results
        </h2>

        {!result && (
          <p className="text-center text-gray-400">
            Upload an image and click Analyze to view results
          </p>
        )}

        {result && (
          <div className="text-center">

            {/* Stats */}
            <p>Total Stains: {result.summary.total_stains}</p>
            <p>Mean Angle: {result.summary.mean_angle}°</p>

            {/* Output Image */}
            <img
              src={`http://127.0.0.1:5000/result/${result.image}`}
              alt="result"
              className="mt-6 rounded-xl border border-white/20"
            />

          </div>
        )}

      </div>

    </div>
  );
}

export default App;