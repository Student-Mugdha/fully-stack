import React from "react";
import { Link } from "react-router-dom";
import "./Product_list.css"; // Import the CSS file for styling

function Subscription_Product_list() {
  return (
    <div className="product-page">
      <h1 className="page-header">Ours Products</h1>
      <div className="product-container">
        {/* Fruits Card */}
        <div className="product-card">
          {/* <img src={fruitsImg} alt="Fruits" className="product-image" /> */}
          <h2 className="product-title">Fruits</h2>
          <Link to="/subscription_FruitSection">
            <button className="product-button">Shop Now</button>
          </Link>
        </div>

        {/* Exotic Veggies Card */}
        <div className="product-card">
          {/* <img src={veggiesImg} alt="Exotic Veggies" className="product-image" /> */}
          <h2 className="product-title">Exotic Veggies</h2>
          <Link to="/subscription_VeggieSection">
            <button className="product-button">Shop Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Subscription_Product_list;
