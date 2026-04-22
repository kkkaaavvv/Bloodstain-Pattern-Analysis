import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ModelInsights() {
  const navigate = useNavigate();

  const metrics = [
    { label: "Precision", value: "74%" },
    { label: "Recall", value: "68%" },
    { label: "mAP@0.5", value: "71.9%" },
    { label: "F1 Score", value: "71%" },
  ];

  const images = [
    {
      src: "/runs/detect/train-3/results.png",
      title: "Training Results",
    },
    {
      src: "/runs/detect/train-3/confusion_matrix.png",
      title: "Confusion Matrix",
    },
    {
      src: "/runs/detect/train-3/BoxPR_curve.png",
      title: "Precision-Recall Curve",
    },
    {
      src: "/runs/detect/train-3/BoxF1_curve.png",
      title: "F1 Curve",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">

      {/* 🔴 BACKGROUND GLOW (same vibe as homepage) */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-200px] top-1/4 w-[600px] h-[600px] 
                        bg-[#7F1F0E] rounded-full blur-[160px] opacity-30"></div>
        <div className="absolute left-[-200px] bottom-0 w-[500px] h-[500px] 
                        bg-[#3D0A05] rounded-full blur-[140px] opacity-25"></div>
      </div>

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="text-gray-400 hover:text-white mb-6"
      >
        ← Back to Home
      </button>

      <div className="max-w-6xl mx-auto space-y-12">

        {/* 🧠 TITLE */}
        <motion.h1
          className="text-3xl md:text-4xl font-semibold text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Model Insights
        </motion.h1>

        {/* 📊 METRICS */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {metrics.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-md 
                         hover:border-[#7F1F0E]/40 
                         hover:shadow-[0_0_15px_rgba(127,31,14,0.3)]
                         transition"
            >
              <p className="text-gray-400 text-sm">{item.label}</p>
              <p className="text-xl font-semibold mt-2">{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* 📈 IMAGES */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md 
                         hover:shadow-[0_0_20px_rgba(127,31,14,0.25)]
                         transition"
            >
              <p className="text-sm text-gray-400 mb-3 text-center">
                {img.title}
              </p>

              <img
                src={img.src}
                alt={img.title}
                className="w-full h-auto rounded"
              />
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}

export default ModelInsights;