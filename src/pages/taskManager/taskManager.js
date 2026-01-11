import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import TaskList from "../../components/taskList";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [btnMessage, setBtnMessage] = useState("Loading...");

  const navigator = useNavigate();

  const API_URL =
    process.env.REACT_APP_RENDER_API_URL || "http://localhost:5000";

  let token;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setBtnMessage("Loading...");
        token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (response.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error(error.message);
      } finally {
        setBtnMessage("Add Task");
      }
    };
    fetchTasks();
  }, []);

  const handleClick = async () => {
    if (input.trim() === "") return;

    setBtnMessage("Adding...");

    try {
      token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
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
      setBtnMessage("Add Task");
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
    setBtnMessage("Deleting...");

    try {
      token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
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
      setBtnMessage("Add Task");
    }
  };

  const handleToggleComplete = async (task) => {
    setBtnMessage("Updating...");

    try {
      token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
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
      setBtnMessage("Add Task");
    }
  };

  const isBtnDisabled = btnMessage !== "Add Task";

  return (
    <main className="min-h-screen bg-blue-100 flex flex-col">
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600 tracking-wide">
                Task<span className="text-gray-800">Master</span>
              </span>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors duration-200 flex items-center gap-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className="flex-1  flex items-center justify-center py-10">
        <div className=" bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Your Tasks:
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
    </main>
  );
};

export default TaskManager;
