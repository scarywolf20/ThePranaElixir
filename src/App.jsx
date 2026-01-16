import Navbar from "./Components/Navbar"
import HeroCarousel from "./Components/HeroCarousel"
import ProductsSection from "./Components/Products"
import AboutUs from "./Components/AboutUs"
import BestSellers from "./Components/BestSellers"
import Testimonials from "./Components/Testimonials"
import Features from "./Components/Features"
import Footer from "./Components/Footer"
function App() {
  return (
    <div>
      <Navbar />
      <HeroCarousel />
      <Features />
      <ProductsSection />
      <AboutUs />
      <BestSellers />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default App
