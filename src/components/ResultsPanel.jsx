function ResultsPanel({ results }) {
  if (!results) return null;

  const summary = results.summary || {};

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Analysis Results
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

        <MetricCard
          label="Total Stains"
          value={summary.total_stains ?? "N/A"}
        />

        <MetricCard
          label="Mean Angle"
          value={
            summary.mean_angle !== undefined
              ? `${summary.mean_angle}°`
              : "N/A"
          }
        />

      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

export default ResultsPanel;