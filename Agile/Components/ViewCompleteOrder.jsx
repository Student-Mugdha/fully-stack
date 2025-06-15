// ViewCompleteOrder.js
import React, { useState, useEffect } from 'react';
import './ViewOrders.css';
import VendorNavbar from './VendorNavbar';
import axios from 'axios';

const ViewCompleteOrder = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const vendor = JSON.parse(localStorage.getItem('Vendors'));
                const vendorID = vendor ? vendor.vendorID : null;
                
                // Fetch only completed orders for this vendor
                const response = await axios.get(`http://localhost:3000/completed-orders?vendor=${vendorID}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <>
            <VendorNavbar />
            <div className="vendor-dashboard">
                <h1>Completed Orders</h1>
                <div className="orders-section">
                    <ul>
                        {orders.length > 0 ? orders.map(order => (
                            <li key={order.orderID}>
                                <p><strong>User:</strong> {order.userID}</p>
                                <p><strong>Order Date:</strong> {order.OrderDate.slice(0, 10)}</p>
                                <p><strong>Total Amount:</strong> Rs. {order.TotalAmount}</p>
                                <p><strong>Status:</strong> {order.Status}</p>
                            </li>
                        )) : (
                            <p>No completed orders available.</p>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ViewCompleteOrder;
