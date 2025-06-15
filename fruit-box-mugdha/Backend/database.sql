-- Create the database
CREATE DATABASE IF NOT EXISTS FRUITBOX;
USE FRUITBOX;

-- Users table for PG students
CREATE TABLE IF NOT EXISTS user (
    userID VARCHAR(50) PRIMARY KEY,
    userName VARCHAR(100) NOT NULL,
    userEmail VARCHAR(100) UNIQUE NOT NULL,
    userPassword VARCHAR(255) NOT NULL,
    userPhoneNumber VARCHAR(15) NOT NULL,
    userAddress TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE IF NOT EXISTS Vendors (
    vendorID VARCHAR(50) PRIMARY KEY,
    vendorName VARCHAR(100) NOT NULL,
    vendorEmail VARCHAR(100) UNIQUE NOT NULL,
    vendorPassword VARCHAR(255) NOT NULL,
    vendorPhoneNumber VARCHAR(15) NOT NULL,
    vendorAddress TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS product (
    productID VARCHAR(50) PRIMARY KEY,
    vendorID VARCHAR(50),
    productName VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(10) DEFAULT 'kg',
    imageURL TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendorID) REFERENCES Vendors(vendorID)
);

-- Cart table
CREATE TABLE IF NOT EXISTS Cart (
    cartID VARCHAR(50) PRIMARY KEY,
    userID VARCHAR(50),
    TotalAmount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- Cart Items table
CREATE TABLE IF NOT EXISTS CartItems (
    cartItemID VARCHAR(50) PRIMARY KEY,
    cartID VARCHAR(50),
    productID VARCHAR(50),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cartID) REFERENCES Cart(cartID),
    FOREIGN KEY (productID) REFERENCES product(productID)
);

-- Orders table
CREATE TABLE IF NOT EXISTS Orders (
    orderID VARCHAR(50) PRIMARY KEY,
    userID VARCHAR(50),
    vendorID VARCHAR(50),
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DeliveryDate TIMESTAMP NULL,
    Status ENUM('Pending', 'Processing', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    TotalAmount DECIMAL(10,2) NOT NULL,
    PaymentStatus ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    PaymentID VARCHAR(100),
    RazorpayOrderID VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES user(userID),
    FOREIGN KEY (vendorID) REFERENCES Vendors(vendorID)
);

-- Order Items table
CREATE TABLE IF NOT EXISTS OrderItems (
    orderItemID VARCHAR(50) PRIMARY KEY,
    orderID VARCHAR(50),
    productID VARCHAR(50),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (productID) REFERENCES product(productID)
);

-- Subscription table
CREATE TABLE IF NOT EXISTS Subscription (
    subs_ID VARCHAR(50) PRIMARY KEY,
    userID VARCHAR(50),
    subs_Type ENUM('Weekly', 'Monthly', 'Quarterly') NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- Subscription Products table
CREATE TABLE IF NOT EXISTS Subscription_Products (
    subsProductID VARCHAR(50) PRIMARY KEY,
    subs_ID VARCHAR(50),
    productID VARCHAR(50),
    quantity INT NOT NULL,
    FOREIGN KEY (subs_ID) REFERENCES Subscription(subs_ID),
    FOREIGN KEY (productID) REFERENCES product(productID)
);

-- Fruits table
CREATE TABLE IF NOT EXISTS fruits (
    fruitID VARCHAR(50) PRIMARY KEY,
    fruitName VARCHAR(100) NOT NULL,
    description TEXT,
    seasonalAvailability VARCHAR(50),
    nutritionalInfo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key to product table for fruits
ALTER TABLE product
ADD COLUMN fruitID VARCHAR(50),
ADD FOREIGN KEY (fruitID) REFERENCES fruits(fruitID);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    reviewID VARCHAR(50) PRIMARY KEY,
    userName VARCHAR(100) NOT NULL,
    userEmail VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    vendorID VARCHAR(50),
    vendorResponse TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendorID) REFERENCES Vendors(vendorID) ON DELETE SET NULL
);