import React, { useState, useEffect } from 'react';
import { Link, useLocation,useNavigate} from 'react-router-dom';
import axios from 'axios'; // Import axios
import './invoice.css';

function Invoice() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {}; // Add a default empty object if state is null

    const { cartItems = [], totalPrice = 0, platformFee = 0, finalTotal = 0, orderId = 'N/A' } = state;

    // State to store vendor list and selected vendor
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState('');
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    // Fetch vendors from API using axios
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get("http://localhost:3000/vendors/details");
                console.log("API Response:", response.data); // This logs the correct response
                setVendors(response.data); // Update the vendors state
            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
        };
    
        fetchVendors();
    }, []); // No need for 'vendors' in the dependency array

    // Use another useEffect to log vendors after they are updated
    useEffect(() => {
        console.log("Updated Vendors state:", vendors);
    }, [vendors]); // Logs vendors whenever the state changes

    // Handle vendor selection
    const handleVendorChange = (event) => {
        setSelectedVendor(event.target.value);
    };

    // Simulate placing the order
    const handlePlaceOrder = () => {
        setIsOrderPlaced(true); // Show the vendor selection dropdown
    };

    // Handle final order submission
    const handleSubmitOrder = async () => {
        const user = JSON.parse(localStorage.getItem('users'));
        const userID = user ? user.userID : null;
    
        if (!userID) {
            console.error("No userID found in localStorage.");
            alert("User not logged in.");
            return; // Stop execution if no userID
        }
    
        const orderDetails = {
            userID: userID,
            vendorID: selectedVendor || null,
            OrderDate: new Date().toISOString().split('T')[0], // Ensure it's in the correct format
            DeliveryDate: new Date().toISOString().split('T')[0], // Ensure it's in the correct format
            Status: 'Pending',
            TotalAmount: finalTotal || null // Use null if undefined
        };
    
        console.log("Submitting Order Details:", orderDetails); // Log order details
    
        try {
            const response = await axios.post('http://localhost:3000/orders', orderDetails);
            console.log('Order placed successfully:', response.data);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };
    

    return (
        <div className="invoice-container">
            <h1 style={{ fontSize: '2em' }}>Invoice</h1>
            <div className="invoice-details">
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <div className="invoice-items">
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <div key={index} className="invoice-item">
                                <p>{item.name} (x{item.quantity})</p>
                                <p>Rs. {item.price * item.quantity}</p>
                            </div>
                        ))
                    ) : (
                        <p>No items in the cart.</p>
                    )}
                </div>
                <div className="invoice-summary">
                    <p><strong>Total Price:</strong> Rs. {totalPrice}</p>
                    <p><strong>Platform Fee:</strong> Rs. {platformFee}</p>
                    <p style={{ color: 'green', fontSize: '1.5em' }}><strong>Final Total:</strong> Rs. {finalTotal}</p>
                </div>
            </div>
            {!isOrderPlaced ? (
                <button className="back-button" onClick={handlePlaceOrder}>
                    Place Order
                </button>
            ) : (
                <div className="vendor-selection">
                    <label htmlFor="vendor">Select Vendor:</label>
                    <select id="vendor" value={selectedVendor} onChange={handleVendorChange}>
                        <option value="">-- Select Vendor --</option>
                        {vendors.length > 0 ? (
                            vendors.map((vendor) => (
                                <option key={vendor.vendorID} value={vendor.vendorID}>
                                    {vendor.vendorName} (ID: {vendor.vendorID}, Address: {vendor.vendorAddress})
                                </option>
                            ))
                        ) : (
                            <option value="">No vendors available</option>
                        )}
                    </select>
                    <button className="submit-button" onClick={handleSubmitOrder}>
                        Submit Order
                    </button>
                </div>
            )}
            <Link to="/userdashboard">
                <button className="back-button">Back to Dashboard</button>
            </Link>
        </div>
    );
}

export default Invoice;
