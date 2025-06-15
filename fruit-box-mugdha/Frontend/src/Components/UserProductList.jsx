import React, { useState, useEffect } from "react";
import api from "../api/config";
import { toast } from "react-hot-toast";
import "./ProductList.css";

const UserProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again.");
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="product-list-content">
      <div className="product-list-header">
        <h1>Available Products</h1>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>No products available at the moment.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.productID} className="product-card">
              <img
                src={product.imageURL}
                alt={product.productName}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.productName}</h3>
                <p className="product-price">₹{product.price}</p>
                <p className="product-quantity">
                  Available: {product.quantity} {product.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProductList;
