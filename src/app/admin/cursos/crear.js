"use client";

import React from "react";

const FormExample = () => {
  const formContainerStyle = {
    maxWidth: "800px",
    margin: "0 0",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  };

  const buttonStyle = {
    padding: "0.8rem 1.5rem",
    borderRadius: "6px",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
  };

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#e5e7eb",
    color: "#374151",
    marginRight: "1rem",
  };

  const nextButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2563eb",
    color: "#fff",
  };

  return (
    <div style={formContainerStyle}>
      <h2>About your company</h2>
      <p>Enter detailed information about your company.</p>
      <form>
        <label>
          Company Name
          <input
            type="text"
            placeholder="Enter your company name"
            style={inputStyle}
          />
        </label>

        <div style={{ display: "flex", gap: "1rem" }}>
          <label style={{ flex: 1 }}>
            Type
            <select style={inputStyle}>
              <option value="">Select</option>
              <option value="startup">Startup</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>
            Company Size
            <select style={inputStyle}>
              <option value="">Choose the size of your company</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>
        </div>

        <label>
          Address
          <input type="text" placeholder="Enter your address" style={inputStyle} />
        </label>

        <div style={{ display: "flex", gap: "1rem" }}>
          <label style={{ flex: 1 }}>
            Country
            <select style={inputStyle}>
              <option value="">Select a country</option>
              <option value="usa">USA</option>
              <option value="canada">Canada</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>
            City
            <input type="text" placeholder="Enter your city" style={inputStyle} />
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button type="button" style={backButtonStyle}>
            Previous step
          </button>
          <button type="submit" style={nextButtonStyle}>
            Next step
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormExample;
