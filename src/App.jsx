import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from "./Components/Pages/Navbar"
import HeroCarousel from "./Components/Pages/HeroCarousel"
import ProductsSection from "./Components/Pages/Products"
import AboutUs from "./Components/Pages/AboutUs"
import BestSellers from "./Components/Pages/BestSellers"
import Testimonials from "./Components/Pages/Testimonials"
import Features from "./Components/Pages/Features"
import Footer from "./Components/Pages/Footer"
import BackToTop from "./Components/Elements/BackToTop"
// Admin Pages
import AdminLogin from "./Components/Admin Dashboard/AdminLogin"
import AdminDashboard from "./Components/Admin Dashboard/AdminDashboard"
// Product Pages
import Shop from './Components/Products/Shop'
import ProductDetail from './Components/Products/ProductDetail'

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
        
        {/* Product routes */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        
      </Routes>
    </Router>
  )
}

export default App