import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import './App.css';
import './styles.css';
import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState(['Learn']);
  const [newTask, setNewTask] = useState('');
  const [alert, setAlert] = useState('');
  const [alert_d, setAlert_d] = useState('alert warning d-none');

  const dupExists = newTask => {
    return tasks.some(task => task.toLowerCase() === newTask.toLowerCase());
  };

  const addTask = () => {
    const trimmed = newTask.trim();
    if (trimmed === '') return;
    if (dupExists(trimmed)) {
      setAlert_d('alert warning');
      setAlert('Already Exists. <Type another task>');
      return;
    }

    setTasks([...tasks, trimmed]);
    setNewTask('');
    console.log(tasks, tasks.length);
    if (tasks.length >= 9) {
      setAlert_d('alert warning');
      setAlert('Limit Reached. <Delete some to add another>');
    } else {
      setAlert_d('d-none');
    }
  };

  return (
    <div>
      <Header title='Task Tracker' />
      <TaskList tasks={tasks} />
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
