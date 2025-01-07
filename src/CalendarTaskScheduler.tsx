import  { useState} from "react";
import "./App.css";
import { format } from "date-fns";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { SiGoogletasks } from "react-icons/si";
import { FaTrash, FaEdit, FaTimes, FaSave } from "react-icons/fa";

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
  const [editingTask, setEditingTask] = useState<{ date: string; id: number; text: string } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Load tasks from localStorage on component mount
  // useEffect(() => {
  //   // Load tasks from localStorage on component mount
  //   const storedTasks = localStorage.getItem("tasksByDate");
  //   if (storedTasks) {
  //     try {
  //       setTasksByDate(JSON.parse(storedTasks));
  //     } catch (error) {
  //       console.error("Failed to parse tasks from localStorage:", error);
  //     }
  //   }
  // }, []);
  localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
  
  // useEffect(() => {
  //   // Save tasks to localStorage whenever tasksByDate updates
  //   try {
  //     localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
  //   } catch (error) {
  //     console.error("Failed to save tasks to00 localStorage:", error);
  //   }
  // }, [tasksByDate]);

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
        delete updatedTasksByDate[date];
      } else {
        updatedTasksByDate[date] = updatedTasksForDate;
      }
      return updatedTasksByDate;
    });
  };

  const toggleTaskCompletion = (date: string, id: number) => {
    const tasksForDate = tasksByDate[date] || [];
    const updatedTasksForDate = tasksForDate.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    setTasksByDate((prev) => ({
      ...prev,
      [date]: updatedTasksForDate,
    }));
  };

  const startEditingTask = (date: string, id: number, text: string) => {
    setEditingTask({ date, id, text });
  };

  const saveEditedTask = () => {
    if (editingTask) {
      const { date, id, text } = editingTask;
      const tasksForDate = tasksByDate[date] || [];
      const updatedTasksForDate = tasksForDate.map((task) =>
        task.id === id ? { ...task, text } : task
      );

      setTasksByDate((prev) => ({
        ...prev,
        [date]: updatedTasksForDate,
      }));
      setEditingTask(null);
    }
  };

  const cancelEditingTask = () => {
    setEditingTask(null);
  };

  const customDayContent = (day: Date) => {
    const formattedDay = format(day, "yyyy-MM-dd");
    const hasTasks = tasksByDate[formattedDay]?.length > 0;

    return (
      <div>
        <span>{day.getDate()}</span>
        {hasTasks && (
          <span className="text-blue-500" title="Tasks scheduled">
            <SiGoogletasks />
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-10 px-4 font-sans ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-teal-50 to-blue-100"
      }`}
    >
      <header className="flex justify-between items-center w-full max-w-4xl mb-8">
        <h1 className="text-4xl font-bold tracking-wide">Task Scheduler</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition ${
            darkMode
              ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
              : "bg-gray-800 text-gray-900 hover:bg-gray-700"
          }`}
          title={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl">
        {/* Calendar */}
        <div className="flex-1">
          <Calendar
            date={selectedDate}
            onChange={handleDateChange}
            className={`shadow-md rounded-lg border ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
            dayContentRenderer={customDayContent}
          />
          <div className="mt-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className={`w-[333px] rounded-l px-4 py-2 border rounded focus:outline-none focus:ring ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-yellow-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="Add a new task"
            />
            <button
              onClick={addTask}
              className="w-[333px] mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div
          className={`flex-1 shadow-md rounded-lg p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-medium mb-6 text-center">All Tasks</h2>
          {Object.keys(tasksByDate).length === 0 ? (
            <p className="text-center">No tasks available</p>
          ) : (
            <ul className="space-y-6">
              {Object.entries(tasksByDate).map(([date, tasks]) => (
                <li
                  key={date}
                  className={`p-4 rounded-xl shadow-md ${
                    darkMode ? "bg-gray-800 text-gray-100" : "bg-white"
                  }`}
                >
                  <h3 className="text-sm font-normal mb-3">
                    {format(new Date(date), "MMMM dd, yyyy")}
                  </h3>
                  <ul className="space-y-2">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(date, task.id)}
                            className="cursor-pointer"
                          />
                          {editingTask?.id === task.id && editingTask.date === date ? (
                            <input
                              type="text"
                              value={editingTask.text}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  text: e.target.value,
                                })
                              }
                              className="border rounded px-2 py-1 focus:outline-none w-32"
                            />
                          ) : (
                            <span
                              className={`${
                                task.completed
                                  ? " font-semibold line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {task.text}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {editingTask?.id === task.id && editingTask.date === date ? (
                            <>
                              <button
                                onClick={saveEditedTask}
                                className="px-2 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                              >
                                 <FaSave /> 
                              </button>
                              <button
                                onClick={cancelEditingTask}
                                className="px-2 py-1 text-sm rounded bg-gray-400 text-white hover:bg-gray-500"
                              >
                               <FaTimes /> 
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEditingTask(date, task.id, task.text)}
                              className="px-2 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                            >
                             <FaEdit /> 
                            </button>
                          )}
                          <button
                            onClick={() => deleteTask(date, task.id)}
                            className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                          >
                            <FaTrash/>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarTaskScheduler;
