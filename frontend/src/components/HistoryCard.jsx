import { FaTrashAlt } from "react-icons/fa";

function HistoryCard({ data, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition relative group">
      
      {onDelete && (
        <button
          onClick={() => onDelete(data.id)}
          className="absolute top-6 right-6 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          title="Delete scan"
        >
          <FaTrashAlt className="text-lg" />
        </button>
      )}

      <div className="flex justify-between pr-8">

        <h2 className="text-2xl font-bold capitalize text-green-700">
          {data.item}
        </h2>

        <span className="text-gray-500 text-sm">
            {data.timestamp
                ? new Date(data.timestamp).toLocaleString("en-IN")
            : "No Date"}
        </span>

      </div>

      <div className="mt-4 space-y-2">

        <p>
          <strong>Category :</strong> {data.category}
        </p>

        <p>
          <strong>Recyclable :</strong>{" "}
          {data.recyclable ? "✅ Yes" : "❌ No"}
        </p>

        <p>
          <strong>Hazard :</strong> {data.hazard}
        </p>

        <p>
          <strong>Eco Suggestion :</strong>
        </p>

        <p className="text-gray-600">
          {data.ecoSuggestion}
        </p>

      </div>

    </div>
  );
}

export default HistoryCard;