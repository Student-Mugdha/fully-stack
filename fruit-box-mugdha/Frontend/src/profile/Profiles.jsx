import React from "react";
import Navbar from "../Components/Navbar";
import Profile from "../Components/Profile";
import Footer from "../Components/Footer";

function Profiles() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Profile />
      </div>
      <Footer />
    </>
  );
}

export default Profiles;
