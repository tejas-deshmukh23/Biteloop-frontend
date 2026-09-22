import LegalLayout from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="22 September 2026">
      <p>
        These Terms & Conditions ("Terms") govern your use of Biteloop
        (biteloop.shop), a platform that connects customers with independent
        home kitchens and mess/tiffin service providers ("Providers"). By
        creating an account or placing an order, you agree to these Terms.
      </p>

      <h2>1. What Biteloop Is</h2>
      <p>
        Biteloop is a marketplace. We provide the technology that lets
        Providers list menus and receive orders, and lets Customers browse,
        order, and pay for food. Biteloop does not prepare, cook, or deliver
        food itself — each Provider is an independent business responsible
        for the food they list and prepare.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must provide accurate information when registering as a Customer
        or Provider and are responsible for keeping your login credentials
        secure. You must be at least 18 years old to create an account.
      </p>

      <h2>3. Provider Responsibilities</h2>
      <p>Providers using Biteloop agree to:</p>
      <ul>
        <li>List accurate menu items, prices, and availability</li>
        <li>Prepare food in compliance with applicable food safety laws and regulations, including any FSSAI requirements that apply to their business</li>
        <li>Fulfil accepted orders in a timely and reasonable manner</li>
        <li>Not misrepresent their business, location, or offerings</li>
      </ul>

      <h2>4. Orders & Payments</h2>
      <p>
        Orders are placed through the platform and paid for via our payment
        partner, Razorpay. Prices are set by individual Providers. An order
        is only confirmed once the Provider accepts it; Biteloop is not
        responsible for a Provider's decision to reject an order, though any
        payment already made for a rejected order will be refunded.
      </p>

      <h2>5. Cancellations & Refunds</h2>
      <p>
        Cancellation and refund terms are set out separately in our{" "}
        <a href="/refund-policy" className="text-[#B23A2E] font-medium">
          Refund & Cancellation Policy
        </a>
        , which forms part of these Terms.
      </p>

      <h2>6. Prohibited Conduct</h2>
      <p>
        You may not use Biteloop to defraud another user, interfere with the
        platform's operation, misuse another person's account, or violate
        any applicable law.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        Biteloop provides the platform on an "as is" basis. To the maximum
        extent permitted by law, Biteloop is not liable for the quality,
        safety, or legality of food prepared by Providers, for losses arising
        from a Provider's failure to fulfil an order, or for indirect or
        consequential damages arising from use of the platform.
      </p>

      <h2>8. Termination</h2>
      <p>
        We may suspend or terminate an account that violates these Terms or
        that we reasonably believe poses a risk to other users or the
        platform.
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of
        Biteloop after an update constitutes acceptance of the revised Terms.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India, and any disputes will
        be subject to the exclusive jurisdiction of the courts of Pune,
        Maharashtra.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these Terms can be sent via our{" "}
        <a href="/contact" className="text-[#B23A2E] font-medium">
          Contact Us
        </a>{" "}
        page.
      </p>
    </LegalLayout>
  );
}