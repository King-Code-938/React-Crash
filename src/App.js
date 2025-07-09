import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import AuthForm from './components/AuthForm';
import PrivateRoute from './components/PrivateRoute';
import { fetchTasks, createTask, deleteTask, updateTask, deleteAllTask } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles.css';
import { useState, useEffect } from 'react';
import usePolling from './hooks/usePolling';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isServerActive, setIsServerActive] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(false);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const API_URL = process.env.TASK_API_URL || 'https://react-crash-backend.onrender.com/api/tasks';
  const SERVER_URL = process.env.VITE_API_URL || 'https://react-crash-backend.onrender.com';
  const AUTH_API_URL = process.env.AUTH_API_URL || 'https://react-crash-backend.onrender.com/api/auth';

  const getUsernameFromToken = token => {
    try {
      const decoded = jwtDecode(token);
      return decoded?.username || decoded?.name || decoded?.user || 'User';
    } catch (err) {
      return 'User';
    }
  };

  const username = getUsernameFromToken(token);

  usePolling(() => {
    fetch(SERVER_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setIsServerActive(res.ok);
        if (res.status === 401) {
          toast.error(
            <>
              <b>Session Expired:</b> Logged Out
            </>
          );
          setTimeout(() => {
            logout();
          }, 3000);
        }
      })
      .catch(err => {
        setIsServerActive(false);
        toast.error(
          <span>
            <b>Internal Server Error: </b> Reload page
          </span>
        );
        console.warn('Server: ', isServerActive, 'Server active check failed: ', err);
      });
  }); // Poll every 5 seconds

  useEffect(() => {
    if (!isServerActive) {
      toast.error(
        <span>
          <b>Internal Server Error:</b> Please reload
        </span>
      );
    }
  });

  useEffect(() => {
    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;
      const now = Date.now();
      if (now >= exp) {
        toast.info('Session expired');
        logout();
      }
    } catch {}
  }, []);

  usePolling(() => {
    fetchTasks(API_URL, token)
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Expected an array but got:', data);
          toast.error('Failed to load tasks: invalid format');
          return;
        }

        const current = JSON.stringify(tasks);
        const incoming = JSON.stringify(data);
        setIsLoading(false);
        if (incoming !== current) {
          setTasks(data);
        }
      })
      .catch(err => {
        console.error('Polling error:', err);
        console.warn(JSON.stringify(err));
        if (err.message) {
          toast.error(<span>Network Disconnected</span>);
        }
      });
    if (tasks.length >= 14) {
      if (limit) return;
      toast.info('Limit Reached!');
      setLimit(true);
    }
  }); // fetch every 5 seconds

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const dupExists = newTask => {
    return tasks.some(task => task.text.toLowerCase() === newTask.toLowerCase());
  };

  const addTask = () => {
    const trimmed = newTask.trim();
    if (trimmed === '') return;
    if (dupExists(trimmed)) {
      toast.info('Task already exists');
      return;
    }
    createTask(API_URL, token, trimmed)
      .then(newTask => {
        setTasks([...tasks, newTask]);
        toast.success(<span>📝 New task added!</span>);
      })
      .catch(err => {
        console.error('Failed to add task:', err);
        toast.error('Something went wrong. Failed to add task');
      });
    setNewTask('');
    if (tasks.length >= 14) {
      toast.info('Limit Reached!');
      setLimit(true);
    }
  };

  const deleteTasks = taskId => {
    const confirm = window.confirm('Are you sure you want to delete this task?');
    if (confirm) {
      deleteTask(API_URL, token, taskId)
        .then(() => {
          setTasks(tasks.filter(t => t._id !== taskId));
          toast.warn('Task Deleted');
        })
        .catch(err => {
          console.error('Failed to delete:', err);
          toast.error('Something went wrong. Failed to delete task');
        });
    }
  };

  const updateTasks = (taskId, input) => {
    updateTask(API_URL, token, taskId, { text: input })
      .then(updated => {
        setTasks(tasks.map(t => (t._id === updated._id ? updated : t)));
        toast.success('Task updated successfully!');
      })
      .catch(err => {
        console.error('Failed to update: ', err);
        toast.error('Something went wrong. Failed to update task');
      });
  };

  const clearAll = () => {
    const confirm = window.confirm('Are you sure you want to clear all tasks?');
    if (confirm) {
      deleteAllTask(API_URL, token)
        .then(() => {
          setTasks([]);
          toast.warn('All tasks deleted');
        })
        .catch(err => {
          console.error('Failed to clear tasks:', err);
          toast.error('Failed to clear tasks');
        });
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
      })
      .catch(err => {
        console.error('Failed to toggle done:', err);
        toast.error('Something went wrong. Failed to mark done');
      });
  };

  return (
    <Router>
      <Header title='Task Tracker' /> {token ? <Navbar username={username} /> || null : null}
      <Routes>
        {/* Public Route */}
        <Route path='/login' element={<AuthForm setToken={setToken} AUTH_API_URL={AUTH_API_URL} />} />

        {/* Protected Routes */}
        <Route
          path='/'
          element={
            <PrivateRoute token={token}>
              <TaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} limit={limit} />
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <TaskList tasks={tasks} deleteTask={deleteTasks} updateTask={updateTasks} toggleTask={toggleTask} clear={clearAll} />
              )}
            </PrivateRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <PrivateRoute token={token}>
              <Settings username={username} darkMode={darkMode} setDarkMode={setDarkMode} logout={logout} />
            </PrivateRoute>
          }
        />
        <Route path='*' element={<Navigate to={token ? '/' : '/login'} />} />
      </Routes>
      <Footer />
      <ToastContainer position='top-right' autoClose={3000} />
    </Router>
  );
}

export default App;
