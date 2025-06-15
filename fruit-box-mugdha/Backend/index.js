const express = require("express"); // requiring express package
const db = require("./routes/database"); // requiring database which is in database.js file
const path = require("path"); // requiring path for static files (static files are resources like images, CSS, and JS that don't change)
const session = require("express-session"); // requiring session to store info across various pages; a session is created on login
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
console.log("Environment Variables Loaded:", process.env);

// Initialize Razorpay
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Socket.IO configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(bodyParser.json());

app.use(methodOverride("_method")); // This allows you to use _method to simulate PUT and PATCH

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serving static files from "public" directory
app.set("view engine", "ejs"); // Setting view engine to EJS for rendering HTML templates
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded form data
app.use(express.json()); // For parsing JSON data if needed

// **Setup express-session middleware**
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE),
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.render("index"); // Rendering the index.ejs file which is our home page
});

// Register route
app.get("/register/user", (req, res) => {
  res.render("registerUser"); // Rendering the registration page
});

app.get("/register/vendor", (req, res) => {
  res.render("registerVendor");
});

// Login route
app.get("/login/user", (req, res) => {
  res.render("loginUser"); // Rendering the login page
});

app.get("/login/vendor", (req, res) => {
  res.render("loginVendor"); // Rendering the login page
});

// Adding new user
app.post("/register/user", async (req, res) => {
  const {
    userID,
    userName,
    userEmail,
    userPassword,
    userPhoneNumber,
    userAddress,
  } = req.body;

  if (
    !userID ||
    !userName ||
    !userEmail ||
    !userPassword ||
    !userPhoneNumber ||
    !userAddress
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Check if user ID or email already exists
    const [existingUser] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT userID FROM user WHERE userID = ? OR userEmail = ?",
        [userID, userEmail],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User ID or email already exists!",
      });
    }

    // Insert the new user into the database
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO user (userID, userName, userEmail, userPassword, userPhoneNumber, userAddress) VALUES (?, ?, ?, ?, ?, ?)",
        [
          userID,
          userName,
          userEmail,
          userPassword,
          userPhoneNumber,
          userAddress,
        ],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    // Create cart for the user
    const cartID = uuidv4();
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Cart (cartID, userID, TotalAmount) VALUES (?, ?, ?)",
        [cartID, userID, 0],
        (err, cartResult) => {
          if (err) reject(err);
          resolve(cartResult);
        }
      );
    });

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({
      message: "An error occurred during registration. Please try again.",
    });
  }
});

// Check vendor ID availability
app.get("/check-vendorid/:vendorID", (req, res) => {
  const { vendorID } = req.params;

  db.query(
    "SELECT vendorID FROM Vendors WHERE vendorID = ?",
    [vendorID],
    (err, results) => {
      if (err) {
        console.error("Error checking vendor ID:", err);
        return res
          .status(500)
          .json({ message: "Error checking vendor ID availability" });
      }
      res.json({ available: results.length === 0 });
    }
  );
});

// Adding new vendor
app.post("/register/vendor", async (req, res) => {
  const {
    vendorID,
    vendorName,
    vendorPhoneNumber,
    vendorAddress,
    vendorPassword,
    vendorEmail,
  } = req.body;

  // Validate required fields
  if (
    !vendorID ||
    !vendorName ||
    !vendorPhoneNumber ||
    !vendorAddress ||
    !vendorPassword ||
    !vendorEmail
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(vendorEmail)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate phone number format
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(vendorPhoneNumber)) {
    return res
      .status(400)
      .json({ message: "Phone number must be exactly 10 digits" });
  }

  try {
    // Check if vendor ID or email already exists
    const [existingVendor] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT vendorID, vendorEmail FROM Vendors WHERE vendorID = ? OR vendorEmail = ?",
        [vendorID, vendorEmail],
        (err, results) => {
          if (err) {
            console.error("Database query error:", err);
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });

    if (existingVendor) {
      if (existingVendor.vendorID === vendorID) {
        return res.status(400).json({ message: "Vendor ID already exists" });
      }
      if (existingVendor.vendorEmail === vendorEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // Insert the new vendor into the database
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Vendors (vendorID, vendorName, vendorPhoneNumber, vendorAddress, vendorPassword, vendorEmail) VALUES (?, ?, ?, ?, ?, ?)",
        [
          vendorID,
          vendorName,
          vendorPhoneNumber,
          vendorAddress,
          vendorPassword,
          vendorEmail,
        ],
        (err, result) => {
          if (err) {
            console.error("Database insert error:", err);
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });

    res.status(201).json({ message: "Vendor registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "An error occurred during registration. Please try again.",
      error: error.message,
    });
  }
});

// User login route
app.post("/login/user", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  if (!email || !password) {
    console.error("Email or password not provided");

    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [user] = await new Promise((resolve, reject) => {
      console.log("Querying database for user:", email);

      db.query(
        "SELECT * FROM user WHERE userEmail = ?",
        [email],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (!user) {
      console.error("User not found for email:", email);

      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (password !== user.userPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Set session data
    req.session.user = {
      userID: user.userID,
      userName: user.userName,
      userEmail: user.userEmail,
    };

    res.status(200).json({
      message: "Login successful",
      user: {
        userID: user.userID,
        userName: user.userName,
        userEmail: user.userEmail,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

//vendor login
app.post("/login/vendor", async (req, res) => {
  const { vendorEmail, vendorPassword } = req.body;

  try {
    // Query to fetch the vendor's details based on the provided email
    const [vendor] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM Vendors WHERE vendorEmail = ?",
        [vendorEmail],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    if (vendorPassword !== vendor.vendorPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Store vendor details in session
    req.session.vendorID = vendor.vendorID;
    req.session.vendorName = vendor.vendorName;
    req.session.vendorEmail = vendor.vendorEmail;
    req.session.vendorAddress = vendor.vendorAddress;
    req.session.vendorPhoneNumber = vendor.vendorPhoneNumber;

    // Send success response with vendor details
    res.status(200).json({
      message: "Login successful",
      vendor: {
        vendorID: vendor.vendorID,
        vendorName: vendor.vendorName,
        vendorEmail: vendor.vendorEmail,
        vendorAddress: vendor.vendorAddress,
        vendorPhoneNumber: vendor.vendorPhoneNumber,
      },
      redirectUrl: "/vendordashboard",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

//home route
app.get("/user/view", (req, res) => {
  res.render("homeUser", {
    userID: req.session.userID,
    userName: req.session.userName,
  });
});

//view profile
app.get("/user/profile", (req, res) => {
  console.log("view", req.session);
  console.log(req.session.userEmail);
  console.log("VIEW", req.params);

  res.json({
    userID: req.session.userID,
    userName: req.session.userName,
    userEmail: req.session.userEmail,
    userAddress: req.session.userAddress,
    userPhoneNumber: req.session.userPhoneNumber,
    userPassword: req.session.userPassword,
  });
});

//edit route for user
app.get("/user/edit", (req, res) => {
  if (!req.session.userID) {
    return res.redirect("/login/user"); // Redirect to login if user is not logged in
  }

  // Fetch user profile details from the session
  const {
    userID,
    userName,
    userEmail,
    userAddress,
    userPhoneNumber,
    userPassword,
  } = req.session;

  res.render("edit", {
    userID,
    userName,
    userEmail,
    userAddress,
    userPhoneNumber,
    userPassword,
  });
});

//pacth edit route for user
app.patch("/user/edit", (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Session at /user/edit:", req.session);

  const {
    newUserID,
    formPassword,
    newUserName,
    newUserEmail,
    newUserAddress,
    newUserPhoneNumber,
  } = req.body;

  if (
    !newUserID ||
    !formPassword ||
    !newUserName ||
    !newUserEmail ||
    !newUserAddress ||
    !newUserPhoneNumber
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "SELECT * FROM user WHERE userID = ?";

  db.query(query, [newUserID], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res
        .status(500)
        .json({ message: "An error occurred, please try again." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];

    // Direct password comparison
    if (formPassword !== user.userPassword) {
      console.log("Password mismatch");
      return res.status(403).json({ message: "Incorrect password." });
    }

    const updateQuery =
      "UPDATE user SET userName = ?, userEmail = ?, userAddress = ?, userPhoneNumber = ? WHERE userID = ?";

    db.query(
      updateQuery,
      [
        newUserName,
        newUserEmail,
        newUserAddress,
        newUserPhoneNumber,
        newUserID,
      ],
      (updateError) => {
        if (updateError) {
          console.error("Update error:", updateError);
          return res
            .status(500)
            .json({ message: "An error occurred, please try again." });
        }

        // Update session data
        req.session.userID = newUserID;
        req.session.userName = newUserName;
        req.session.userEmail = newUserEmail;
        req.session.userAddress = newUserAddress;
        req.session.userPhoneNumber = newUserPhoneNumber;

        console.log("Updated session data:", req.session);

        // Return a success response
        res.status(200).json({ message: "Profile updated successfully." });
      }
    );
  });
});

//vendor edit
app.get("/vendor/view", (req, res) => {
  res.render("homeUser", { userID: req.session.userID });
});

//view profile vendor
app.get("/vendor/profile", (req, res) => {
  console.log("view", req.session);
  console.log(req.session.vendorEmail);
  console.log("VIEW", req.params);

  res.json({
    vendorID: req.session.vendorID,
    vendorName: req.session.vendorName,
    vendorEmail: req.session.vendorEmail,
    vendorAddress: req.session.vendorAddress,
    vendorPhoneNumber: req.session.vendorPhoneNumber,
    vendorPassword: req.session.vendorPassword,
  });
});

//edit profile vendor
app.get("/vendor/edit", (req, res) => {
  if (!req.session.userID) {
    return res.redirect("/login/vendor"); // Redirect to login if user is not logged in
  }

  // Fetch user profile details from the session
  const {
    vendorID,
    vendorName,
    vendorEmail,
    vendorAddress,
    vendorPhoneNumber,
    vendorPassword,
  } = req.session;

  res.render("editVendor", {
    vendorID,
    vendorName,
    vendorEmail,
    vendorAddress,
    vendorPhoneNumber,
    vendorPassword,
  });
});

//patch vendor
app.patch("/vendor/edit", (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Session at /vendor/edit:", req.session);

  const {
    newVendorID,
    formPassword,
    newVendorName,
    newVendorEmail,
    newVendorAddress,
    newVendorPhoneNumber,
  } = req.body;

  if (
    !newVendorID ||
    !formPassword ||
    !newVendorName ||
    !newVendorEmail ||
    !newVendorAddress ||
    !newVendorPhoneNumber
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "SELECT * FROM Vendors WHERE vendorID = ?";

  db.query(query, [newVendorID], (error, results) => {
    // Use newVendorID here
    if (error) {
      console.error("Database error:", error);
      return res
        .status(500)
        .json({ message: "An error occurred, please try again." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const vendor = results[0];

    // Direct password comparison
    if (formPassword !== vendor.vendorPassword) {
      console.log("Password mismatch");
      return res.status(403).json({ message: "Incorrect password." });
    }

    const updateQuery =
      "UPDATE Vendors SET vendorName = ?, vendorEmail = ?, vendorAddress = ?, vendorPhoneNumber = ? WHERE vendorID = ?";

    db.query(
      updateQuery,
      [
        newVendorName,
        newVendorEmail,
        newVendorAddress,
        newVendorPhoneNumber,
        newVendorID,
      ],
      (updateError) => {
        if (updateError) {
          console.error("Update error:", updateError);
          return res
            .status(500)
            .json({ message: "An error occurred, please try again." });
        }

        // Update session data
        req.session.vendorID = newVendorID;
        req.session.vendorName = newVendorName;
        req.session.vendorEmail = newVendorEmail;
        req.session.vendorAddress = newVendorAddress;
        req.session.vendorPhoneNumber = newVendorPhoneNumber;

        console.log("Updated session data:", req.session);

        // Return a success response
        res.status(200).json({ message: "Profile updated successfully." });
      }
    );
  });
});

// Route to update the total amount for the user
app.post("/cart", (req, res) => {
  const userID = req.session.userID; // Access userID from session
  const { TotalAmount } = req.body; // Destructure TotalAmount from request body

  console.log("User ID from session:", userID); // Debugging line
  console.log("Total Amount:", TotalAmount); // Debugging line

  // Check if userID and TotalAmount are defined
  if (!userID || TotalAmount === undefined) {
    return res
      .status(400)
      .json({ message: "User ID and total amount are required." });
  }

  // Update the total amount in the Cart table
  db.query(
    "UPDATE Cart SET TotalAmount = ? WHERE userID = ?",
    [TotalAmount, userID],
    (err, result) => {
      if (err) {
        console.error("Error updating total amount:", err);
        return res.status(500).json({ message: "Error updating total amount" });
      }

      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "User not found or no update made" });
      }

      res.status(200).json({ message: "Total amount updated successfully" });
    }
  );
});

//fetch from product databse
app.get("/products", (req, res) => {
  console.log("Fetching products...");
  db.query("SELECT * FROM product", (err, products) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch products", details: err.message });
    }
    if (!products || products.length === 0) {
      return res.json([]);
    }
    console.log(`Found ${products.length} products`);
    res.json(products);
  });
});

// app.get('/addproduct', (req, res) => {
//     const vendorID = req.session.vendorID; // Assuming vendorID is stored in the session

//     if (!vendorID) {
//         return res.status(401).json({ message: 'Unauthorized. Vendor not logged in.' });
//     }
//         // Return the list of products
//         return res.status(200).jsoxn({ message: 'Products retrieved successfully',product });
//     });
app.get("/addproduct", (req, res) => {
  const vendorID = req.session.vendorID; // Assuming vendorID is stored in the session

  if (!vendorID) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Vendor not logged in." });
  }

  // SQL query to fetch products for the logged-in vendor
  const query = "SELECT * FROM product WHERE vendorID = ?";

  db.query(query, [vendorID], (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this vendor." });
    }

    // Return the list of productsw
    return res
      .status(200)
      .json({ message: "Products retrieved successfully", products: results });
  });
});

// Get product names for dropdown
app.get("/products/names", (req, res) => {
  const query = "SELECT DISTINCT name FROM fruits_images";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching product names:", err);
      return res.status(500).json({ error: "Failed to fetch product names" });
    }
    const productNames = results.map((result) => result.name);
    res.json({ products: productNames });
  });
});

app.post("/addproduct", (req, res) => {
  const { vendorID, productName, price, quantity, unit } = req.body;
  const productID = uuidv4();

  console.log("Received product data:", req.body);

  // Validate required fields
  if (!vendorID || !productName || !price || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Convert quantity to a number
  const newQuantity = Number(quantity);

  // Query to fetch imageURL based on productName
  const imageQuery = "SELECT imageURL FROM fruits_images WHERE name = ?";

  db.query(imageQuery, [productName], (err, imageResults) => {
    if (err) {
      console.error("Error fetching image:", err);
      return res.status(500).json({ error: "Error fetching image URL" });
    }

    if (imageResults.length === 0) {
      return res
        .status(404)
        .json({ error: "Image not found for the given product name" });
    }

    const imageURL = imageResults[0].imageURL;

    // Query to check if the product already exists
    const checkQuery =
      "SELECT * FROM product WHERE productName = ? AND vendorID = ?";

    db.query(checkQuery, [productName, vendorID], (err, results) => {
      if (err) {
        console.error("Error checking product:", err);
        return res
          .status(500)
          .json({ error: "Error checking product existence" });
      }

      if (results.length > 0) {
        const existingProduct = results[0];
        if (
          existingProduct.price === price &&
          existingProduct.quantity === newQuantity
        ) {
          return res
            .status(400)
            .json({ error: "Product already added with the same details" });
        } else {
          // Update existing product by adding the new quantity
          const updatedQuantity = existingProduct.quantity + newQuantity;
          const updateQuery =
            "UPDATE product SET price = ?, quantity = ?, imageURL = ? WHERE productName = ? AND vendorID = ?";

          db.query(
            updateQuery,
            [price, updatedQuantity, imageURL, productName, vendorID],
            (err, result) => {
              if (err) {
                console.error("Error updating product:", err);
                return res
                  .status(500)
                  .json({ error: "Error updating product" });
              }
              return res.json({ message: "Product updated successfully" });
            }
          );
        }
      } else {
        // Insert new product
        const insertQuery =
          "INSERT INTO product (productID, vendorID, productName, price, quantity, unit, imageURL) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(
          insertQuery,
          [
            productID,
            vendorID,
            productName,
            price,
            newQuantity,
            unit || "kg",
            imageURL,
          ],
          (err, result) => {
            if (err) {
              console.error("Error adding product:", err);
              return res.status(500).json({ error: "Error adding product" });
            }
            res.json({ message: "Product added successfully" });
          }
        );
      }
    });
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // Handle order status updates
  socket.on("orderStatusUpdate", (data) => {
    io.emit("orderStatusChanged", data);
  });

  // Handle new orders
  socket.on("newOrder", (data) => {
    io.emit("orderReceived", data);
  });
});

//get user id
app.get("/check-userid/:userId", (req, res) => {
  const userId = req.params.userId; // Get userId from URL parameters

  if (!userId) {
    return res.status(400).json({ error: "UserID is required" });
  }

  // SQL query to check if userId exists in the database
  const query = "SELECT COUNT(*) AS count FROM user  WHERE userID = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // If count > 0, userId exists
    const count = results[0].count;
    if (count > 0) {
      res.json({ available: false, message: "UserID already exists!" });
    } else {
      res.json({ available: true, message: "UserID is available" });
    }
  });
});

//subscription
const subscriptionRoutes = require("./routes/subscription");
app.use("/subscription", subscriptionRoutes);

app.post("/payment/verify", async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    subscriptionId,
  } = req.body;

  try {
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      const query =
        "UPDATE Subscription SET payment_status = ? WHERE subs_ID = ?";
      await db.promise().execute(query, ["paid", subscriptionId]);
      res.json({ status: "success" });
    } else {
      const query =
        "UPDATE Subscription SET payment_status = ? WHERE subs_ID = ?";
      await db.promise().execute(query, ["failed", subscriptionId]);
      res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.post("/subscription_products", (req, res) => {
  console.log("Received request:", req.body);
  const { subsID, productID, quantity } = req.body;

  console.log("Received cart data:", req.body); // Log incoming data for debugging

  if (!subsID || !productID || !quantity) {
    return res.status(400).send("All fields are required"); // Return error if any field is missing
  }

  const query = `INSERT INTO Subscription_Products (subs_ID, productID, quantity) VALUES (?, ?, ?)`;

  db.query(query, [subsID, productID, quantity], (err, result) => {
    if (err) {
      console.error("Error adding product to subscription:", err); // Log error if query fails
      res.status(500).send("Error adding product");
    } else {
      console.log("Product added to subscription:", result); // Log successful insert
      res.status(200).send("Product added to subscription");
    }
  });
});

// Define your cancelToday function
const cancelToday = (subs_ID, callback) => {
  const query =
    "UPDATE Subscription SET EndDate = DATE_ADD(EndDate, INTERVAL 1 DAY) WHERE subs_ID = ?";

  db.query(query, [subs_ID], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      callback(error, null);
      return;
    }

    // Retrieve the new end date
    const newQuery = "SELECT EndDate FROM Subscription WHERE subs_ID = ?";
    db.query(newQuery, [subs_ID], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        callback(err, null);
        return;
      }
      callback(null, rows[0].EndDate);
    });
  });
};

// Your existing Express route
app.put("/subscription/cancelToday", (req, res) => {
  const { subs_ID } = req.body;

  cancelToday(subs_ID, (error, newEndDate) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.json({ message: "Subscription canceled successfully", newEndDate });
  });
});

// Add this route to get subscription details
app.get("/subscription/details", (req, res) => {
  const { subs_ID } = req.query; // Get subs_ID from query parameters

  const query = "SELECT EndDate, StartDate FROM Subscription WHERE subs_ID = ?";
  db.query(query, [subs_ID], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Return the subscription details
    res.json({
      endDate: results[0].EndDate,
      startDate: results[0].StartDate,
    });
  });
});
//for all vendors
app.get("/vendors/details", (req, res) => {
  const sql = "SELECT vendorID , vendorName , vendorAddress FROM Vendors";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

//vendor details with particular id
app.get("/vendors/:vendorID", (req, res) => {
  const vendorID = req.params.vendorID;
  console.log(vendorID);
  const query = "SELECT * FROM Vendors WHERE vendorID = ?";

  db.query(query, [vendorID], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send({ message: "Vendor not found" });
    }
    res.json(results[0]); // Send back the vendor data
  });
});

// Route to fetch all reviews
app.get("/reviews", async (req, res) => {
  try {
    // First check if the reviews table exists
    const checkTableQuery = "SHOW TABLES LIKE 'reviews'";
    db.query(checkTableQuery, (tableErr, tableResults) => {
      if (tableErr) {
        console.error("Error checking reviews table:", tableErr);
        return res.status(500).json({ error: "Database error" });
      }

      if (tableResults.length === 0) {
        // Create the reviews table if it doesn't exist
        const createTableQuery = `
          CREATE TABLE reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userName VARCHAR(255) NOT NULL,
            userEmail VARCHAR(255) NOT NULL,
            rating INT NOT NULL,
            review TEXT NOT NULL,
            vendorID VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        db.query(createTableQuery, (createErr) => {
          if (createErr) {
            console.error("Error creating reviews table:", createErr);
            return res
              .status(500)
              .json({ error: "Failed to initialize reviews" });
          }
          // Return empty array for new table
          return res.json([]);
        });
      } else {
        // Table exists, fetch reviews
        const query = "SELECT * FROM reviews ORDER BY created_at DESC";
        db.query(query, (err, results) => {
          if (err) {
            console.error("Error fetching reviews:", err);
            return res.status(500).json({ error: "Failed to fetch reviews" });
          }
          res.json(results || []); // Send back the reviews as JSON, empty array if null
        });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//post request for review
app.post("/reviews", (req, res) => {
  const { name, email, rating, review, vendorID } = req.body;

  // Validate input
  if (!name || !email || !rating || !review || !vendorID) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate rating range
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  // Generate a unique reviewID using uuid
  const reviewID = uuid();

  // Prepare SQL query
  const sql =
    "INSERT INTO reviews (reviewID, userName, userEmail, rating, review, vendorID) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [reviewID, name, email, rating, review, vendorID],
    (err, result) => {
      if (err) {
        console.error("Error inserting review: ", err);
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({ message: "Invalid vendor ID." });
        }
        return res.status(500).json({ message: "Error inserting review" });
      }
      res.status(200).json({
        message: "Review submitted successfully!",
        reviewID: reviewID,
      });
    }
  );
});

//reviews for vendor

app.get("/reviews/vendor", (req, res) => {
  const vendorID = req.query.vendorID;

  if (!vendorID) {
    return res.status(400).json({ message: "Vendor ID is required." });
  }

  const sql =
    "SELECT * FROM reviews WHERE vendorID = ? ORDER BY created_at DESC";

  db.query(sql, [vendorID], (err, results) => {
    if (err) {
      console.error("Error fetching reviews: ", err);
      return res.status(500).json({ message: "Error fetching reviews" });
    }

    res.status(200).json(results);
  });
});
//orders
app.post("/orders", (req, res) => {
  console.log("Received order request:", req.body); // Log incoming request

  const { userID, vendorID, OrderDate, DeliveryDate, Status, TotalAmount } =
    req.body;
  const orderID = uuid();

  console.log("Order Details:", {
    orderID,
    userID,
    vendorID,
    OrderDate,
    DeliveryDate,
    Status,
    TotalAmount,
  });

  try {
    // Test database connection
    db.query("SELECT 1"); // Simple test query

    const query = `INSERT INTO Orders (orderID, userID, vendorID, OrderDate, DeliveryDate, Status, TotalAmount)
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      orderID,
      userID,
      vendorID,
      OrderDate,
      DeliveryDate,
      Status,
      TotalAmount,
    ];

    // Execute the query with await
    db.query(query, values);
    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error.message); // Log specific error message
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message }); // Send error details to the client
  }
});
// tch orders for a specific vendor

app.get("/orders", (req, res) => {
  const { vendor } = req.query;
  const trimmedVendor = vendor?.trim() || ""; // Use optional chaining and default to empty string
  console.log(trimmedVendor);

  if (!trimmedVendor) {
    return res.status(400).json({ message: "Vendor ID is required." });
  }

  // Use backticks for template literals to properly include the status
  db.execute(
    "SELECT * FROM Orders WHERE Status = ? AND vendorID = ?",
    ["Pending", trimmedVendor],
    (error, results) => {
      if (error) {
        console.error("Error fetching vendor orders:", error.message);
        return res.status(500).json({
          message: "Failed to fetch vendor orders",
          error: error.message,
        });
      }

      console.log("Results:", results); // This will log the fetched rows

      if (!results || results.length === 0) {
        return res
          .status(404)
          .json({ message: "No orders found for this vendor." });
      }

      res.status(200).json(results); // Send the fetched rows as response
    }
  );
});

// Endpoint to update order status
app.patch("/orders/:orderID", (req, res) => {
  const orderID = req.params.orderID;
  const { Status } = req.body; // Expecting the status to be passed in the body
  console.log(orderID);
  console.log(Status);
  // Update the order in the MySQL database
  const query = "UPDATE Orders SET Status = ? WHERE orderID = ?";
  db.execute(query, [Status, orderID], (error, results) => {
    if (error) {
      console.error("Error updating order:", error);
      return res.status(500).send("Internal Server Error");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Order not found");
    }
    res.status(200).json({ orderID: orderID, Status }); // Send back the updated status
  });
});

app.get("/completed-orders", (req, res) => {
  const vendorID = req.query.vendor; // Get vendorID from query params

  if (!vendorID) {
    return res.status(400).json({ error: "Vendor ID is required" });
  }

  const query = "SELECT * FROM Orders WHERE vendorID = ? AND Status = ?";
  db.execute(query, [vendorID, "Done"], (error, results) => {
    if (error) {
      console.error("Error fetching completed orders:", error);
      return res.status(500).send("Internal Server Error");
    }
    res.status(200).json(results); // Send back the completed orders
  });
});

// Update the server listening configuration
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is ready for connections`);
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    // Destroy session on logout
    if (err) throw err;
    res.redirect("/"); // Redirecting to home page after session is destroyed
  });
});

// Create payment intent
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "inr" } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paise
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// Handle successful payment
app.post("/api/payment-success", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update subscription status in database
      const query =
        "UPDATE Subscription SET payment_status = 'paid', payment_id = ? WHERE payment_id = ?";
      await db.promise().query(query, [paymentIntentId, paymentIntentId]);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    console.error("Payment success handling error:", error);
    res.status(500).json({ error: "Failed to process payment success" });
  }
});

// Handle payment failure
app.post("/api/payment-failure", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    // Update subscription status in database
    const query =
      "UPDATE Subscription SET payment_status = 'failed' WHERE payment_id = ?";
    await db.promise().query(query, [paymentIntentId]);
    res.json({ success: true });
  } catch (error) {
    console.error("Payment failure handling error:", error);
    res.status(500).json({ error: "Failed to process payment failure" });
  }
});

// Razorpay Routes
app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount,
      currency: currency,
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified, create order in database
      const { userID, vendorID, TotalAmount } = orderDetails;

      if (!userID || !vendorID || !TotalAmount) {
        return res
          .status(400)
          .json({ error: "Missing required order details" });
      }

      const newOrder = {
        userID: userID,
        vendorID: orderDetails.vendorID,
        OrderDate: new Date().toISOString().split("T")[0],
        DeliveryDate: new Date().toISOString().split("T")[0],
        Status: "Pending",
        TotalAmount: orderDetails.TotalAmount,
        PaymentStatus: "Completed",
        PaymentID: razorpay_payment_id,
        OrderID: razorpay_order_id,
      };

      // Insert order into database
      const query = `
        INSERT INTO orders (userID, vendorID, OrderDate, DeliveryDate, Status, TotalAmount, PaymentStatus, PaymentID, OrderID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        query,
        [
          orderDetails.userID,
          orderDetails.vendorID,
          orderDetails.OrderDate,
          orderDetails.DeliveryDate,
          orderDetails.Status,
          orderDetails.TotalAmount,
          orderDetails.PaymentStatus,
          orderDetails.PaymentID,
          orderDetails.OrderID,
        ],
        (error, results) => {
          if (error) {
            console.error("Error inserting order:", error);
            return res.status(500).json({ error: "Failed to create order" });
          }
          res.json({
            status: "success",
            message: "Payment verified and order created successfully",
            orderId: results.insertId,
          });
        }
      );
    } else {
      res
        .status(400)
        .json({ status: "failure", message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
