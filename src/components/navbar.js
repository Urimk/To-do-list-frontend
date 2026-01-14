import ServerStatus from "./serverStatus";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const isAuthPage = path === "/login" || path === "/register";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600 tracking-wide">
              Task<span className="text-gray-800">Manager</span>
            </span>
          </div>
          <ServerStatus />

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className={`text-sm font-medium text-gray-500 hover:text-red-600 transition-colors duration-200 flex items-center gap-2 ml-14 ${
              isAuthPage ? "invisible" : ""
            }`}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
