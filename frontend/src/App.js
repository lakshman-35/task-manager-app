import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';

import Home from './components/Home'

import ProtectedRoute  from './components/ProtectedRoute';

import axios from 'axios';
import './App.css';
import TaskManager from './components/TaskManager';

function App() {
  const [tasks, setTasks] = useState([]);
  
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path = '/tasks' element = {<ProtectedRoute><TaskManager /> </ProtectedRoute>} />
          <Route exact path="/" element={ <ProtectedRoute> <Home/> </ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
