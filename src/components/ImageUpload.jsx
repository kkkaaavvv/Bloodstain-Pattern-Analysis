import { useState } from "react";

function ImageUpload({ onImageSelect }) {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);

      setPreview(imageURL);

      // ✅ FIX: send actual file, not preview URL
      onImageSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="text-sm text-gray-300 file:bg-white/10 file:border file:border-white/20 file:px-4 file:py-2 file:rounded-lg file:text-white hover:file:bg-white/20"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-64 h-64 object-contain border border-white/10 rounded-lg"
        />
      )}
    </div>
  );
}

export default ImageUpload;