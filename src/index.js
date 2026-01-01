import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import "./index.css";
import { Toaster, toast } from "react-hot-toast";

import TaskList from "./taskList";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [btnMessage, setbtnMessage] = useState("Loading...");

  const API_URL =
    process.env.REACT_APP_RENDER_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setbtnMessage("Loading...");
        const response = await fetch(`${API_URL}/tasks`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error(error.message);
      } finally {
        setbtnMessage("Add Task");
      }
    };
    fetchTasks();
  }, []);

  const handleClick = async () => {
    if (input.trim() === "") return;

    setbtnMessage("Adding...");

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: input }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const res = await response.json();
      setTasks([...tasks, res.task]);
      setInput("");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(error.message);
    } finally {
      setbtnMessage("Add Task");
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInput("");
  };

  const handleDelete = async (task) => {
    setbtnMessage("Deleting...");

    try {
      const response = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();
      const newTasks = tasks.filter((t) => t._id !== data._id);
      setTasks(newTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.message);
    } finally {
      setbtnMessage("Add Task");
    }
  };

  const handleToggleComplete = async (task) => {
    setbtnMessage("Updating...");

    try {
      const response = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: !task.isCompleted }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const res = await response.json();
      tasks.map((t) => {
        if (t._id === res.task._id) {
          t.isCompleted = res.task.isCompleted;
          setTasks([...tasks]);
        }
      });
    } catch (error) {
      console.error("Error editing task state:", error);
      toast.error(error.message);
    } finally {
      setbtnMessage("Add Task");
    }
  };

  const isBtnDisabled = btnMessage !== "Add Task";

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center py-10">
      <div>
        <Toaster />
      </div>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Task Manager
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex gap-4 sm:gap-2 mb-6 flex-col sm:flex-row items-center"
        >
          <input
            type="text"
            className="flex-1 w-full sm:w-auto border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Your Task"
            value={input}
            onChange={handleChange}
          ></input>
          <button
            onClick={handleClick}
            disabled={isBtnDisabled}
            className={`w-2/3 sm:w-auto ${
              isBtnDisabled ? "bg-blue-300" : "bg-blue-600"
            } text-white px-6 py-2 rounded-lg font-semibold ${
              isBtnDisabled ? "" : "hover:bg-blue-700"
            } transition duration-200`}
          >
            {btnMessage}
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
