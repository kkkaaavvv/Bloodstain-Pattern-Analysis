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
          className="space-y-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >

          <p className="text-sm text-gray-400 tracking-widest">
            FORENSIC ANALYSIS
          </p>

          <h1 className="text-[3rem] md:text-[6rem] lg:text-[7rem] font-bold leading-tight">
            Bloodstain <br />
            Pattern Analysis
          </h1>

          <button
            onClick={() => navigate("/analyze")}
            className="mt-6 px-8 py-4 text-lg bg-[#7F1F0E] rounded-lg 
                       hover:bg-[#a12a15] transition shadow-lg"
          >
            Start Analysis →
          </button>

        </motion.div>

      </section>

      {/* 🔬 WHAT DOES THE SYSTEM DO */}
      <section className="min-h-screen flex items-center justify-center px-6">

        <motion.div
          className="max-w-3xl w-full bg-white/5 backdrop-blur-xl 
                     border border-white/10 rounded-2xl p-10 text-center space-y-6 shadow-2xl"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <h2 className="text-3xl font-semibold">
            What does this system do?
          </h2>

          <p className="text-gray-300">
            This system analyzes bloodstain patterns using computer vision techniques. 
            It detects stains, calculates angles of impact, reconstructs trajectories, 
            and provides a detailed forensic breakdown.
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

          <p className="text-gray-400">
            Designed as a forensic analysis tool, this application combines image processing 
            techniques with analytical modeling to assist in understanding bloodstain behavior 
            and reconstruction.
          </p>

        </motion.div>

      </section>

    </div>
  );
}

export default Dashboard;