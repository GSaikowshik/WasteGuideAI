import { useState } from "react";

import Hero from "../components/home/Hero";
import WasteForm from "../components/home/WasteForm";
import WasteResult from "../components/home/WasteResult";
import Features from "../components/home/Features";
import Stats from "../components/home/Stats";

function Home() {
  const [result, setResult] = useState(null);

  return (
    <>
      <Hero />

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <WasteForm onResult={setResult} />

        {result && (
          <WasteResult result={result} />
        )}
      </div>

      <Features />

      <Stats />
    </>
  );
}

export default Home;