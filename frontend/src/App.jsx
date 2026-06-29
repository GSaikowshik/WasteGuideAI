import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Scanner from "./pages/Scanner";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Scanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </main>
        <footer className="py-6 border-t border-zinc-900 bg-zinc-950 text-center text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} WasteGuide AI. Empowering sustainable cities.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}