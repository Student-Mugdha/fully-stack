import React, { useState } from "react";
import Home from "./home/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import Profiles from "./profile/Profiles";
import Signup from "./Components/Signup";
import VendorSignup from "./Components/VendorSignup"; // Import VendorSignup component
import Cart from "./cart/Cart";
import UserDashboard from "./Components/UserDashboard";
import FruitSection from "./Components/FruitSection";
import VeggieSection from "./Components/VeggieSection";
import AboutUs from "./Components/AboutUs";
import EditProfile from "./Components/EditProfile";
import VendorDashboard from "./Components/VendorDashboard";
import VendorProfiles from "./Components/VendorProfiles";
import EditProfileVendor from "./Components/EditProfileVendor";
import { Toaster } from "react-hot-toast";
import ViewOrders from "./Components/ViewOrders";
import AddProduct from "./Components/AddProduct";
import Invoice from "./Components/invoice";
import Review from "./Components/Review";
import Vendor from "./Components/Vendor";
import VendorList from "./Components/VendorList";
import VendorReview from "./Components/VendorReview";
import ViewCompleteOrder from "./Components/ViewCompleteOrder";
import ProductList from "./Components/ProductList";
import VendorReviews from "./Components/VendorReviews";
import VendorReviewAnalytics from "./Components/VendorReviewAnalytics";
import VendorSettings from "./Components/VendorSettings";
import OrderHistory from "./Components/OrderHistory";
import Login from "./Components/Login";
import VendorLogin from "./Components/VendorLogin";
import LoginPage from "./Components/LoginPage";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  function addToCart(newItem) {
    const updatedCart = [...cartItems, newItem];
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  }

  function removeFromCart(index) {
    const updatedCart = cartItems.filter((_, itemIndex) => itemIndex !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  }

  function clearCart() {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  }

  function handleLogout() {
    setCartItems([]);
    localStorage.removeItem("cartItems");
    navigate("/"); // Redirect to login page after logout
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/user" element={<Login />} />
        <Route path="/login/vendor" element={<VendorLogin />} />
        <Route path="/profile" element={<Profiles />} />
        <Route path="/user/edit" element={<EditProfile />} />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        />
        <Route path="/vendor/edit" element={<EditProfileVendor />} />
        <Route path="/signup" element={<Signup />} />
        {/* Ensure the path to VendorSignup is correct */}
        <Route path="/register/vendor" element={<VendorSignup />} />{" "}
        {/* Vendor Signup Route */}
        <Route path="/register/user" element={<Signup />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route
          path="/userdashboard"
          element={<UserDashboard clearCart={clearCart} />}
        />
        <Route
          path="/fruitsection"
          element={<FruitSection addToCart={addToCart} />}
        />
        <Route
          path="/veggiesection"
          element={<VeggieSection addToCart={addToCart} />}
        />
        <Route path="/vendordashboard" element={<VendorDashboard />} />
        <Route path="/vendorProfile" element={<VendorProfiles />} />
        <Route path="/vieworders" element={<ViewOrders />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/vendor/reviews" element={<VendorReviews />} />
        <Route
          path="/vendor/reviews/analytics"
          element={<VendorReviewAnalytics />}
        />
        <Route path="/vendor/settings" element={<VendorSettings />} />
        <Route path="/orders/history" element={<OrderHistory />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/review" element={<Review />} />
        <Route path="/vendor/:vendorID" element={<Vendor />} />
        <Route path="/vendors/details" element={<VendorList />} />
        <Route path="/reviews/vendors" element={<VendorReview />} />
        <Route path="/orders/done" element={<ViewCompleteOrder />} />
      </Routes>
    </>
  );
}

export default App;
