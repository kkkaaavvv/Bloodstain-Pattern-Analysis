function ImageDisplay({ image, results }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

      {/* Original Image */}
      <div className="flex flex-col items-center">
        <h3 className="text-sm text-gray-400 mb-2">Original</h3>
        <img
          src={image}
          alt="Original"
          className="w-full max-h-80 object-contain border border-white/10 rounded-lg"
        />
      </div>

      {/* Processed Image (Mock) */}
      <div className="flex flex-col items-center">
        <h3 className="text-sm text-gray-400 mb-2">Processed</h3>

        <div className="relative w-full max-h-80 border border-white/10 rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Processed"
            className="w-full h-full object-contain opacity-60"
          />

          {/* Fake overlay effect */}
          {results && (
            <div className="absolute inset-0 flex items-center justify-center text-red-400 text-lg font-semibold">
              {results.type === "cv" ? "Angle Detection Overlay" : "YOLO Detection Boxes"}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default ImageDisplay;