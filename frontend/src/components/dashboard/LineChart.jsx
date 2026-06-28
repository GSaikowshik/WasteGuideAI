import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

function LineChart({ dailyScans }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-5">
        Daily Scan Trend
      </h2>

      <Line
        data={{
          labels: Object.keys(dailyScans),
          datasets: [
            {
              label: "Scans",
              data: Object.values(dailyScans),
            },
          ],
        }}
      />

    </div>
  );
}

export default LineChart;