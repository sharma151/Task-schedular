import React from "react";
import { format } from "date-fns";

type Task = {
  id: number;
  text: string;
};

type TasksByDate = {
  [date: string]: Task[];
};

type TaskListProps = {
  tasksByDate: TasksByDate;
  selectedDate: Date;
  deleteTask: (date: string, id: number) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasksByDate, selectedDate, deleteTask }) => {
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const tasksForDate = tasksByDate[formattedDate] || [];

  return (
    <div>
      {tasksForDate.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {tasksForDate.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center py-2 px-4 hover:bg-gray-100 rounded"
            >
              <span>{task.text}</span>
              <button
                onClick={() => deleteTask(formattedDate, task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No tasks for this date.</p>
      )}
    </div>
  );
};

export default TaskList;
