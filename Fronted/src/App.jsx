import {
  Route,
  Routes,
} from "react-router-dom";

import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import Navbar from "./Component/Navbar";
import Planmytrip from "./Pages/Planmytrip";
import Aiguides from "./Pages/Aiguides";
import Mytrip from "./Pages/Mytrip";
import About from "./Pages/About";
import Placemap from "./Pages/Placemap";
import Review from "./Pages/Review";

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Explore */}
        <Route
          path="/explore"
          element={<Explore />}
        />

        {/* Plan my trip */}
        <Route
          path="/plan-my-trip"
          element={<Planmytrip />}
        />

        {/* AI Guides */}
        <Route
          path="/ai-guides"
          element={<Aiguides />}
        />

        {/* My Trip */}
        <Route
          path="/my-trip"
          element={<Mytrip />}
        />

        {/* Map */}
        <Route
          path="/place-map"
          element={<Placemap />}
        />

        {/* Map for specific MongoDB place */}
        <Route
          path="/places/:id/map"
          element={<Placemap />}
        />

        {/* Review */}
        <Route
          path="/review"
          element={<Review />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />

      </Routes>
    </div>
  );
};

export default App;