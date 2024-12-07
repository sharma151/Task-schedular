import React, { useState } from "react";
import "./App.css";
import { format } from "date-fns";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import TaskList from "./TaskList";

type Task = {
  id: number;
  text: string;
};

type TasksByDate = {
  [date: string]: Task[];
};

const CalendarTaskScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasksByDate, setTasksByDate] = useState<TasksByDate>({});
  const [newTask, setNewTask] = useState<string>("");

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const tasksForDate = tasksByDate[formattedDate] || [];
      const newTaskObj: Task = {
        id: Date.now(),
        text: newTask.trim(),
      };

      setTasksByDate({
        ...tasksByDate,
        [formattedDate]: [...tasksForDate, newTaskObj],
      });

      setNewTask("");
    }
  };

  const deleteTask = (date: string, id: number) => {
    const tasksForDate = tasksByDate[date] || [];
    const updatedTasksForDate = tasksForDate.filter((task) => task.id !== id);

    setTasksByDate((prev) => {
      const updatedTasksByDate = { ...prev };

      if (updatedTasksForDate.length === 0) {
        // Remove the date key if no tasks remain
        delete updatedTasksByDate[date];
      } else {
        // Otherwise, update the tasks for the date
        updatedTasksByDate[date] = updatedTasksForDate;
      }

      return updatedTasksByDate;
    });
  };

  const customDayContent = (day: Date) => {
    const formattedDay = format(day, "yyyy-MM-dd");
    const hasTasks = tasksByDate[formattedDay]?.length > 0;

    return (
      <div className="relative">
        <span>{day.getDate()}</span>
        {hasTasks && (
          <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">*</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <h1 className="text-2xl font-bold mb-6">Calendar Task Scheduler</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="md:mr-10">
          <Calendar
            date={selectedDate}
            onChange={handleDateChange}
            className="shadow-lg rounded-lg"
            dayContentRenderer={customDayContent}
          />
        </div>

        <div className="w-96 bg-white shadow-lg rounded-lg p-6 mt-6 md:mt-0">
          <h2 className="text-xl font-bold mb-4">
            Tasks for {format(selectedDate, "MMMM dd, yyyy")}
          </h2>

          <div className="flex mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Add a new task"
            />
            <button
              onClick={addTask}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          <TaskList
            tasksByDate={tasksByDate}
            selectedDate={selectedDate}
            deleteTask={deleteTask}
          />
        </div>
      </div>

      <div className="w-full mt-10">
        <h2 className="text-xl font-bold mb-4">All Tasks</h2>
        {Object.keys(tasksByDate).length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <ul>
            {Object.entries(tasksByDate).map(([date, tasks]) => (
              <li key={date} className="mb-4">
                <h3 className="font-semibold">{format(new Date(date), "MMMM dd, yyyy")}</h3>
                <ul>
                  {tasks.map((task) => (
                    <li key={task.id} className="ml-4 list-disc">
                      {task.text}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarTaskScheduler;
