import React from "react";

const Card = ({ productName, price, quantity }) => {
  return (
    <div
      style={{
        backgroundColor: "#2C2F36",
        color: "#fff",
        padding: "15px",
        margin: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h3>{productName}</h3>
      <p>Price: ${price}</p>
      <p>Quantity: {quantity}</p>
    </div>
  );
};

export default Card;
