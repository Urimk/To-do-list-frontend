import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const ServerStatus = () => {
  const [status, setStatus] = useState("checking");
  const API_URL =
    process.env.REACT_APP_RENDER_API_URL || "http://localhost:5000";

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/health`);
        if (res.ok) setStatus("online");
        else setStatus("offline");
      } catch (error) {
        setStatus("offline");
        toast.error(error.message);
      }
    };
    checkStatus();
    const intervalId = setInterval(() => {
      checkStatus();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="relative">
      {status === "checking" && (
        <div className="flex flex-row bg-yellow-50 items-center gap-1 sm:gap-2 border-2 rounded-lg border-yellow-400 p-1.5 sm:p-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
          <p className="text-sm sm:text-base font-medium text-yellow-400">
            Connecting
          </p>
        </div>
      )}

      {status === "online" && (
        <div className="flex flex-row bg-green-100 items-center gap-1 sm:gap-2 border-2 rounded-lg border-green-500 p-1.5 sm:p-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          <p className="text-sm sm:text-base font-medium text-green-500">
            Online
          </p>
        </div>
      )}

      {status === "offline" && (
        <div className="flex flex-row bg-red-100 items-center gap-1 sm:gap-2 border-2 rounded-lg border-red-400 p-1.5 sm:p-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
          <p className="text-sm sm:text-base font-medium text-red-400">
            Offline
          </p>
        </div>
      )}
    </div>
  );
};
export default ServerStatus;
