import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VendorNavbar from "./VendorNavbar";
import api from "../api/config";
import { toast } from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    quantity: "",
    unit: "piece",
  });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkVendorAuth = async () => {
      try {
        await api.get("/vendor/profile");
      } catch (error) {
        console.error("Error checking vendor auth:", error);
        toast.error("Please login to access vendor dashboard");
        navigate("/login/vendor");
        return;
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setAvailableProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load product list");
        toast.error("Failed to load product list");
      }
    };

    checkVendorAuth();
    fetchProducts();
  }, [navigate]);
  const [error, setError] = useState(null); // For handling any errors
  const [success, setSuccess] = useState(false); // For handling success state

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

      // Find the selected fruit's ID
      const selectedFruit = availableProducts.find(
        (fruit) => fruit.fruitName === product.productName
      );
      if (!selectedFruit) {
        throw new Error("Selected fruit not found");
      }

      const productWithDetails = {
        ...product,
        vendorID,
        fruitID: selectedFruit.fruitID,
      };

      const response = await api.post("/addproduct", productWithDetails);

      setSuccess(true);
      setProduct({ productName: "", price: "", quantity: "", unit: "piece" });
      toast.success("Product added successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to add the product. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VendorNavbar />
      <div
        style={{
          padding: "20px",
          backgroundColor: "#1D232A", // Dark background
          borderRadius: "10px",
          color: "#f1f1f1", // Light text color
          maxWidth: "500px",
          margin: "20px auto", // Center the form
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2
          style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}
        >
          Add Product
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name Dropdown */}
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="productName"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "16px",
                color: "#d1d1d1",
              }}
            >
              Product Name:
            </label>
            <select
              id="productName"
              name="productName"
              value={product.productName}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#2C2F36",
                color: "#fff",
                fontSize: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <option value="">Select a product</option>
              {availableProducts.map((fruit) => (
                <option key={fruit.fruitID} value={fruit.fruitName}>
                  {fruit.fruitName}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="price"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "16px",
                color: "#d1d1d1",
              }}
            >
              Price (per {product.unit}):
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#2C2F36",
                color: "#fff",
                fontSize: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>

          {/* Unit Type (Piece or 500 grams) */}
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="unit"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "16px",
                color: "#d1d1d1",
              }}
            >
              Unit Type:
            </label>
            <select
              id="unit"
              name="unit"
              value={product.unit}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#2C2F36",
                color: "#fff",
                fontSize: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <option value="piece">Per Piece</option>
              <option value="500gm">Per 500 Grams</option>
            </select>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="quantity"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "16px",
                color: "#d1d1d1",
              }}
            >
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              required
              min="1"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#2C2F36",
                color: "#fff",
                fontSize: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: loading ? "#666" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              width: "100%",
            }}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
