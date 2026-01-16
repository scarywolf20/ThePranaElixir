import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from "./Components/Navbar"
import HeroCarousel from "./Components/HeroCarousel"
import ProductsSection from "./Components/Products"
import AboutUs from "./Components/AboutUs"
import BestSellers from "./Components/BestSellers"
import Testimonials from "./Components/Testimonials"
import Features from "./Components/Features"
import Footer from "./Components/Footer"
import BackToTop from "./Components/BackToTop" 
import AdminLogin from "./Components/Admin Dashboard/AdminLogin"
import AdminDashboard from "./Components/Admin Dashboard/admin"

function App() {
  return (
    <Router>
      <Routes>
        {/* Main website route */}
        <Route path="/" element={
          <div className="relative">
            <Navbar />
            <HeroCarousel />
            <Features />
            <ProductsSection />
            <AboutUs />
            <BestSellers />
            <Testimonials />
            <Footer />
            <BackToTop />
          </div>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App