import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaSave } from 'react-icons/fa';

function TaskForm({ onTaskAdded, editingTask }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Low',
    dueDate: ''
  });

  // Get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'To Do',
        priority: editingTask.priority || 'Low',
        dueDate: editingTask.due_date ? editingTask.due_date.slice(0, 10) : ''
      });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        // Update existing task
        await axios.put(`http://localhost:5000/tasks/${editingTask.id}`, formData, {
          headers: getAuthHeaders()
        });
      } else {
        // Create new task
        await axios.post('http://localhost:5000/tasks', formData, {
          headers: getAuthHeaders()
        });
      }
      
      // Reset form
      setFormData({ title: '', description: '', status: 'To Do', priority: 'Low', dueDate: '' });
      onTaskAdded();
    } catch (error) {
      console.error('Error saving task:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className="task-form-container">
      <div className="form-header">
        <div className="form-icon">
          {editingTask ? <FaEdit /> : <FaPlus />}
        </div>
        <h2 className="form-title">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <p className="form-subtitle">
          {editingTask ? 'Update your task details below' : 'Add a new task to your dashboard'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label className="form-label">Task Title *</label>
          <input
            type="text"
            placeholder="Enter task title..."
            value={formData.title}
            required
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            placeholder="Describe your task..."
            value={formData.description}
            required
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-textarea"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingTask ? <FaSave /> : <FaPlus />}
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
