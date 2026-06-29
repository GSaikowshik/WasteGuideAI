import { useState, useEffect } from "react";
import { getHistory } from "../services/api";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { FaRecycle, FaHistory, FaBiohazard, FaChartLine } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getHistory();
        if (res.success) {
          setHistory(res.data);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Summary Metrics calculations
  const totalScans = history.length;
  const recyclableCount = history.filter((item) => item.recyclable).length;
  const nonRecyclableCount = totalScans - recyclableCount;
  const recycleRate = totalScans ? Math.round((recyclableCount / totalScans) * 100) : 0;
  
  const hazardousCount = history.filter(
    (item) =>
      item.category.toLowerCase().includes("hazardous") || 
      item.category.toLowerCase().includes("e-waste") ||
      (item.hazard && item.hazard.toLowerCase() !== "none")
  ).length;

  // Chart 1: Doughnut Chart (Recyclable vs Non-recyclable)
  const doughnutData = {
    labels: ["Recyclable", "Non-Recyclable"],
    datasets: [
      {
        data: [recyclableCount, nonRecyclableCount],
        backgroundColor: ["#10b981", "#3f3f46"],
        borderColor: ["#059669", "#27272a"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#a1a1aa", font: { weight: "bold" } },
      },
    },
    cutout: "70%",
  };

  // Chart 2: Bar Chart (Scans by Category)
  const categoryCounts = {};
  history.forEach((h) => {
    const cat = h.category || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Scans",
        data: Object.values(categoryCounts),
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#a1a1aa" } },
      y: { grid: { color: "#27272a" }, ticks: { color: "#a1a1aa", stepSize: 1 } },
    },
  };

  // Chart 3: Line Chart (Scan Frequency over last 7 days)
  const dailyCounts = {};
  history.forEach((h) => {
    if (h.timestamp) {
      const date = new Date(h.timestamp).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    }
  });

  // Sort dates chronologically
  const sortedDates = Object.keys(dailyCounts).sort((a, b) => new Date(a) - new Date(b));

  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Daily Scans",
        data: sortedDates.map((date) => dailyCounts[date]),
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "#10b981",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#10b981",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#a1a1aa" } },
      y: { grid: { color: "#27272a" }, ticks: { color: "#a1a1aa", stepSize: 1 } },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <FaRecycle className="animate-spin text-5xl text-emerald-400" />
        <p className="text-zinc-500 font-semibold animate-pulse">Analyzing stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Analytics Dashboard</h1>
        <p className="text-zinc-400 text-sm">Real-time statistics of scanned items and community recycling metrics.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scanned */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Scanned</span>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FaHistory />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{totalScans}</div>
        </div>

        {/* Recyclable Count */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Recyclable Items</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FaRecycle />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{recyclableCount}</div>
        </div>

        {/* Recycle Rate */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Recycle Rate</span>
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <FaChartLine />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{recycleRate}%</div>
        </div>

        {/* Hazardous Count */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Hazardous Items</span>
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <FaBiohazard />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{hazardousCount}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Doughnut Chart */}
        <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-3xl p-6 flex flex-col justify-between items-center shadow-lg">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider text-center mb-6 self-start w-full border-b border-zinc-900 pb-3">
            Recyclability Split
          </h3>
          <div className="w-56 h-56 flex items-center justify-center">
            {totalScans > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <p className="text-zinc-600 text-xs">No scan data available.</p>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-3xl p-6 flex flex-col justify-between shadow-lg md:col-span-1 lg:col-span-2">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4 border-b border-zinc-900 pb-3">
            Scans by Category
          </h3>
          <div className="flex-1 h-56 flex items-center justify-center">
            {totalScans > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <p className="text-zinc-600 text-xs">No scan data available.</p>
            )}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-3xl p-6 flex flex-col justify-between shadow-lg md:col-span-2 lg:col-span-3">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4 border-b border-zinc-900 pb-3">
            Scan Activity over Time
          </h3>
          <div className="flex-1 h-56 flex items-center justify-center">
            {totalScans > 0 ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <p className="text-zinc-600 text-xs">No scan data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}