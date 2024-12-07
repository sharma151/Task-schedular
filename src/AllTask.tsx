import React from "react";
import { format } from "date-fns";

type Task = {
  id: number;
  text: string;
};

type TasksByDate = {
  [date: string]: Task[];
};

type AllTasksProps = {
  tasksByDate: TasksByDate;
  deleteTask: (date: string, id: number) => void;
};

const AllTasks: React.FC<AllTasksProps> = ({ tasksByDate, deleteTask }) => {
  const taskDates = Object.keys(tasksByDate);

  if (taskDates.length === 0) {
    return <p className="text-gray-500">No tasks added yet.</p>;
  }

  return (
    <div className="mt-10 w-full bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">All Tasks</h2>
      {taskDates.map((date) => (
        <div key={date} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {format(new Date(date), "MMMM dd, yyyy")}
          </h3>
          <ul className="list-disc ml-5">
            {tasksByDate[date].map((task) => (
              <li key={task.id} className="flex justify-between items-center">
                <span>{task.text}</span>
                <button
                  onClick={() => deleteTask(date, task.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AllTasks;
