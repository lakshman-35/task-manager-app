import React from 'react';
import axios from 'axios';

function TaskList({ tasks, onTaskDeleted }) {
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    onTaskDeleted();
  };
a
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: <strong>{task.status}</strong></p>
          <p>Priority: <strong>{task.priority}</strong></p>
          <p>Due: {task.due_date?.slice(0, 10)}</p>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
