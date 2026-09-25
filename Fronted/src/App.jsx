import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Explore from "./Pages/Explore"
import Navbar from "./Component/Navbar"
import Planmytrip from "./Pages/Planmytrip"
import Aiguides from "./Pages/Aiguides"
import Mytrip from "./Pages/Mytrip"
import About from "./Pages/About"
import Placemap from "./Pages/Placemap"
import Review from "./Pages/Review"


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} /> //jas page 1
        <Route path="/Explore" element={<Explore />} /> //jas page 2
        <Route path="/plan-my-trip" element={<Planmytrip />} /> //place detail page 3

        <Route path="/ai-guides" element={<Aiguides />} /> //sun page 5

        <Route path="/my-trip" element={<Mytrip />} /> //naveen page 4
        <Route path="/place-map" element={<Placemap />} /> //naveen page 6
        <Route path="/review" element={<Review />} /> // naveen page 7

        <Route path="/about" element={<About />} /> //naveen
      </Routes>
    </div>
  )
}

export default App