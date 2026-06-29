import { useEffect, useState } from "react";
import { getHistory, deleteScan } from "../services/api";
import HistoryCard from "../components/HistoryCard";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await getHistory();
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteScan = async (scanId) => {
    if (!window.confirm("Are you sure you want to delete this scan from your history?")) return;
    try {
      const res = await deleteScan(scanId);
      if (res.success) {
        setHistory((prev) => prev.filter((item) => item.id !== scanId));
      } else {
        alert(res.message || "Failed to delete the scan.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">

      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        Scan History
      </h1>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">
          No history available.
        </p>
      ) : (
        history.map((item) => (
          <HistoryCard
            key={item.id}
            data={item}
            onDelete={handleDeleteScan}
          />
        ))
      )}
    </div>
  );
}

export default History;