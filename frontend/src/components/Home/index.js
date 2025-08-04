import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import taskImage from "../../assets/task_manage.webp";
import "./index.css";
import Navbar from "../Navbar";
import TaskForm from "../TaskForm";

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  // Get user info from localStorage
  const getUserInfo = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    // Get user info on component mount
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

  const handleTaskAdded = () => {
    setShowForm(false);
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-content">
          <div className="home-text-section">
            <h1 className="home-heading">
              TASK MANAGEMENT
            </h1>
            <p className="home-description">
              {user 
                ? `Welcome, ${user.fullName}! A Task Management app helps you efficiently create, track, and organize your tasks based on priority and status. It enhances productivity by streamlining task workflows and deadlines.`
                : 'A Task Management app helps users efficiently create, track, and organize their tasks based on priority and status. It enhances productivity by streamlining task workflows and deadlines.'
              }
            </p>
            <button className="create-task-button" onClick={() => setShowForm(true)}>
              CREATE TASK <FaPlus className="plus-icon" />
            </button>
          </div>
          <div className="home-image-section">
            <img src={taskImage} alt="Task Management" className="home-illustration" />
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowForm(false)}>
              &times;
            </button>
            <TaskForm onTaskAdded={handleTaskAdded} editingTask={null} />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
