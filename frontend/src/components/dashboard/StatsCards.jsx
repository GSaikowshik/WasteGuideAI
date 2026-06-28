function StatsCards({ data }) {
  const cards = [
    {
      title: "Total Scans",
      value: data.totalScans,
      color: "bg-blue-500",
    },
    {
      title: "Recyclable",
      value: data.recyclable,
      color: "bg-green-500",
    },
    {
      title: "Hazardous",
      value: data.hazardous,
      color: "bg-red-500",
    },
    {
      title: "Recycle Rate",
      value: `${data.recycleRate}%`,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} rounded-xl shadow-lg text-white p-6 text-center`}
        >
          <h2 className="text-lg">{card.title}</h2>
          <p className="text-4xl font-bold mt-3">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;