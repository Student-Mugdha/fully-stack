import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css"; // Import your CSS file

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        const productsData = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/add-product", {
        productName,
        price,
        quantity,
      });
      setProducts((prevProducts) => [...prevProducts, response.data.product]);
      setProductName("");
      setPrice("");
      setQuantity("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div style={styles.productList}>
      <h2 style={styles.title}>Product List</h2>
      <form onSubmit={handleAddProduct} style={styles.form}>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>
      {loading ? (
        <p style={styles.loadingText}>Loading products...</p>
      ) : Array.isArray(products) && products.length > 0 ? (
        <div className="product-cards">
          {products.map((product) => (
            <div style={styles.productCard} key={product.productID}>
              <h3 style={styles.productName}>{product.productName}</h3>
              {product.imageURL && (
                <img
                  src={product.imageURL}
                  alt={product.productName}
                  style={styles.productImage}
                />
              )}
              <p style={styles.productInfo}>Price: ${product.price}</p>
              <p style={styles.productInfo}>Quantity: {product.quantity}</p>
              {product.isNew && <span style={styles.newTag}>New!</span>}
              {/* Quantity Selector and Add to Cart Button */}
              <div style={styles.quantityCartContainer}>
                <input
                  type="number"
                  style={styles.productQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  required
                />
                <button style={styles.addToCartBtn}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noProductsText}>No products available.</p>
      )}
    </div>
  );
};

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
  productCard: {
    backgroundColor: "#ffeb3b", // Bright yellow background
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productName: {
    margin: "0 0 10px 0",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  productInfo: {
    margin: "5px 0",
    color: "#343a40",
  },
  loadingText: {
    color: "white",
  },
  noProductsText: {
    color: "white",
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
  productImage: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    marginLeft: "10px",
  },
  form: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  quantityCartContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "10px",
  },
  productQuantity: {
    padding: "5px",
    fontSize: "1rem",
    width: "80px",
    border: "1px solid #ced4da",
    borderRadius: "5px",
  },
  addToCartBtn: {
    backgroundColor: "#ffc107",
    color: "#343a40",
    padding: "10px 15px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s, background-color 0.3s",
    marginLeft: "10px",
  },
  addToCartBtnHover: {
    backgroundColor: "#ffca2c",
    transform: "scale(1.05)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default ProductList;
