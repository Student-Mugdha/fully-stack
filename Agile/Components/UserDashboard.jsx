import React from 'react';
import ProductList from './productList.jsx';
import DashboardNavbar from './DashboardNavbar.jsx';

function UserDashboard({ clearCart }) {
  return (
    <>
         <DashboardNavbar clearCart={clearCart} />
        <ProductList/>
        
    </>
  )
}

export default UserDashboard
