import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaSave } from "react-icons/fa";
import "./TaskForm.css";


const TaskForm = ({ onTaskAdded, editingTask }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: ""
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "To Do",
        priority: editingTask.priority || "Medium",
        dueDate: editingTask.due_date ? editingTask.due_date.slice(0, 10) : ""
      });
    }
  }, [editingTask]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate
      };

      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask.id}`, taskData, {
          headers: getAuthHeaders()
        });
      } else {
        await axios.post("/api/tasks", taskData, {
          headers: getAuthHeaders()
        });
      }

      onTaskAdded();
    } catch (error) {
      console.error("Error saving task:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="task-form-container">
      <div className="form-header">
        <div className="form-icon">
          {editingTask ? <FaEdit /> : <FaPlus />}
        </div>
        <div className="form-title-section">
          <h2 className="form-title">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <p className="form-subtitle">
            {editingTask ? "Update your task details" : "Add a new task to your list"}
          </p>
        </div>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Enter task description"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingTask ? (
              <>
                <FaSave />
                Update Task
              </>
            ) : (
              <>
                <FaPlus />
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
