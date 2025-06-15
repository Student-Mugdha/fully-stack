import React, { useState, useEffect } from "react";
import VendorNavbar from "./VendorNavbar";
import api from "../api/config";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    quantity: "",
    unit: "piece",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    const checkVendorAuth = async () => {
      try {
        await api.get("/vendor/profile");
      } catch (error) {
        console.error("Error checking vendor auth:", error);
        navigate("/login/vendor");
      }
    };

    const fetchAvailableProducts = async () => {
      try {
        const response = await api.get("/products");
        setAvailableProducts(response.data);
      } catch (error) {
        console.error("Error fetching available products:", error);
      }
    };

    checkVendorAuth();
    fetchAvailableProducts();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get vendor data from the session
      const vendorResponse = await api.get("/vendor/profile");
      const vendorID = vendorResponse.data.vendorID;

      const productWithVendorID = {
        ...product,
        vendorID,
      };

      const response = await api.post("/addproduct", productWithVendorID);

      setSuccess(true);
      setProduct({ productName: "", price: "", quantity: "", unit: "piece" });

      // Refresh available products
      const updatedProducts = await api.get("/products");
      setAvailableProducts(updatedProducts.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to add the product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VendorNavbar />
      <div className="add-product-container">
        <h2>Add Product</h2>
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">Product added successfully!</div>
        )}

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <label htmlFor="productName">Product Name:</label>
            <select
              id="productName"
              name="productName"
              value={product.productName}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select a product</option>
              {availableProducts.map((prod) => (
                <option key={prod.productID} value={prod.productName}>
                  {prod.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (per {product.unit}):</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="unit">Unit Type:</label>
            <select
              id="unit"
              name="unit"
              value={product.unit}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="piece">Per Piece</option>
              <option value="500gm">Per 500 Grams</option>
              <option value="kg">Per Kilogram</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              required
              min="1"
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
