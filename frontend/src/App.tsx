import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecommendationPage from "./pages/RecommendationPage";
import ItineraryPage from "./pages/ItineraryPage";
import AirportPage from "./pages/AirportPage";
import DataSourceFooter from "./components/DataSourceFooter";

const navItems = [
  { to: "/", label: "홈", end: true },
  { to: "/recommendation", label: "추천", end: false },
  { to: "/itinerary", label: "일정", end: false },
  { to: "/airport", label: "공항 동선", end: false },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-brand-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
          <NavLink to="/" end className="flex items-center gap-2 no-underline">
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-brand-500 text-white text-lg shadow-sm">
              ♿
            </span>
            <span className="font-extrabold text-lg tracking-tight text-stone-800">
              WheelTrip <span className="text-brand-500">Jeju</span>
            </span>
          </NavLink>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-sm font-semibold no-underline transition-colors ${
                    isActive
                      ? "bg-brand-500 text-white shadow-sm"
                      : "text-stone-500 hover:bg-brand-50 hover:text-brand-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/airport" element={<AirportPage />} />
        </Routes>
      </main>

      <DataSourceFooter />
    </div>
  );
}
