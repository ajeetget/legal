
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />

      <main className="main-content">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
