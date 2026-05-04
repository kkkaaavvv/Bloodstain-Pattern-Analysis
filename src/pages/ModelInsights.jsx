import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ModelInsights() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);

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
    <div
      className="min-h-screen text-white px-6 py-10 bg-cover bg-center relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/blood-bg.jpg')",
      }}
    >
      {/* 🔴 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/75 -z-10"></div>

      {/* 🔴 RED GLOW */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute right-[-200px] top-1/4 w-[650px] h-[650px]
                     bg-[#7F1F0E] rounded-full blur-[170px] opacity-30"
        ></div>

        <div
          className="absolute left-[-200px] bottom-0 w-[550px] h-[550px]
                     bg-[#3D0A05] rounded-full blur-[150px] opacity-25"
        ></div>
      </div>

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="text-gray-100 hover:text-white mb-6 text-sm"
      >
        ← Back to Home
      </button>

      <div className="w-full px-4 md:px-10 space-y-14">

        {/* 🧠 TITLE */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center text-white drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Model Insights
        </motion.h1>

        {/* 📌 INFO SECTION */}
        <motion.div
          className="bg-white/10 border border-white/10 rounded-2xl p-8 
                     text-gray-200 text-base md:text-lg backdrop-blur-xl 
                     text-center leading-relaxed max-w-5xl mx-auto shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          This section provides performance insights of the YOLOv8 model used
          for bloodstain detection and classification. Metrics such as Precision,
          Recall, mAP@0.5, and F1 Score help evaluate the detection reliability,
          while training graphs and confusion matrices provide deeper insight
          into model behavior and prediction quality.
        </motion.div>

        {/* 📊 METRICS */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {metrics.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 border border-white/10 rounded-2xl p-8 
                         text-center backdrop-blur-xl
                         hover:border-[#7F1F0E]/50
                         hover:shadow-[0_0_25px_rgba(127,31,14,0.25)]
                         transition"
            >
              <p className="text-gray-300 text-sm uppercase tracking-wide">
                {item.label}
              </p>

              <p className="text-2xl md:text-3xl font-bold mt-3">
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* 📈 IMAGES */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="bg-white/10 border border-white/10 rounded-2xl p-5 
                         backdrop-blur-xl cursor-pointer
                         hover:border-[#7F1F0E]/50
                         hover:shadow-[0_0_30px_rgba(127,31,14,0.2)]
                         transition"
              onClick={() => setPreviewImage(img.src)}
            >
              <p className="text-sm text-gray-300 mb-4 text-center">
                {img.title}
              </p>

              <img
                src={img.src}
                alt={img.title}
                className="w-full rounded-xl"
              />

              <p className="text-center text-sm text-gray-400 italic mt-4">
                Click on the image to zoom
              </p>
            </div>
          ))}
        </motion.div>

      </div>

      {/* 🔍 IMAGE PREVIEW MODAL */}
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

export default ModelInsights;