import LegalLayout from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="22 September 2026">
      <p>
        This Privacy Policy explains what information Biteloop collects, how
        we use it, and the choices you have. By using Biteloop, you agree to
        the practices described here.
      </p>

      <h2>1. Information We Collect</h2>
      <p>When you use Biteloop, we collect:</p>
      <ul>
        <li>Account details: name, email, phone number, and address</li>
        <li>Order details: items ordered, delivery address, order history</li>
        <li>Provider details: business name, description, address, and location (if provided)</li>
        <li>Location data, only if you choose to share it (e.g. to set a delivery pin or browse the map view)</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use this information to operate the platform — creating and
        managing your account, processing and delivering orders, sending
        order-status notifications, and improving the service.
      </p>

      <h2>3. Payment Information</h2>
      <p>
        Payments are processed by Razorpay, our payment gateway partner.
        Biteloop does not collect or store your card number, CVV, or other
        payment credentials — these are handled directly by Razorpay under
        its own security and compliance standards.
      </p>

      <h2>4. Cookies</h2>
      <p>
        Biteloop uses a single essential, httpOnly authentication cookie to
        keep you securely logged in. This cookie is not accessible to
        JavaScript and is not used for advertising or third-party tracking.
      </p>

      <h2>5. Sharing of Information</h2>
      <p>
        We share order details with the relevant Provider so they can
        fulfil your order, and payment details with Razorpay to process
        payment. We do not sell your personal information to third parties.
      </p>

      <h2>6. Data Security</h2>
      <p>
        Passwords are stored using industry-standard hashing (bcrypt) and
        are never stored or logged in plain text. Data is transmitted over
        encrypted (HTTPS) connections.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain account and order data for as long as your account is
        active, or as needed to comply with legal obligations, resolve
        disputes, and enforce our agreements.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your
        personal data by contacting us. Note that some order history may be
        retained where required for legal, tax, or dispute-resolution
        purposes even after a deletion request.
      </p>

      <h2>9. Children's Privacy</h2>
      <p>
        Biteloop is not directed at, and should not be used by, anyone under
        18 years of age.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material
        changes will be reflected by an updated "Last updated" date above.
      </p>

      <h2>11. Contact</h2>
      <p>
        For any privacy-related questions or requests, reach us via our{" "}
        <a href="/contact" className="text-[#B23A2E] font-medium">
          Contact Us
        </a>{" "}
        page.
      </p>
    </LegalLayout>
  );
}