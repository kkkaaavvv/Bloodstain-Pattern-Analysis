import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/blood-bg.jpg')",
      }}
    >
      {/* 🔴 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70 -z-10"></div>

      {/* 🔴 RED GLOW */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute right-[-200px] top-1/4 w-[700px] h-[700px]
                     bg-[#7F1F0E] rounded-full blur-[180px] opacity-40"
        ></div>

        <div
          className="absolute left-[-200px] bottom-0 w-[600px] h-[600px]
                     bg-[#3D0A05] rounded-full blur-[160px] opacity-30"
        ></div>
      </div>

      {/* 🧊 HERO */}
      <section className="h-screen flex items-center justify-center px-6 text-center">

        <motion.div
          className="space-y-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-sm text-gray-100 tracking-widest">
            FORENSIC ANALYSIS
          </p>

          <h1 className="text-[3rem] md:text-[6rem] lg:text-[7rem] font-bold leading-tight">
            Bloodstain <br />
            Pattern Analysis
          </h1>

          {/* 🔥 BUTTONS */}
          <div className="flex flex-col gap-4 items-center">

            <button
              onClick={() => navigate("/analyze")}
              className="mt-4 px-8 py-4 text-lg bg-[#7F1F0E] rounded-lg
                         hover:bg-[#a12a15] transition shadow-lg w-full max-w-xs"
            >
              Start Analysis →
            </button>

            <button
              onClick={() => navigate("/insights")}
              className="px-8 py-4 text-lg bg-white/10 border border-white/10 rounded-lg
                         hover:border-[#7F1F0E]/40
                         hover:shadow-[0_0_15px_rgba(127,31,14,0.3)]
                         transition w-full max-w-xs"
            >
              View Model Insights
            </button>

          </div>
        </motion.div>

      </section>

      {/* 🔬 WHAT DOES THE SYSTEM DO */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">

        <motion.div
          className="max-w-5xl w-full text-center space-y-8 mb-16"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold">
            What does this system do?
          </h2>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            This system performs automated bloodstain pattern analysis using
            computer vision and machine learning techniques to detect stains,
            estimate impact angles, reconstruct trajectories, and provide
            forensic insights for crime scene reconstruction.
          </p>
        </motion.div>

        {/* 🔥 FEATURE BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">

          {/* BOX 1 */}
          <motion.div
            className="bg-white/10 border border-white/10 rounded-2xl p-8
                       backdrop-blur-xl shadow-[0_0_30px_rgba(127,31,14,0.15)]
                       hover:border-[#7F1F0E]/50 transition"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4">
              🔬 Detection Pipeline
            </h3>

            <p className="text-gray-300 leading-relaxed">
              The system processes the uploaded image using computer vision
              techniques such as grayscale conversion, Gaussian filtering, and
              thresholding to isolate bloodstain regions. It then detects
              individual stains using contour-based segmentation while filtering
              out irrelevant noise.
            </p>
          </motion.div>

          {/* BOX 2 */}
          <motion.div
            className="bg-white/10 border border-white/10 rounded-2xl p-8
                       backdrop-blur-xl shadow-[0_0_30px_rgba(127,31,14,0.15)]
                       hover:border-[#7F1F0E]/50 transition"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4">
              📐 Geometric Analysis
            </h3>

            <p className="text-gray-300 leading-relaxed">
              Each detected stain is modeled using ellipse fitting to extract
              geometric features like shape, size, centroid, and orientation.
              These parameters are used to calculate the angle of impact and
              classify stains as circular, elliptical, or elongated based on
              their physical characteristics.
            </p>
          </motion.div>

          {/* BOX 3 */}
          <motion.div
            className="bg-white/10 border border-white/10 rounded-2xl p-8
                       backdrop-blur-xl shadow-[0_0_30px_rgba(127,31,14,0.15)]
                       hover:border-[#7F1F0E]/50 transition"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4">
              📊 Trajectory & Insights
            </h3>

            <p className="text-gray-300 leading-relaxed">
              Using stain orientation, the system reconstructs blood
              trajectories to estimate the probable area of origin.
              Additionally, a YOLO-based model provides performance insights
              through metrics such as precision, recall, mAP, and F1 score,
              enhancing analytical understanding.
            </p>
          </motion.div>

        </div>

      </section>

      {/* 📖 ABOUT */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">

        <motion.div
          className="max-w-5xl w-full bg-white/10 border border-white/10
                     rounded-2xl p-12 md:p-16 backdrop-blur-xl
                     text-center space-y-8
                     shadow-[0_0_35px_rgba(127,31,14,0.15)]"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold">
            About
          </h2>

          <p className="text-gray-200 text-base md:text-lg leading-relaxed">
            Designed as a forensic analysis tool, this application combines
            classical image processing techniques with machine learning to assist
            in understanding bloodstain behavior, trajectory reconstruction, and
            area of origin estimation during forensic investigations.
          </p>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            By integrating computer vision with YOLO-based model evaluation,
            the system not only performs analytical reconstruction but also
            provides measurable performance insights, making it both an
            investigative and research-oriented platform for bloodstain pattern
            analysis.
          </p>
        </motion.div>

      </section>

    </div>
  );
}

export default Dashboard;