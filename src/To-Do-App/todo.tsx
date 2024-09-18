import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

// TypeScript interfaces
interface Task {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  completed: boolean;
  completedAt?: string;
}

interface Category {
  name: string;
  color: string;
}

// Available categories and their colors
const categories: Category[] = [
  { name: 'Work', color: 'bg-blue-200' },
  { name: 'Personal', color: 'bg-green-200' },
  { name: 'School', color: 'bg-yellow-200' },
  { name: 'Others', color: 'bg-gray-200' },
];

const TODO: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>(categories[0].name);
  const [editId, setEditId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    // Load tasks from local storage on component mount
    const storedTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever tasks array changes
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const getCurrentTime = (): string => new Date().toLocaleString();

  const addTask = (): void => {
    if (title.trim() === '') return;

    const newTask: Task = {
      id: Date.now(),
      title,
      category,
      createdAt: getCurrentTime(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle('');
    setCategory(categories[0].name);
  };

  const editTask = (id: number): void => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setCategory(taskToEdit.category);
      setEditId(id);
    }
  };

  const saveTask = (): void => {
    const updatedTasks = tasks.map(task =>
      task.id === editId ? { ...task, title, category } : task
    );
    setTasks(updatedTasks);
    setTitle('');
    setEditId(null);
  };

  const toggleComplete = (id: number): void => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? getCurrentTime() : undefined }
        : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(task => task.category === filter);

  return (
    <div className="container bg-white rounded-xl shadow-2xl shado shadow-gray-700 sm:max-w-xl max-w-sm mx-auto  p-4">
      <h1 className="text-3xl font-bold text-center mb-4">To-Do App</h1>

      {/* Task Input Form */}
      <div className="mb-4 flex flex-col space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          className="border p-2 rounded-md w-full"
        />
        <div className="flex space-x-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              className={`py-2 px-4 rounded-md ${cat.color} ${category === cat.name ? 'ring-2 ring-black' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button
          onClick={editId ? saveTask : addTask}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          {editId ? 'Save Task' : 'Add Task'}
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Filter by Category:</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="All">All</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Task List */}
      <div className="flex flex-col space-y-4">
        {filteredTasks.map(task => {
          const categoryColor = categories.find(cat => cat.name === task.category)?.color || 'bg-gray-200';
          return (
            <div
              key={task.id}
              className={`flex justify-between items-center p-4 rounded-md shadow-md border ${categoryColor} ${task.completed ? 'opacity-50' : ''}`}
            >
              <div>
                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500">Category: {task.category}</p>
                <p className="text-sm text-gray-500">Created at: {task.createdAt}</p>
                {task.completed && <p className="text-sm text-green-500">Completed at: {task.completedAt}</p>}
              </div>
              <div className="flex space-x-2">
                <FaCheck
                  className={`cursor-pointer ${task.completed ? 'text-yellow-500' : 'text-green-500'}`}
                  onClick={() => toggleComplete(task.id)}
                />
                <FaEdit className="text-blue-500 cursor-pointer" onClick={() => editTask(task.id)} />
                <FaTrash className="text-red-500 cursor-pointer" onClick={() => deleteTask(task.id)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TODO;
