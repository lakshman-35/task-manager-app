import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import "./index.css";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  const showAlert = (message, type) => {
    setAlert({ message, type, visible: true });
    setTimeout(() => {
      setAlert({ ...alert, visible: false });
    }, 2000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://task-manager-app-r5xw.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert(data.message, "success");
        setFullName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showAlert(data.message, "error");
      }
    } catch (err) {
      showAlert("Something went wrong", "error");
    }
  };

  return (
    <div className="register-container">
      {alert.visible && (
        <div className={`popup-alert ${alert.type}`}>{alert.message}</div>
      )}
      
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon">
            <FaArrowRight />
          </div>
          <h1>Create your account</h1>
          <p>Join thousands of users managing their tasks efficiently.</p>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-group">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="register-button">
            Create Account
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login" className="signin-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
