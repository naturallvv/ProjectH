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
    <div className="app">
      <header className="app-header">
        <NavLink to="/" className="brand" end>
          ♿ WheelTrip Jeju
        </NavLink>
        <nav className="app-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-main">
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
