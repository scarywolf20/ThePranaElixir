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
import Contact from "./Components/Pages/Connect"
import Story from "./Components/Pages/Story"

// Admin Pages
import AdminLogin from "./Components/Admin Dashboard/AdminLogin"
import AdminDashboard from "./Components/Admin Dashboard/AdminDashboard"
// Product Pages
import Shop from './Components/Products/Shop'
import ProductDetail from './Components/Products/ProductDetail'
//Customer Pages
import CustomerLogin from './Components/Customer/CustomerLogin'
import CustomerProfile from './Components/Customer/CustomerProfile'
//Order Routes
import Checkout from './Components/Orders/Checkout'
import OrderSuccess from './Components/Orders/OrderSuccess'

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
        
        {/* Customer routes */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        
        {/* Order routes */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        {/* Contact route */}
        <Route path="/contact" element={<Contact />} />
        {/* Story route */}
        <Route path="/story" element={<Story />} />
      </Routes>
    </Router>
  )
}

export default App