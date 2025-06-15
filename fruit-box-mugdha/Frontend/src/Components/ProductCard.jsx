import React, { useState } from "react";
import "./Banner.css"; // Ensure the path is correct

const styles = {
  productListContainer: {
    textAlign: "center",
    padding: "20px", // Adding padding to give space around the component
  },
  buttonContainer: {
    marginBottom: "20px",
  },
  categoryButton: {
    padding: "10px 20px",
    margin: "0 10px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  activeButton: {
    padding: "10px 20px",
    margin: "0 10px",
    backgroundColor: "#eae6b1",
    border: "1px solid #ccc",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  productList: {
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  productCard: {
    width: "250px",
    margin: "20px",
    textAlign: "center",
    border: "1px solid #eaeaea",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  onSaleText: {
    fontSize: "12px",
    color: "#8c8c8c",
    marginBottom: "10px",
    fontFamily: "Arial, sans-serif",
  },
  productImage: {
    width: "150px",
    height: "auto",
    marginBottom: "10px",
  },
  productName: {
    fontSize: "16px",
    marginBottom: "8px",
    fontFamily: "Arial, sans-serif",
  },
  productPrice: {
    marginBottom: "12px",
  },
  salePrice: {
    color: "#d9534f",
    fontWeight: "bold",
    fontSize: "18px",
  },
  originalPrice: {
    textDecoration: "line-through",
    color: "#8c8c8c",
    marginLeft: "8px",
  },
  quantityControls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
  },
  quantityButton: {
    padding: "6px",
    backgroundColor: "#f0f0f0",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  addToCartButton: {
    padding: "10px 20px",
    backgroundColor: "#eae6b1",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div style={styles.productCard}>
      <div style={styles.onSaleText}>On Sale</div>
      <h3 style={styles.productName}>{product.name}</h3>
      <div style={styles.productPrice}>
        <span style={styles.salePrice}>Rs. {product.salePrice}</span>
        <span style={styles.originalPrice}>Rs. {product.originalPrice}</span>
      </div>
      <div style={styles.quantityControls}>
        <button style={styles.quantityButton} onClick={decreaseQuantity}>
          -
        </button>
        <span>{quantity}</span>
        <button style={styles.quantityButton} onClick={increaseQuantity}>
          +
        </button>
      </div>
      <button style={styles.addToCartButton}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
