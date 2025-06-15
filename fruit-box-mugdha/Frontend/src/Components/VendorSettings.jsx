import React, { useState, useEffect } from "react";
import VendorNavbar from "./VendorNavbar";
import api from "../api/config";

const VendorSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    reviewNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/vendor/settings");
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setError("Failed to fetch settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = async (setting) => {
    try {
      const updatedSettings = {
        ...settings,
        [setting]: !settings[setting],
      };
      await api.put("/vendor/settings", updatedSettings);
      setSettings(updatedSettings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <VendorNavbar />
      <div className="settings-content">
        <h1>Account Settings</h1>

        {error && <div className="error-message">{error}</div>}

        {success && (
          <div className="success-message">Settings updated successfully!</div>
        )}

        <div className="settings-grid">
          {/* Notification Settings */}
          <div className="settings-section">
            <h2>Notification Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Email Notifications</h3>
                  <p>Receive general notifications via email</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange("emailNotifications")}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Order Notifications</h3>
                  <p>Get notified about new orders</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.orderNotifications}
                    onChange={() => handleSettingChange("orderNotifications")}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Review Notifications</h3>
                  <p>Get notified about new reviews</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.reviewNotifications}
                    onChange={() => handleSettingChange("reviewNotifications")}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="settings-section">
            <h2>Security Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={() => handleSettingChange("twoFactorAuth")}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Marketing Preferences */}
          <div className="settings-section">
            <h2>Marketing Preferences</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Marketing Emails</h3>
                  <p>Receive updates about new features and promotions</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={() => handleSettingChange("marketingEmails")}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSettings;
