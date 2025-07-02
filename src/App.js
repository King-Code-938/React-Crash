import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import AuthForm from './components/AuthForm';
import './App.css';
import './styles.css';
import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [alert, setAlert] = useState('');
  const [alert_d, setAlert_d] = useState('alert warning d-none');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isServerActive, setIsServerActive] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const API_URL = 'http://localhost:5000/api/tasks';
  const SERVER_URL = 'http://localhost:5000';
  useEffect(() => {
    fetch(SERVER_URL)
      .then(data => (data === 'Server running' ? setIsServerActive(true) : setIsServerActive(false)))
      .catch(err => console.warn('Server: ', isServerActive, 'Server active check failed: ', err));
  });

  useEffect(() => {
    if (!token) return;
    fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
        else console.error('Expected array but got:', data);
      })
      .catch(err => console.error('Failed to fetch tasks:', err));
  }, [setTasks, token]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: trimmed }),
    })
      .then(res => res.json())
      .then(newTask => setTasks([...tasks, newTask]))
      .catch(err => console.error('Failed to add task:', err));
    setNewTask('');
    setAlert('Task Ceated!');
    setAlert_d('alert success');
    resetAlert();
    if (tasks.length >= 14) {
      setAlert_d('alert warning');
      setAlert('Limit Reached. <Delete some to add another>');
      resetAlert();
    }
  };

  const deleteTask = taskId => {
    const confirm = window.confirm('Are you sure you want to delete this task?');
    if (confirm) {
      fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => setTasks(tasks.filter(t => t._id !== taskId)))
        .catch(err => console.error('Failed to delete:', err));
      setAlert('Task Deleted!');
      setAlert_d('alert warning');
      resetAlert();
    }
  };

  const updateTask = (taskId, input) => {
    fetch(`${API_URL}/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: input }),
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(t => (t._id === updated._id ? updated : t)));
      });
  };

  const clearAll = () => {
    const confirm = window.confirm('Are you sure you want to clear all tasks?');
    if (confirm) {
      fetch(`${API_URL}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => setTasks([]))
        .catch(err => console.error('Failed to clear tasks:', err));
      setAlert('Task Cleared!');
      setAlert_d('alert warning');
      resetAlert();
    }
  };

  const toggleTask = taskId => {
    const task = tasks.find(t => t._id === taskId);
    fetch(`${API_URL}/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ done: !task.done }),
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(t => (t._id === updated._id ? updated : t)));
      });
  };

  if (!token) {
    return <AuthForm setToken={setToken} />;
  }

  return (
    <div>
      <Header title='Task Tracker' /> <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</button>
      <button onClick={logout}>Logout</button>
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
          disabled={tasks.length >= 15}
        />
        <button type='submit' disabled={!newTask.trim()}>
          Add
        </button>
      </form>
      <p className={alert_d}>{alert}</p>
      <TaskList tasks={tasks} deleteTask={deleteTask} updateTask={updateTask} toggleTask={toggleTask} clear={clearAll} />
      <Footer />
    </div>
  );
}

export default App;
