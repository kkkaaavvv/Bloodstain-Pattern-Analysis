function ImageDisplay({ image, results }) {
  if (!image) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

      {/* Original */}
      <div className="flex flex-col items-center">
        <h3 className="text-sm text-gray-400 mb-2">Original</h3>
        <img
          src={URL.createObjectURL(image)}
          alt="Original"
          className="max-h-80 border border-white/10 rounded-lg"
        />
      </div>

      {/* Processed */}
      <div className="flex flex-col items-center">
        <h3 className="text-sm text-gray-400 mb-2">Processed</h3>

        {results?.image ? (
          <img
            src={`http://127.0.0.1:5000/result/${results.image}`}
            alt="Processed"
            className="max-h-80 border border-white/10 rounded-lg"
          />
        ) : (
          <p className="text-gray-500 text-sm">No result yet</p>
        )}
      </div>

    </div>
  );
}

export default ImageDisplay;