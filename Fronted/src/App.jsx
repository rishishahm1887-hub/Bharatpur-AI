import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Explore from "./Pages/Explore"
import Navbar from "./Component/Navbar"
import Planmytrip from "./Pages/Planmytrip"
import Aiguides from "./Pages/Aiguides"
import Mytrip from "./Pages/Mytrip"
import About from "./Pages/About"


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/Explore" element={<Explore />} />
        <Route path="/plan-my-trip" element={<Planmytrip />} />
        <Route path="/ai-guides" element={<Aiguides />} />
        <Route path="/my-trip" element={<Mytrip />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}

export default App