import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ categories }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-5">
        Waste Categories
      </h2>

      <Pie
        data={{
          labels: Object.keys(categories),
          datasets: [
            {
              data: Object.values(categories),
            },
          ],
        }}
      />

    </div>
  );
}

export default PieChart;