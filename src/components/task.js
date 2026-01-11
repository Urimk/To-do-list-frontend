import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSquareCheck } from "@fortawesome/free-regular-svg-icons";

const Task = (props) => {
  return (
    <li
      className={`flex justify-between items-center ${
        props.task.isCompleted ? "bg-gray-200" : "bg-gray-50"
      } p-3 rounded-md border-r-4 border-blue-500 shadow-sm`}
    >
      <span
        className={`text-gray-700 font-medium min-w-0 flex-1 break-words mr-4 ${
          props.task.isCompleted ? "line-through text-gray-400" : ""
        }`}
      >
        {props.task.task}
      </span>
      <div className="flex gap-2">
        <button onClick={() => props.handleToggleComplete(props.task)}>
          <FontAwesomeIcon icon={faSquareCheck} className="text-blue-500" />
        </button>
        <button onClick={() => props.handleDelete(props.task)}>
          <FontAwesomeIcon icon={faTrashCan} className="text-red-400" />
        </button>
      </div>
    </li>
  );
};

export default Task;
