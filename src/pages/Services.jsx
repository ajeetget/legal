
import { FileSearch } from "lucide-react";
import ServiceCard from "../components/services/ServiceCard";
import "./Services.css";

function Services() {
  return (
    <div className="services-page">
      <div className="services-container">

        <div className="services-heading">
          <span className="services-label">LEGAL SERVICES</span>

          <h1>Our Services</h1>

          <p>
            Simplify your legal document management with
            our smart and easy-to-use services.
          </p>
        </div>

        <div className="services-grid">
          <ServiceCard
            title="PDF Scanner"
            description="Scan, upload and process your PDF documents easily and efficiently."
            icon={FileSearch}
            link="/services/pdf-scanner"
            buttonText="Scan Now"
          />
        </div>

      </div>
    </div>
  );
}

export default Services;
