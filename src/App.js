import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import './App.css';
import './styles.css';
import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [alert, setAlert] = useState('');
  const [alert_d, setAlert_d] = useState('alert warning d-none');

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const resetAlert = () => {
    setTimeout(() => {
      setAlert('');
      setAlert_d('d-none');
    }, 3000);
  };

  const dupExists = newTask => {
    return tasks.some(task => task.text.toLowerCase() === newTask.toLowerCase());
  };

  const addTask = () => {
    const trimmed = newTask.trim();
    if (trimmed === '') return;
    if (dupExists(trimmed)) {
      setAlert_d('alert warning');
      setAlert('Already Exists. <Type another task>');
      resetAlert();
      return;
    }

    setTasks([...tasks, { text: trimmed, done: false }]);
    setNewTask('');
    if (tasks.length >= 9) {
      setAlert_d('alert warning');
      setAlert('Limit Reached. <Delete some to add another>');
      resetAlert();
    }
  };

  const deleteTask = index => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    setAlert('Task Deleted!');
    setAlert_d('alert warning');
    resetAlert();
  };

  const clearAll = () => {
    setTasks([]);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const toggleTask = index => {
    const updated = tasks.map((task, i) => (i === index ? { ...task, done: !task.done } : task));
    setTasks(updated);
  };

  return (
    <div>
      <Header title='Task Tracker' />
      <TaskList tasks={tasks} deleteTask={deleteTask} toggleTask={toggleTask} clear={clearAll} />
      <form
        onSubmit={e => {
          e.preventDefault();
          addTask();
        }}>
        <input
          type='text'
          placeholder='Enter new task'
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          disabled={tasks.length >= 10}
        />
        <button type='submit' disabled={!newTask.trim()}>
          Add
        </button>
      </form>
      <p className={alert_d}>{alert}</p>
      <Footer />
    </div>
  );
}

export default App;
