// VeggieSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VeggieSection.css"; // CSS remains the same
import DashboardNavbar from "./DasboardNavbar";
import axios from "axios";

function Subscription_VeggieSection({ addToCart }) {
  const navigate = useNavigate();

  const [carrotQuantity, setCarrotQuantity] = useState(1);
  const [broccoliQuantity, setBroccoliQuantity] = useState(1);

  const products = [
    {
      productID: "Ve01",
      name: "Carrots",
      quantity: carrotQuantity,
      price: 50,
      image: "/carrot.png",
      setQuantity: setCarrotQuantity,
    },
    {
      productID: "Ve02",
      name: "Broccoli",
      quantity: broccoliQuantity,
      price: 80,
      image: "/broccoli.png",
      setQuantity: setBroccoliQuantity,
    },
  ];

  const handleAddToCart = async (product) => {
    console.log("Add to Cart button clicked", product);
    const subsID = localStorage.getItem("subscriptionID"); // Fetch subscription ID from localStorage

    // Log the subsID to check if it's being retrieved correctly
    console.log("Subscription ID (subsID):", subsID);

    // Log the product data to check if productID and quantity are correct
    console.log("Product being added:", product);

    // Prepare the cart data
    const cartData = {
      subsID, // Pass the subscription ID
      productID: product.productID, // Use product name as productID (assuming this maps to your product logic)
      quantity: product.quantity, // Pass the selected quantity
      name: product.name, // Add name for display
      price: product.price, // Add price for display
      image: product.image,
    };

    // Log the data that will be sent to the backend
    console.log("Cart Data being sent to backend:", cartData);

    try {
      const response = await axios.post(
        "http://localhost:3001/subscription_products",
        cartData
      );
      console.log("Response from backend:", response.data); // Log backend response

      // Update local storage
      const existingCartItems =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      existingCartItems.push(cartData);
      localStorage.setItem("cartItems", JSON.stringify(existingCartItems)); // Update local storage

      navigate("/subscription_cart");
    } catch (error) {
      console.error("Error adding to cart:", error); // Log any errors
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div
        className="veggies-page"
        style={{
          backgroundColor: "#1D232A",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <h1
          className="page-header"
          style={{
            color: "#fff",
            textAlign: "center",
            marginBottom: "2rem",
            fontSize: "2.5rem",
          }}
        >
          Fresh Vegetables
        </h1>
        <div className="veggies-container">
          {products.map((product, index) => (
            <div className="veggies-card" key={index}>
              <div className="veggies-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="veggies-image"
                />
              </div>
              <div className="veggies-info">
                <h2 className="veggies-title">{product.name} (Per 1 KG)</h2>
                <p className="veggies-price">
                  <span className="discounted-price">Rs. {product.price}</span>
                </p>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      product.setQuantity(Math.max(1, product.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => product.setQuantity(product.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                {/* <button className="add-to-cart-btn" onClick={() => handleAddToCart({ name: product.name, quantity: product.quantity, price: product.price, image: product.image })}>
                                    Add to Cart
                                </button> */}
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Subscription_VeggieSection;
