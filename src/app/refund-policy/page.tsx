import LegalLayout from "@/components/LegalLayout";

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" updated="22 September 2026">
      <p>
        Because food on Biteloop is prepared fresh, on demand, by independent
        Providers, our refund and cancellation policy works differently from
        a typical retail return policy. Please read this before placing an
        order.
      </p>

      <h2>1. Cancelling an Order</h2>
      <p>
        You can cancel an order yourself only while it is still in{" "}
        <strong>Pending</strong> status — meaning the Provider has not yet
        confirmed it. Once a Provider accepts and confirms your order, they
        have committed to preparing it, and self-service cancellation is no
        longer available.
      </p>

      <h2>2. If a Provider Rejects Your Order</h2>
      <p>
        If a Provider rejects a Pending order, any payment already made for
        that order is automatically refunded to your original payment
        method.
      </p>

      <h2>3. After Confirmation</h2>
      <p>
        Once an order is Confirmed, cancellation is generally not possible
        since preparation may have already begun. If there is an exceptional
        circumstance, contact us and we will do our best to help, though a
        refund at that stage is not guaranteed.
      </p>

      <h2>4. Failed Payments</h2>
      <p>
        If a payment fails or is not completed, no order is placed. Any
        amount that appears to have been deducted in error during a failed
        transaction will be reversed by Razorpay to your original payment
        method as per their standard timelines.
      </p>

      <h2>5. Refund Timelines</h2>
      <p>
        Approved refunds are issued to your original payment method and
        processed by Razorpay. Actual credit timing depends on your bank or
        card issuer and Razorpay's standard refund processing timelines.
      </p>

      <h2>6. Quality Issues</h2>
      <p>
        If food you received was significantly different from what was
        ordered, or had a genuine quality or safety issue, contact us within
        24 hours of delivery with details of your order. We'll review each
        case with the Provider involved.
      </p>

      <h2>7. How to Request a Refund</h2>
      <p>
        Reach out via our{" "}
        <a href="/contact" className="text-[#B23A2E] font-medium">
          Contact Us
        </a>{" "}
        page with your order ID and a description of the issue.
      </p>
    </LegalLayout>
  );
}