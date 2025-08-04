import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import "./index.css";

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  const showAlert = (message, type) => {
    setAlert({ message, type, visible: true });
    setTimeout(() => {
      setAlert({ ...alert, visible: false });
    }, 2000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        showAlert(data.message, "success");
        setEmail("");
        setPassword("");
        navigate("/");
      } else {
        showAlert(data.message, "error");
      }
    } catch (err) {
      showAlert("Something went wrong", "error");
    }
  };

  return (
    <div className="login-container">
      {alert.visible && (
        <div className={`popup-alert ${alert.type}`}>{alert.message}</div>
      )}
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <FaArrowRight />
          </div>
          <h1>Sign in with email</h1>
          <p>Make a new doc to bring your words, data, and teams together. For free.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
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
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="login-button">
            Get Started
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
