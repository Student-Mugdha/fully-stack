const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Get all subscription plans
router.get("/plans", (req, res) => {
  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 999,
      duration: 1,
      features: [
        "Weekly delivery",
        "5 items per delivery",
        "Basic fruits and vegetables",
      ],
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: 1899,
      duration: 1,
      features: [
        "Bi-weekly delivery",
        "10 items per delivery",
        "Premium fruits and vegetables",
        "Priority delivery",
      ],
    },
    {
      id: "family",
      name: "Family Plan",
      price: 2999,
      duration: 1,
      features: [
        "Daily delivery",
        "15 items per delivery",
        "Premium fruits and vegetables",
        "Priority delivery",
        "Custom selection",
      ],
    },
  ];
  res.json(plans);
});

// Create new subscription
router.post("/subscribe", async (req, res) => {
  const { userID, planId } = req.body;
  const subscriptionId = uuidv4();

  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    const query = `
      INSERT INTO Subscription 
      (subs_ID, userID, subs_Type, StartDate, EndDate, payment_status) 
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    await db
      .promise()
      .execute(query, [
        subscriptionId,
        userID,
        planId,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      ]);

    res.status(201).json({
      message: "Subscription created successfully",
      subscriptionId,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Error creating subscription" });
  }
});

// Get user's subscriptions
router.get("/user/:userId", async (req, res) => {
  try {
    const query = `
      SELECT s.*, 
        CASE 
          WHEN s.EndDate < CURDATE() THEN 'EXPIRED'
          WHEN s.payment_status = 'paid' THEN 'ACTIVE'
          ELSE 'PENDING'
        END as status
      FROM Subscription s
      WHERE s.userID = ?
      ORDER BY s.created_at DESC
    `;

    const [subscriptions] = await db
      .promise()
      .execute(query, [req.params.userId]);
    res.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Error fetching subscriptions" });
  }
});

// Cancel subscription
router.post("/cancel/:subscriptionId", async (req, res) => {
  try {
    const query = `
      UPDATE Subscription 
      SET EndDate = CURDATE()
      WHERE subs_ID = ? AND payment_status = 'paid'
    `;

    const [result] = await db
      .promise()
      .execute(query, [req.params.subscriptionId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Subscription not found or already cancelled" });
    }

    res.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ message: "Error cancelling subscription" });
  }
});

// Renew subscription
router.post("/renew/:subscriptionId", async (req, res) => {
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const query = `
      UPDATE Subscription 
      SET StartDate = ?, EndDate = ?, payment_status = 'pending'
      WHERE subs_ID = ?
    `;

    const [result] = await db
      .promise()
      .execute(query, [
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
        req.params.subscriptionId,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({
      message: "Subscription renewed successfully",
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error renewing subscription:", error);
    res.status(500).json({ message: "Error renewing subscription" });
  }
});

module.exports = router;
