
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/products'); // Change endpoint to fetch products
                console.log('Fetched products:', response.data);
                const productsData = Array.isArray(response.data) ? response.data : response.data.products || [];
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/add-product', {
                productName,
                price,
                quantity,
            });
            console.log('Product added:', response.data);
            // Add the new product to the existing products list
            setProducts((prevProducts) => [...prevProducts, response.data.product]);
            // Reset form fields
            setProductName('');
            setPrice('');
            setQuantity('');
        } catch (error) {
            console.error('Error adding product:', error);
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
                <div>
                    {products.map((product) => (
                        <div style={styles.productCard} key={product.productID}>
                            <h3 style={styles.productName}>{product.productName}</h3>
                            {/* Display product image */}
                            {product.imageURL && <img src={product.imageURL} alt={product.productName} style={styles.productImage} />}
                            <p style={styles.productInfo}>Price: ${product.price}</p>
                            <p style={styles.productInfo}>Quantity: {product.quantity}</p>
                            {product.isNew && <span style={styles.newTag}>New!</span>}
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
        padding: '20px',
        backgroundColor: '#343a40',
        borderRadius: '8px',
        maxWidth: '1200px',
        margin: 'auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        color: 'white',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '20px',
        textAlign: 'center',
    },
    productCard: {
        backgroundColor: '#495057',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productName: {
        margin: '0 0 10px 0',
    },
    productInfo: {
        margin: '5px 0',
        color: '#f8f9fa',
    },
    loadingText: {
        color: 'white',
    },
    noProductsText: {
        color: 'white',
    },
    newTag: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '5px',
        borderRadius: '5px',
        fontSize: '0.8rem',
    },
    productImage: {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginLeft: '10px',
    },
    form: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
};

export default ProductList;
