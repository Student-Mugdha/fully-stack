import React, { useState, useEffect } from "react";
import "./FruitSection.css";
import DashboardNavbar from "./DashboardNavbar.jsx";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const socket = io("http://localhost:3000");

function FruitSection({ addToCart, updateCart }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]); // Manage cartItems locally

  const fetchProducts = async () => {
    try {
      console.log("Starting to fetch products...");
      const response = await api.get("/products");
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Fetched products:", response.data);

      if (!response.data) {
        console.error("No data received from server");
        toast.error("No products data received from server");
        setProducts([]);
        return;
      }

      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          console.log("No products found in database");
          toast.info("No products available at the moment");
        }
        setProducts(response.data);
        const initialQuantities = response.data.reduce((acc, product) => {
          acc[product.productID] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } else {
        console.error("Invalid data format received:", response.data);
        toast.error("Received invalid data format from server");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      toast.error(
        error.response?.data?.error ||
          "Failed to fetch products. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    socket.on("newProduct", (newProduct) => {
      setProducts((prevProducts) => {
        const existingProductIndex = prevProducts.findIndex(
          (product) => product.productID === newProduct.productID
        );
        if (existingProductIndex !== -1) {
          const updatedProducts = [...prevProducts];
          updatedProducts[existingProductIndex].quantity += newProduct.quantity;
          updatedProducts[existingProductIndex].isNew = false;
          return updatedProducts;
        } else {
          return [...prevProducts, { ...newProduct, isNew: true }];
        }
      });
    });

    return () => {
      socket.off("newProduct");
    };
  }, []);

  const handleAddToCart = (product) => {
    const selectedQuantity = quantities[product.productID];

    // Check if the selected quantity exceeds available stock
    if (selectedQuantity > product.quantity) {
      toast.error("Selected quantity exceeds available stock.");
      return;
    }

    // Check if the product is already in the cart
    const existingCartItemIndex = cartItems.findIndex(
      (item) => item.productID === product.productID
    );

    if (existingCartItemIndex !== -1) {
      // If the product is already in the cart, update its quantity
      const updatedCartItems = cartItems.map((item, index) => {
        if (index === existingCartItemIndex) {
          return {
            ...item,
            quantity: item.quantity + selectedQuantity, // Add the selected quantity
          };
        }
        return item;
      });

      updateCart(updatedCartItems); // Update the cart in the parent component
      toast.success(`Increased quantity of ${product.productName} in the cart`);
    } else {
      // If the product is not in the cart, add it as a new item
      const newCartItem = {
        productID: product.productID,
        name: product.productName,
        quantity: selectedQuantity,
        price: product.price,
        image: product.imageURL,
      };
      addToCart(newCartItem); // Function to add new item to cart
      toast.success(`${product.productName} added to cart`);
    }
  };

  const handleQuantityChange = (productID, value) => {
    if (value < 1) return;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productID]: Math.min(
        value,
        products.find((p) => p.productID === productID)?.unit || 0
      ),
    }));
  };

  const handleProceedToBuy = () => {
    navigate("/cart");
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <DashboardNavbar />
      <div style={styles.productList}>
        <h2 style={styles.title}>Product List</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />

        {loading ? (
          <p style={styles.loadingText}>Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div style={styles.productCard} key={product.productID}>
              <h3 style={styles.productName}>{product.productName}</h3>
              <img
                src={product.imageURL || "Fruit/defaultImage.jpg"}
                alt={product.productName}
                style={styles.productImage}
              />
              <p style={styles.productInfo}>
                Price: ₹{product.price} per {product.unit}
              </p>
              <p style={styles.productInfo}>
                Available Quantity: {product.quantity}
              </p>
              <label
                htmlFor={`quantity-${product.productID}`}
                style={styles.quantityLabel}
              >
                Select Quantity:
              </label>
              <input
                type="number"
                id={`quantity-${product.productID}`}
                min="1"
                max={product.quantity}
                value={quantities[product.productID]}
                onChange={(e) =>
                  handleQuantityChange(
                    product.productID,
                    Number(e.target.value)
                  )
                }
                style={styles.quantityInput}
              />
              {product.isNew && <span style={styles.newTag}>New!</span>}
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
                disabled={
                  quantities[product.productID] < 1 ||
                  quantities[product.productID] > product.unit
                }
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p style={styles.noProductsText}>No products available.</p>
        )}
        <button onClick={handleProceedToBuy}>Go To Cart</button>
      </div>
    </>
  );
}

const styles = {
  productList: {
    padding: "20px",
    backgroundColor: "#343a40",
    borderRadius: "8px",
    maxWidth: "1200px",
    margin: "auto",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    color: "white",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "1.5rem",
  },
  productCard: {
    backgroundColor: "#495057",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    position: "relative",
  },
  productName: {
    margin: "0 0 10px 0",
  },
  productImage: {
    width: "100%", // Set to 100% of the parent container
    maxWidth: "200px", // Max width for the image
    height: "auto", // Maintain aspect ratio
    objectFit: "cover", // Adjust how the image fits
    borderRadius: "8px", // Optional: rounded corners
  },
  productInfo: {
    margin: "5px 0",
    color: "#f8f9fa",
  },
  noProductsText: {
    color: "white",
    textAlign: "center",
    fontSize: "1.5rem",
  },
  newTag: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#28a745",
    color: "white",
    padding: "5px",
    borderRadius: "5px",
    fontSize: "0.8rem",
  },
  quantityLabel: {
    marginRight: "10px",
    color: "white",
  },
  quantityInput: {
    width: "50px",
    margin: "10px 0",
    padding: "5px",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "20px",
    fontSize: "1rem",
  },
};

export default FruitSection;
