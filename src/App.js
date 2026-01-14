import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TaskManager, Login, Register } from "./pages";
import { PrivateRoute, PublicRoute } from "./components";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen grid grid-rows-[auto_1fr] bg-gray-50 text-gray-900">
        <Toaster />
        <div className="row-span-1">
          <Navbar />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TaskManager />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
