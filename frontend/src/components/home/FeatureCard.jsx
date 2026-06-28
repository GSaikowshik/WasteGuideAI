function FeatureCard({ icon, title, text }) {

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">

      <div className="text-5xl mb-4">

        {icon}

      </div>

      <h3 className="text-xl font-bold">

        {title}

      </h3>

      <p className="text-gray-600 mt-2">

        {text}

      </p>

    </div>

  );

}

export default FeatureCard;