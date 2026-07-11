import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Features from './pages/Features'
import Demo from './pages/Demo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App