import LegalLayout from "@/components/LegalLayout";

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us" updated="22 September 2026">
      <p>
        Have a question, an issue with an order, or feedback on the
        platform? We'd like to hear from you.
      </p>

      <h2>Email</h2>
      <p>
        <a href="mailto:support@biteloop.shop" className="text-[#B23A2E] font-medium">
          support@biteloop.shop
        </a>
      </p>

      <h2>Response Time</h2>
      <p>We aim to respond to all queries within 24–48 hours.</p>

      <h2>Business Location</h2>
      <p>Pune, Maharashtra, India</p>
    </LegalLayout>
  );
}