import { useEffect, useState } from "react";
import { getHistory } from "../services/api";
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
          />
        ))
      )}
    </div>
  );
}

export default History;