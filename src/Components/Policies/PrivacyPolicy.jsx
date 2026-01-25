import Navbar from "../Pages/Navbar";
import Footer from "../Pages/Footer";
export default function PrivacyPolicy() {
  return (
  
    <div>
      <Navbar />
    <div className="min-h-screen bg-bg-main px-4 pt-12 pb-4 ">
      <div className="max-w-4xl mx-auto bg-bg-surface p-8 rounded-xl border border-border shadow-sm">
        <h1 className="text-3xl font-semibold text-text-primary mb-6">
          Privacy Policy
        </h1>

        <p className="text-text-secondary mb-4">
          At Prana Elixir, we respect your privacy and are committed to protecting
          your personal information. This Privacy Policy explains how we collect,
          use, and safeguard your data when you visit or make a purchase from our
          website.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Information We Collect
        </h2>
        <p className="text-text-secondary mb-4">
          We may collect personal details such as your name, email address, phone
          number, shipping address, and payment information when you place an
          order or register on our website.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          How We Use Your Information
        </h2>
        <p className="text-text-secondary mb-4">
          Your information is used to process orders, deliver products, provide
          customer support, improve our services, and send important updates
          related to your purchases.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Data Security
        </h2>
        <p className="text-text-secondary mb-4">
          We implement appropriate security measures to protect your personal
          data. Payment information is processed securely through trusted payment
          gateways and is not stored on our servers.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Contact Us
        </h2>
        <p className="text-text-secondary">
          If you have any questions regarding this Privacy Policy, please contact
          us at <span className="text-text-primary font-medium">support@pranaelixir.com</span>.
        </p>
      </div>
    </div>
      <Footer />

    </div>
    
    
  );
}
