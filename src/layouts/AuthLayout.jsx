import { Scale } from "lucide-react";
import "./AuthLayout.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="auth-logo">
          <Scale size={26} />
        </div>
        <h2>LegalCare</h2>
      </div>

      <div className="auth-card">{children}</div>

      <p className="auth-copyright">
        © 2026 LegalCare. All rights reserved.
      </p>
    </div>
  );
}

export default AuthLayout;