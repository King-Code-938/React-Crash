import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import AuthForm from './components/AuthForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles.css';
import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isServerActive, setIsServerActive] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const API_URL = process.env.TASK_API_URL || 'https://react-crash-backend.onrender.com/api/tasks';
  const SERVER_URL = process.env.VITE_API_URL || 'https://react-crash-backend.onrender.com';
  const AUTH_API_URL = process.env.AUTH_API_URL || 'https://react-crash-backend.onrender.com/api/auth';

  useEffect(() => {
    const interval = setInterval(() => {
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
    }, 5000);
    return () => clearInterval(interval);
  });
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
    const interval = setInterval(() => {
      fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log('Fetched data:', data); // Add this
          if (!Array.isArray(data)) {
            console.error('Expected an array but got:', data);
            toast.error('Failed to load tasks: invalid format');
            return;
          }

          const current = JSON.stringify(tasks);
          const incoming = JSON.stringify(data);

          if (incoming !== current) {
            setTasks(data);
          }
        })
        .catch(err => {
          console.error('Polling error:', err);
          console.warn(JSON.stringify(err));
          if (err) {
            toast.error(<span>Network Disconnected</span>);
          }
        });
    }, 5000); // fetch every 5 seconds

    return () => clearInterval(interval);
  }, [token, API_URL]);

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
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: trimmed }),
    })
      .then(res => res.json())
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
      fetch(`${API_URL}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
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

  if (!token) {
    return <AuthForm setToken={setToken} AUTH_API_URL={AUTH_API_URL} />;
  }

  return (
    <div>
      <Header title='Task Tracker' />{' '}
      <button className='md' onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <button className='md' onClick={logout}>
        Logout
      </button>
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
      <TaskList tasks={tasks} deleteTask={deleteTask} updateTask={updateTask} toggleTask={toggleTask} clear={clearAll} />
      <Footer />
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  );
}

export default App;
