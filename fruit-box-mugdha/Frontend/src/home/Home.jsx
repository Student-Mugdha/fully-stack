import Banner from "../Components/banner";
import Footer from "../Components/Footer";
import Navbar from "./HomeNavbar";
import "./Home.css";

/**
 * Home Component
 * Main landing page of the application
 * Displays the navigation bar, banner section, and footer
 */
const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <main className="home-main">
        <Banner />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
