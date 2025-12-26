import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import "./index.css";

import TaskList from "./taskList";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const API_URL =
    process.env.REACT_APP_RENDER_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleClick = () => {
    if (input.trim() === "") return;

    fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: input }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((res) => {
        setTasks([...tasks, res.task]);
        setInput("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInput("");
  };

  const handleDelete = (task) => {
    fetch(`${API_URL}/tasks/${task._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        const newTasks = tasks.filter((t) => t._id !== data._id);
        setTasks(newTasks);
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const handleToggleComplete = (task) => {
    fetch(`${API_URL}/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isCompleted: !task.isCompleted }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((res) => {
        tasks.map((t) => {
          if (t._id === res.task._id) {
            t.isCompleted = res.task.isCompleted;
            setTasks([...tasks]);
          }
        });
      })
      .catch((error) => console.error("Error editig task state:", error));
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Task Manager
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Your Task"
            value={input}
            onChange={handleChange}
          ></input>
          <button
            onClick={handleClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Add Task
          </button>
        </form>
        <TaskList
          tasks={tasks}
          handleDelete={handleDelete}
          handleToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
