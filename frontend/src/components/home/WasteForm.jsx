import { useState } from "react";
import api from "../../services/api";

function WasteForm({ onResult }) {
  const [item, setItem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!item.trim()) return;

    try {
      const response = await api.post("/analyze", {
        item,
      });

      onResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Backend not connected");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-green-700">
        AI Waste Scanner
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex gap-4"
      >
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Example: Battery"
          className="flex-1 border rounded-xl p-4"
        />

        <button className="bg-green-600 text-white px-8 rounded-xl">
          Analyze
        </button>
      </form>
    </div>
  );
}

export default WasteForm;