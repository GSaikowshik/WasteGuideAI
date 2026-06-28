import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";

import StatsCards from "../components/dashboard/StatsCards";
import PieChart from "../components/dashboard/PieChart";
import BarChart from "../components/dashboard/BarChart";
import LineChart from "../components/dashboard/LineChart";

function Dashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {

    async function loadDashboard() {

      const res = await getDashboard();

      setData(res.data);

    }

    loadDashboard();

  }, []);

  if (!data)
    return (
      <h1 className="text-center mt-20 text-3xl">
        Loading...
      </h1>
    );

  return (

    <div className="max-w-7xl mx-auto p-10">

      <h1 className="text-4xl font-bold text-green-700 mb-10 text-center">
        Waste Analytics Dashboard
      </h1>

      <StatsCards data={data} />

      <div className="grid lg:grid-cols-2 gap-8">

        <PieChart
          categories={data.categories}
        />

        <BarChart
          categories={data.categories}
        />

      </div>

      <div className="mt-10">

        <LineChart
          dailyScans={data.dailyScans}
        />

      </div>

    </div>

  );
}

export default Dashboard;