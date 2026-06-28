import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);

function BarChart({ categories }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-5">
        Category Count
      </h2>

      <Bar
        data={{
          labels: Object.keys(categories),
          datasets: [
            {
              label: "Items",
              data: Object.values(categories),
            },
          ],
        }}
      />

    </div>
  );
}

export default BarChart;