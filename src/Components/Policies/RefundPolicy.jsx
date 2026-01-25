import Navbar from "../Pages/Navbar"
import Footer from "../Pages/Footer";
export default function RefundPolicy() {
  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-bg-main px-4 pt-12 pb-4 ">
      <div className="max-w-4xl mx-auto bg-bg-surface p-8 rounded-xl border border-border shadow-sm">
        <h1 className="text-3xl font-semibold text-text-primary mb-6">
          Refund & Cancellation Policy
        </h1>

        <p className="text-text-secondary mb-4">
          At Prana Elixir, customer satisfaction is our priority. Please read our
          refund and cancellation policy carefully before making a purchase.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Order Cancellation
        </h2>
        <p className="text-text-secondary mb-4">
          Orders can be cancelled within 24 hours of placing the order, provided
          the order has not yet been shipped. Once shipped, cancellations are not
          permitted.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Refunds
        </h2>
        <p className="text-text-secondary mb-4">
          Refunds are applicable only for damaged, defective, or incorrect
          products. In such cases, please contact us within 48 hours of delivery
          with proof of the issue.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Processing Time
        </h2>
        <p className="text-text-secondary mb-4">
          Approved refunds will be processed within 5–7 business days and credited
          to the original mode of payment.
        </p>

        <h2 className="text-xl font-medium text-text-primary mt-6 mb-2">
          Contact
        </h2>
        <p className="text-text-secondary">
          For refund related queries, contact us at{" "}
          <span className="text-text-primary font-medium">support@pranaelixir.com</span>.
        </p>
      </div>
    </div>
    <Footer />
    </div>
  );
}
