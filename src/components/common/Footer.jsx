
import { Scale } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Scale size={22} />
          <span>LegalCare</span>
        </div>

        <p>
          Simplifying legal document management with smart
          and easy-to-use tools.
        </p>

        <div className="footer-bottom">
          <span>© 2026 LegalCare. All rights reserved.</span>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
