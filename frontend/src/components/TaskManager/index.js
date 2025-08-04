import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaCheckCircle, FaClock, FaExclamationTriangle, FaListUl } from "react-icons/fa";
import "./index.css";
import Navbar from "../Navbar";
import TaskForm from "../TaskForm";

const TaskManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [editTask, setEditTask] = useState(null); 
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

  // Get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get("https://task-manager-app-r5xw.onrender.com/api/tasks", {
        headers: getAuthHeaders()
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  }, []);

  useEffect(() => {
    // Get user info on component mount
    const userInfo = getUserInfo();
    setUser(userInfo);
    
    // Fetch user's tasks
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskAddedOrUpdated = () => {
    setShowForm(false);
    setEditTask(null);
    fetchTasks();
  };

  const handleTaskDeleted = async (id) => {
    try {
      await axios.delete(`https://task-manager-app-r5xw.onrender.com/api/tasks/${id}`, {
        headers: getAuthHeaders()
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
        return <FaCheckCircle className="status-icon done" />;
      case "In Progress":
        return <FaClock className="status-icon in-progress" />;
      default:
        return <FaListUl className="status-icon todo" />;
    }
  };

  const overdueTasks = tasks.filter((t) => new Date(t.due_date) < new Date() && t.status !== "Done").length;

  return (
    <>
      <Navbar />

      <div className="task-manager">
        <div className="dashboard-container">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-text">
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="dashboard-subtitle">
                  {user ? `Welcome back, ${user.fullName}! Manage your tasks efficiently` : 'Manage your tasks efficiently'}
                </p>
              </div>
              <button
                className="new-task-btn"
                onClick={() => {
                  setEditTask(null);
                  setShowForm(true);
                }}
              >
                <FaPlus className="plus-icon" />
                New Task
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <FaListUl />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{tasks.length}</h3>
                <p className="stat-label">Total Tasks</p>
              </div>
            </div>
            
            <div className="stat-card completed">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{tasks.filter((t) => t.status === "Done").length}</h3>
                <p className="stat-label">Completed</p>
              </div>
            </div>
            
            <div className="stat-card in-progress">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{tasks.filter((t) => t.status === "In Progress").length}</h3>
                <p className="stat-label">In Progress</p>
              </div>
            </div>
            
            <div className="stat-card pending">
              <div className="stat-icon">
                <FaListUl />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{tasks.filter((t) => t.status === "To Do").length}</h3>
                <p className="stat-label">Pending</p>
              </div>
            </div>
            
            <div className="stat-card overdue">
              <div className="stat-icon">
                <FaExclamationTriangle />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{overdueTasks}</h3>
                <p className="stat-label">Overdue</p>
              </div>
            </div>
          </div>

         
          <div className="search-filter-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="search"
                placeholder="Search your tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-box">
              <FaFilter className="filter-icon" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option>All Statuses</option>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="tasks-section">
            <div className="tasks-header">
              <h2 className="tasks-title">
                {filteredTasks.length > 0 ? `${filteredTasks.length} Task${filteredTasks.length !== 1 ? 's' : ''}` : 'No Tasks'}
              </h2>
              {user && (
                <p className="tasks-subtitle">
                  Showing tasks for {user.fullName}
                </p>
              )}
            </div>
            
            <div className="task-cards">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div className="task-card" key={task.id}>
                    <div className="task-header">
                      <div className="task-title-section">
                        {getStatusIcon(task.status)}
                        <h3 className="task-title">{task.title}</h3>
                      </div>
                      <div className="task-actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => {
                            setEditTask(task);
                            setShowForm(true);
                          }}
                          title="Edit Task"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleTaskDeleted(task.id)}
                          title="Delete Task"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    <p className="task-description">{task.description}</p>
                    
                    <div className="task-meta">
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <span className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}>
                        {task.status}
                      </span>
                      <span className="due-date">
                        📅 {task.due_date?.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FaListUl />
                  </div>
                  <h3 className="empty-title">No tasks found</h3>
                  <p className="empty-description">
                    {searchTerm || statusFilter !== "All Statuses" 
                      ? "Try adjusting your search or filter criteria"
                      : "Create your first task to get started"
                    }
                  </p>
                  {!searchTerm && statusFilter === "All Statuses" && (
                    <button
                      className="create-first-task-btn"
                      onClick={() => setShowForm(true)}
                    >
                      <FaPlus />
                      Create Your First Task
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => { setShowForm(false); setEditTask(null); }}>
              &times;
            </button>
            <TaskForm onTaskAdded={handleTaskAddedOrUpdated} editingTask={editTask} />
          </div>
        </div>
      )}
    </>
  );
};

export default TaskManager;
