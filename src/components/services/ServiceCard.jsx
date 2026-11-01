
import { Link } from "react-router-dom";
import { FileSearch, ArrowRight } from "lucide-react";
import "./ServiceCard.css";

function ServiceCard({
  title,
  description,
  icon: Icon,
  link,
  buttonText = "Get Started",
}) {
  return (
    <div className="service-card">
      <div className="service-icon">
        <Icon size={30} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <Link to={link} className="service-button">
        {buttonText}
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}

export default ServiceCard;
