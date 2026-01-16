import Navbar from "./Components/Navbar"
import HeroCarousel from "./Components/HeroCarousel"
import ProductsSection from "./Components/Products"
import AboutUs from "./Components/AboutUs"
import BestSellers from "./Components/BestSellers"
import Testimonials from "./Components/Testimonials"
import Features from "./Components/Features"
import Footer from "./Components/Footer"
import BackToTop from "./Components/BackToTop" 

function App() {
  return (
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
  )
}

export default App