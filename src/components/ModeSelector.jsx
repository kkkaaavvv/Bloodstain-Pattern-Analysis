function ModeSelector({ mode, setMode }) {
  return (
    <div className="flex justify-center gap-4 mt-6">

      <button
        onClick={() => setMode("cv")}
        className={`px-6 py-2 rounded-lg border transition ${
          mode === "cv"
            ? "bg-white text-black"
            : "border-white/20 text-white hover:bg-white/10"
        }`}
      >
        CV Mode
      </button>

      <button
        onClick={() => setMode("yolo")}
        className={`px-6 py-2 rounded-lg border transition ${
          mode === "yolo"
            ? "bg-white text-black"
            : "border-white/20 text-white hover:bg-white/10"
        }`}
      >
        YOLO Mode
      </button>

    </div>
  );
}

export default ModeSelector;