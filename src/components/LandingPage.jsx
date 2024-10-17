import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import "../styles/MachineIdForm.css";

const LandingPage = () => {
  const [machineConfiguration, setMachineConfiguration] = useState(null);
  const [error, setError] = useState("");
  const [connectedTo, setConnectedTo] = useState("Unknown");
  const [loading, setLoading] = useState(true);
  const [platformUrl, setPlatformUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchConfiguration(), fetchConnectedTo()]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (platformUrl) {
      window.location.href = platformUrl;
    }
  }, [platformUrl]);

  const fetchConfiguration = async () => {
    try {
      const configResponse = await axiosInstance.get("/configuration");
      setMachineConfiguration(configResponse.data);
      initializePlatform();
    } catch (err) {
      console.error("Error fetching configuration:", err);
      setError("Failed to fetch machine configuration");
      setLoading(false);
    }
  };

  const fetchConnectedTo = async () => {
    try {
      const response = await axiosInstance.get("/server/info");
      setConnectedTo(response.data.lanserverIP);
    } catch (err) {
      console.error("Error fetching connected status:", err);
    }
  };

  const checkPlatformUrl = async () => {
    try {
      const response = await axiosInstance.get("/configuration");
      console.log("configuration response", response.data);

      if (response.data?.data?.platform_responsse) {
        const url = response.data.data.platform_responsse.data.url;
        console.log("url", url);
        setPlatformUrl(url);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (err) {
      console.error("Error checking platform URL:", err);
    }
  };

  const initializePlatform = () => {
    const intervalId = setInterval(() => {
      checkPlatformUrl();
    }, 2000);

    return () => clearInterval(intervalId);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="status-container">
          <svg className="spinner" aria-label="Loading..." />

          <p className="loading-text">Initializing, please wait...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="status-container error">
          <p className="error">{error.message}</p>

          <button onClick={() => retryAction()}>Try Again</button>
        </div>
      );
    }

    return (
      <div className="status-container redirecting">
        <progress value="50" max="100" />

        <p>Redirecting to the platform... (5 seconds remaining)</p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.imageContainer}>
          <img
            src="https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=https%3A%2F%2Fplayerapp.nttplatform.com%2F"
            alt="QR Code"
            style={styles.qrCode}
          />
        </div>
        <div style={styles.formContainer}>
          {machineConfiguration && (
            <div style={styles.configInfo}>
              <h3>Machine Details</h3>
              <p>
                <strong>Machine ID:</strong>{" "}
                {machineConfiguration.data.machine_id}
              </p>
              <p>
                <strong>Connected to Server:</strong> {connectedTo}
              </p>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Styles remain unchanged
const styles = {};

// Add keyframes for the spinner animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }",
  styleSheet.cssRules.length
);

export default LandingPage;
