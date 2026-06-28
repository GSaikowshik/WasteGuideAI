import { FaRecycle, FaMapMarkerAlt } from "react-icons/fa";
import { MdDangerous } from "react-icons/md";
import { HiChartBar } from "react-icons/hi";

import FeatureCard from "./FeatureCard";

function Features() {

  return (

    <section className="max-w-6xl mx-auto py-16 px-6">

      <h2 className="text-4xl font-bold text-center mb-10">

        Features

      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        <FeatureCard
          icon={<FaRecycle className="mx-auto text-green-600" />}
          title="AI Classification"
          text="Instant waste categorization using AI."
        />

        <FeatureCard
          icon={<MdDangerous className="mx-auto text-red-500" />}
          title="Hazard Detection"
          text="Identify hazardous waste safely."
        />

        <FeatureCard
          icon={<FaMapMarkerAlt className="mx-auto text-blue-600" />}
          title="Collection Centers"
          text="Locate nearby recycling centers."
        />

        <FeatureCard
          icon={<HiChartBar className="mx-auto text-purple-600" />}
          title="Analytics"
          text="Track waste disposal habits."
        />

      </div>

    </section>

  );

}

export default Features;