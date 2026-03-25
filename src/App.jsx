import { useState } from "react";

function App() {

  const [preview, setPreview] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if(file){
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white flex flex-col items-center justify-center px-6">

      {/* TITLE */}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-wide mb-4">
        Bloodstain Pattern Analysis
      </h1>

      {/* INTRO */}
      <p className="max-w-2xl text-center text-gray-300 mb-12 leading-relaxed">
        This forensic analysis system assists investigators in examining bloodstain
        patterns from crime scene imagery. Using computer vision and machine learning,
        the system enhances evidence, detects stain geometry, and supports reconstruction
        of events. Upload a crime scene image below to begin the analysis process.
      </p>

      {/* UPLOAD CARD */}
      <div className="w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-10 text-center shadow-2xl">

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

        {preview && (
          <img
            src={preview}
            className="mt-8 rounded-xl border border-white/20"
          />
        )}

      </div>

    </div>
  );
}

export default App;