import Navbar from "../Pages/Navbar"
import Footer from "../Pages/Footer"; 
export default function ShippingPolicy() {
  return (
    <div>
      <Navbar />
   
    <div className="min-h-screen bg-bg-main px-6 pt-12 pb-4">
      <div className="max-w-4xl mx-auto bg-bg-surface p-8 rounded-xl border border-border shadow-sm">
        <h1 className="text-3xl font-semibold text-text-primary mb-6">
          Shipping & Delivery Policy
        </h1>

        <p className="text-text-secondary mb-4">
          Prana Elixir delivers products across India through reliable courier
          partners to ensure safe and timely delivery.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Shipping Time
        </h2>
        <p className="text-text-secondary mb-4">
          Orders are processed within 1–2 business days. Delivery usually takes
          4–7 business days depending on your location.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Shipping Charges
        </h2>
        <p className="text-text-secondary mb-4">
          Shipping charges, if applicable, will be clearly displayed during
          checkout before payment confirmation.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Delivery Issues
        </h2>
        <p className="text-text-secondary">
          If your order is delayed, damaged, or lost in transit, please contact
          us immediately at{" "}
          <span className="text-text-primary font-medium">support@pranaelixir.com</span>.
        </p>
      </div>
    </div>

    <Footer />
    </div>
  );
}
