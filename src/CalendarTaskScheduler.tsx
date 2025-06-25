import { FaTrash, FaEdit, FaTimes, FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";
import { SiGoogletasks } from "react-icons/si";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "./App.css";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type TasksByDate = {
  [date: string]: Task[];
};

const CalendarTaskScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasksByDate, setTasksByDate] = useState<TasksByDate>({});
  const [newTask, setNewTask] = useState<string>("");
  const [editingTask, setEditingTask] = useState<{
    date: string;
    id: number;
    text: string;
  } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const handleDateChange = (date: Date) => setSelectedDate(date);

  const addTask = () => {
    if (newTask.trim() !== "") {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const tasksForDate = tasksByDate[formattedDate] || [];
      const newTaskObj: Task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
      };

      const updatedTasksByDate = {
        ...tasksByDate,
        [formattedDate]: [...tasksForDate, newTaskObj],
      };

      setTasksByDate(updatedTasksByDate);
      localStorage.setItem("tasksByDate", JSON.stringify(updatedTasksByDate));
      setNewTask("");
    }
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasksByDate");
    if (savedTasks) {
      setTasksByDate(JSON.parse(savedTasks));
    }

    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const deleteTask = (date: string, id: number) => {
    const tasksForDate = tasksByDate[date] || [];
    const updatedTasksForDate = tasksForDate.filter((task) => task.id !== id);

    setTasksByDate((prev) => {
      const updated = { ...prev };
      if (updatedTasksForDate.length === 0) {
        delete updated[date];
      } else {
        updated[date] = updatedTasksForDate;
      }
      localStorage.setItem("tasksByDate", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleTaskCompletion = (date: string, id: number) => {
    const updatedTasksForDate = tasksByDate[date].map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    const updatedTasks = {
      ...tasksByDate,
      [date]: updatedTasksForDate,
    };
    setTasksByDate(updatedTasks);
    localStorage.setItem("tasksByDate", JSON.stringify(updatedTasks));
  };

  const startEditingTask = (date: string, id: number, text: string) => {
    setEditingTask({ date, id, text });
  };

  const saveEditedTask = () => {
    if (editingTask) {
      const { date, id, text } = editingTask;
      const updatedTasksForDate = tasksByDate[date].map((task) =>
        task.id === id ? { ...task, text } : task
      );

      const updatedTasks = {
        ...tasksByDate,
        [date]: updatedTasksForDate,
      };

      setTasksByDate(updatedTasks);
      localStorage.setItem("tasksByDate", JSON.stringify(updatedTasks));
      setEditingTask(null);
    }
  };

  const cancelEditingTask = () => {
    setEditingTask(null);
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const tileContent = ({ date }: { date: Date }) => {
    const formattedDay = format(date, "yyyy-MM-dd");
    const hasTasks = tasksByDate[formattedDay]?.length > 0;

    return hasTasks ? (
      <div className="relative w-full h-full">
        <span className="absolute -top-1 right-1.5 translate-x-1/2 text-blue-500 text-xs ">
          <SiGoogletasks title="Tasks scheduled" />
        </span>
      </div>
    ) : null;
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-6 px-4 font-sans transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-indigo-50 to-purple-50"
      }`}
    >
      <header className="flex justify-between items-center w-full max-w-6xl mb-6 px-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Task Scheduler
        </h1>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition ${
            darkMode
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          title={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* Left Column - Calendar and Task Input (shown first on mobile) */}
        <div className="lg:flex-1 w-full flex flex-col gap-6 order-1 lg:order-none ">
          <div
            className={`rounded-xl shadow-lg overflow-hidden  ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Calendar
              value={selectedDate}
              onChange={(date) => handleDateChange(date as Date)}
              tileContent={tileContent}
              className={`w-full border-0 mx-auto my-5 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
              navigationLabel={({ date }) => (
                <span className="font-semibold">
                  {format(date, "MMMM yyyy")}
                </span>
              )}
            />
          </div>

          <div
            className={`rounded-xl shadow-lg p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Add Task for {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter task description..."
              />
              <button
                onClick={addTask}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Task List (shown second on mobile) */}
        <div
          className={`lg:flex-1 rounded-xl shadow-lg p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } order-2 lg:order-none`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {Object.values(tasksByDate).flat().length} total
            </span>
          </div>

          {Object.keys(tasksByDate).length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center py-12 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <SiGoogletasks className="text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No tasks yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {Object.entries(tasksByDate)
                .sort(
                  ([dateA], [dateB]) =>
                    new Date(dateA).getTime() - new Date(dateB).getTime()
                )
                .map(([date, tasks]) => (
                  <div
                    key={date}
                    className={`rounded-lg p-4 ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <h3 className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">
                      {format(new Date(date), "EEEE, MMMM d, yyyy")}
                    </h3>
                    <ul className="space-y-2">
                      {tasks.map((task) => (
                        <li
                          key={task.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-lg transition ${
                            darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                          } ${
                            task.completed
                              ? darkMode
                                ? "bg-gray-600"
                                : "bg-gray-100"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() =>
                                toggleTaskCompletion(date, task.id)
                              }
                              className={`h-5 w-5 rounded cursor-pointer focus:ring-2 ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-purple-500 focus:ring-purple-600"
                                  : "border-gray-300 text-blue-600 focus:ring-blue-500"
                              }`}
                            />
                            {editingTask?.id === task.id &&
                            editingTask.date === date ? (
                              <input
                                type="text"
                                value={editingTask.text}
                                onChange={(e) =>
                                  setEditingTask({
                                    ...editingTask,
                                    text: e.target.value,
                                  })
                                }
                                className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                                  darkMode
                                    ? "bg-gray-800 border-gray-600 text-white focus:ring-purple-500"
                                    : "border-gray-300 focus:ring-blue-500"
                                }`}
                                autoFocus
                              />
                            ) : (
                              <span
                                className={`flex-1 truncate ${
                                  task.completed
                                    ? "line-through text-gray-500 dark:text-gray-400"
                                    : "text-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {task.text}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {editingTask?.id === task.id &&
                            editingTask.date === date ? (
                              <>
                                <button
                                  onClick={saveEditedTask}
                                  className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                  title="Save"
                                >
                                  <FaSave className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditingTask}
                                  className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                  title="Cancel"
                                >
                                  <FaTimes className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() =>
                                  startEditingTask(date, task.id, task.text)
                                }
                                className={`p-2 rounded-lg ${
                                  task.completed
                                    ? "bg-gray-400 text-gray-800 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
                                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                                } focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                                title="Edit"
                                disabled={task.completed}
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteTask(date, task.id)}
                              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                              title="Delete"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarTaskScheduler;
