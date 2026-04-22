function Loader() {
  return (
    <div className="flex justify-center items-center mt-6">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
      <span className="ml-4 text-gray-300">Processing...</span>
    </div>
  );
}

export default Loader;