import { useState, useEffect } from "react";
import { scanWaste, getHistory } from "../services/api";
import { 
  FaSearch, FaSpinner, FaHistory, FaCheckCircle, 
  FaTimesCircle, FaExclamationTriangle, FaLeaf, 
  FaTrashAlt, FaRecycle, FaArrowRight 
} from "react-icons/fa";

export default function Scanner() {
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  // Fetch scan history on load
  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error("Failed to load scan history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!item.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await scanWaste(item);
      if (data.success) {
        setResult(data.data);
        setItem("");
        fetchHistory(); // Refresh scan list
      } else {
        setError(data.message || "Unable to analyze the waste item.");
      }
    } catch (err) {
      setError("Failed to connect to the backend server. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  // Get color themes dynamically based on category
  const getCategoryStyles = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("plastic")) {
      return {
        bg: "from-blue-600/10 to-indigo-500/10 border-blue-500/20",
        text: "text-blue-400",
        badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        iconColor: "text-blue-400"
      };
    }
    if (cat.includes("paper") || cat.includes("cardboard")) {
      return {
        bg: "from-amber-600/10 to-orange-500/10 border-amber-500/20",
        text: "text-amber-400",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        iconColor: "text-amber-400"
      };
    }
    if (cat.includes("organic") || cat.includes("food")) {
      return {
        bg: "from-green-600/10 to-emerald-500/10 border-green-500/20",
        text: "text-emerald-400",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        iconColor: "text-emerald-400"
      };
    }
    if (cat.includes("hazardous") || cat.includes("e-waste") || cat.includes("battery")) {
      return {
        bg: "from-red-600/10 to-rose-500/10 border-red-500/20",
        text: "text-rose-400",
        badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        iconColor: "text-rose-400"
      };
    }
    if (cat.includes("glass")) {
      return {
        bg: "from-teal-600/10 to-cyan-500/10 border-teal-500/20",
        text: "text-teal-400",
        badge: "bg-teal-500/20 text-teal-300 border-teal-500/30",
        iconColor: "text-teal-400"
      };
    }
    // Default / general waste
    return {
      bg: "from-zinc-700/20 to-slate-800/10 border-zinc-700/30",
      text: "text-zinc-400",
      badge: "bg-zinc-800 text-zinc-300 border-zinc-700",
      iconColor: "text-zinc-400"
    };
  };

  const currentStyle = result ? getCategoryStyles(result.category) : {};

  return (
    <div className="space-y-12">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
          AI Waste Scanner
        </h1>
        <p className="text-zinc-400 text-lg">
          Type any item below, and our AI will provide instant, eco-friendly disposal and recycling instructions.
        </p>
      </div>

      {/* Input bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleScan} className="relative flex items-center">
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            disabled={loading}
            placeholder="Search e.g., plastic water bottle, alkaline battery..."
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl py-4 pl-6 pr-32 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600 text-lg shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !item.trim()}
            className="absolute right-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FaSpinner className="animate-spin text-lg" /> : <FaSearch />}
            <span>Scan</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm text-center flex items-center justify-center gap-2">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Scan Results Layout */}
      {result && (
        <div className={`max-w-3xl mx-auto border rounded-3xl p-6 md:p-8 bg-gradient-to-br ${currentStyle.bg} shadow-2xl transition-all duration-500 animate-fadeIn`}>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Scan Results</span>
              <h2 className="text-3xl font-black capitalize text-white">{result.item}</h2>
            </div>
            <div className="flex gap-2">
              <span className={`px-4 py-1.5 rounded-full border text-xs font-bold ${currentStyle.badge}`}>
                {result.category}
              </span>
              {result.recyclable ? (
                <span className="px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <FaCheckCircle className="text-xs" /> Recyclable
                </span>
              ) : (
                <span className="px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1">
                  <FaTimesCircle className="text-xs" /> Non-Recyclable
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: Instructions */}
            <div className="space-y-6">
              {/* Disposal Steps */}
              <div className="space-y-3">
                <h3 className="text-zinc-300 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <FaTrashAlt className="text-zinc-500 text-xs" /> Correct Disposal Steps
                </h3>
                <ol className="space-y-2">
                  {result.disposalSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-zinc-400 text-sm leading-relaxed">
                      <span className={`font-mono font-bold ${currentStyle.text} text-xs mt-0.5 bg-zinc-900/80 border border-zinc-800 h-5 w-5 rounded-full flex items-center justify-center shrink-0`}>
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Recycling Rules */}
              <div className="space-y-3">
                <h3 className="text-zinc-300 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <FaRecycle className="text-zinc-500 text-xs" /> Recycling Guidelines
                </h3>
                <ul className="space-y-2">
                  {result.recyclingInstructions.map((inst, idx) => (
                    <li key={idx} className="flex gap-2.5 text-zinc-400 text-sm leading-relaxed">
                      <FaArrowRight className={`shrink-0 text-[10px] mt-1.5 ${currentStyle.text}`} />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Hazards and Alternatives */}
            <div className="space-y-6">
              {/* Hazards warning */}
              {result.hazard && result.hazard.toLowerCase() !== "none" && (
                <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-2">
                  <h4 className="text-red-400 font-bold text-sm flex items-center gap-2">
                    <FaExclamationTriangle /> Hazard Warnings
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">{result.hazard}</p>
                </div>
              )}

              {/* Eco Suggestion */}
              <div className="p-5 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 space-y-3">
                <h4 className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                  <FaLeaf /> Eco-friendly Tip
                </h4>
                <p className="text-zinc-400 text-xs leading-relaxed italic">
                  "{result.ecoSuggestion}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h3 className="text-lg font-bold text-zinc-300 flex items-center gap-2 border-b border-zinc-900 pb-3">
          <FaHistory className="text-zinc-500" /> Recent Scans History
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-900 rounded-2xl">
            <p className="text-zinc-600 text-sm">No items scanned yet. Start scanning above!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {history.slice(0, 6).map((scan) => {
              const style = getCategoryStyles(scan.category);
              return (
                <div 
                  key={scan.id} 
                  className="bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 group hover:bg-zinc-900/50 cursor-pointer"
                  onClick={() => setResult(scan)}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                      {scan.category}
                    </span>
                    <h4 className="font-bold text-zinc-200 capitalize group-hover:text-white transition-colors">
                      {scan.item}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2 border-t border-zinc-900/80 pt-3">
                    <span className="text-zinc-600">
                      {scan.timestamp ? new Date(scan.timestamp).toLocaleDateString() : ""}
                    </span>
                    {scan.recyclable ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <FaCheckCircle className="text-[10px]" /> Recyclable
                      </span>
                    ) : (
                      <span className="text-zinc-500 font-semibold flex items-center gap-1">
                        <FaTimesCircle className="text-[10px]" /> Trash
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
