import './App.css'
import {BrowserRouter , Routes, Route} from "react-router-dom"
// dashboard pages
import {PlatformLandingPage,EventDirectory, MainOprationDashboard} from "./pages"
// form pages
import {UserSignup, UserLogin} from "./pages"
// others pages 
import {PageNotFound} from "./pages"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlatformLandingPage />} />
        <Route path="/dashboard" element={<MainOprationDashboard />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
