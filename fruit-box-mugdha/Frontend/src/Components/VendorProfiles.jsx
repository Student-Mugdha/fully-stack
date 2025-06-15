import React from "react";
import VendorNavbar from "./VendorNavbar";
import VendorProfile from "./VendorProfile";
import Footer from "./Footer";

function VendorProfiles() {
  return (
    <>
      <VendorNavbar />
      <div className="min-h-screen">
        <VendorProfile />
      </div>
      <Footer />
    </>
  );
}

export default VendorProfiles;
