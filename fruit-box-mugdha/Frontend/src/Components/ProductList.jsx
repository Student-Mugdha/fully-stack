import React, { useState, useEffect } from "react";
import VendorNavbar from "./VendorNavbar";
import api from "../api/config";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./ProductList.css";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkVendorAuth = async () => {
      try {
        // Check if vendor is logged in and has valid token
        const vendorData = localStorage.getItem("Vendors");
        const token = localStorage.getItem("token");
        if (!vendorData || !token) {
          toast.error("Please login to view products");
          navigate("/login/vendor");
          return;
        }

        const vendorResponse = await api.get("/vendor/profile");
        const vendorID = vendorResponse.data.vendorID;

        if (!vendorID) {
          toast.error("Vendor ID not found. Please login again.");
          navigate("/login/vendor");
          return;
        }

        const response = await api.get(`/vendor/${vendorID}/products`);
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again.");
        toast.error("Failed to fetch products");
        navigate("/login/vendor");
      } finally {
        setLoading(false);
      }
    };

    checkVendorAuth();
  }, [navigate]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const vendorResponse = await api.get("/vendor/profile");
        const vendorID = vendorResponse.data.vendorID;
        await api.delete(`/vendor/${vendorID}/products/${productId}`);
        setProducts(
          products.filter((product) => product.productID !== productId)
        );
        toast.success("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
        toast.error("Failed to delete product");
      }
    }
  };

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
    <div className="product-list-container">
      <VendorNavbar />
      <div className="product-list-content">
        <div className="product-list-header">
          <h1>My Products</h1>
          <Link to="/addproduct" className="add-product-button">
            Add New Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found. Add your first product!</p>
            <Link to="/addproduct" className="add-product-link">
              Add Product
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.productID} className="product-card">
                <div className="product-info">
                  <h3>{product.productName}</h3>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-quantity">
                    Quantity: {product.quantity} {product.unit}
                  </p>
                </div>
                <div className="product-actions">
                  <Link
                    to={`/products/${product.productID}/edit`}
                    className="edit-button"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.productID)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
