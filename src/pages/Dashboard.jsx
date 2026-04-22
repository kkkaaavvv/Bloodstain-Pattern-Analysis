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
        <div className="absolute right-[-200px] top-1/4 w-[700px] h-[700px] 
                        bg-[#7F1F0E] rounded-full blur-[180px] opacity-40"></div>
        <div className="absolute left-[-200px] bottom-0 w-[600px] h-[600px] 
                        bg-[#3D0A05] rounded-full blur-[160px] opacity-30"></div>
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
              className="px-8 py-4 text-lg bg-white/5 border border-white/10 rounded-lg 
                         hover:border-[#7F1F0E]/40 
                         hover:shadow-[0_0_15px_rgba(127,31,14,0.3)]
                         transition w-full max-w-xs"
            >
              View Model Insights
            </button>

          </div>

        </motion.div>

      </section>

      {/* 🔬 WHAT DOES THE SYSTEM DO (UPGRADED) */}
      <section className="min-h-screen flex items-center justify-center px-6">

        <motion.div
          className="max-w-5xl w-full bg-white/5 backdrop-blur-xl 
                     border border-white/10 rounded-2xl p-12 md:p-16 
                     text-center space-y-8 shadow-2xl"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <h2 className="text-3xl md:text-4xl font-semibold">
            What does this system do?
          </h2>

          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            This system performs automated bloodstain pattern analysis using a structured computer vision pipeline. 
            The input image undergoes preprocessing where it is converted to grayscale, followed by Gaussian filtering 
            to reduce noise and Otsu thresholding to generate a binary representation of stain regions.  
            Stain segmentation is achieved through contour detection, where insignificant regions are filtered using 
            a minimum area threshold. Each valid stain is then modeled using ellipse fitting techniques to extract 
            geometric parameters including centroid, major and minor axes, and orientation. Using these parameters, 
            the angle of impact is calculated through trigonometric relationships and stains are categorized based on 
            their shape characteristics. Directional vectors derived from ellipse orientations are used for trajectory 
            reconstruction, and statistical filtering is applied to estimate the most probable area of origin. 
            In addition to geometric analysis, a YOLO-based deep learning model is integrated to provide performance 
            insights, enabling evaluation through metrics such as precision, recall, and F1 score.
          </p>

        </motion.div>

      </section>

      {/* 📖 ABOUT */}
      <section className="min-h-screen flex items-center justify-center px-6">

        <motion.div
          className="max-w-3xl text-center space-y-6"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <h2 className="text-3xl font-semibold">
            About
          </h2>

          <p className="text-gray-200">
            Designed as a forensic analysis tool, this application combines classical image processing 
            techniques with machine learning to assist in understanding bloodstain behavior, trajectory 
            reconstruction, and area of origin estimation in forensic investigations.
          </p>

        </motion.div>

      </section>

    </div>
  );
}

export default Dashboard;