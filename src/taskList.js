import Task from "./task.js";

let keyGen = 0;

const TaskList = (props) => {
  return (
    <ul className="space-y-3">
      {props.tasks.map((task) => (
        <Task
          task={task}
          handleDelete={props.handleDelete}
          handleToggleComplete={props.handleToggleComplete}
          key={keyGen++}
        />
      ))}
    </ul>
  );
};

export default TaskList;
