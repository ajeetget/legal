
import { Link, useNavigate } from "react-router-dom";
import { Scale, UserCircle, LogOut } from "lucide-react";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/services" className="header-logo">
          <div className="header-logo-icon">
            <Scale size={24} />
          </div>
          <span>LegalCare</span>
        </Link>

        <nav className="header-nav">
          <Link to="/services" className="nav-link">
            Services
          </Link>

          <button className="profile-button">
            <UserCircle size={20} />
            <span>My Account</span>
          </button>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
