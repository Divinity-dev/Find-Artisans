export function WorkerCard({ worker }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{worker.name}</h3>
      <p className="text-gray-600">{worker.skill}</p>
      <p className="text-sm text-gray-500">📍 {worker.location}</p>
      <p className="text-yellow-500">⭐ {worker.rating}</p>

      <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
        Hire Now
      </button>
    </div>
  );
}