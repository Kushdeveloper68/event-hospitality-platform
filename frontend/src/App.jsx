import './App.css'
import {BrowserRouter , Routes, Route} from "react-router-dom"
import {UserSignup, UserLogin, PageNotFound} from "./pages"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
