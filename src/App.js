import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState(['Learn React', 'Build App']);

  return (
    <div>
      <Header title='Task Tracker' />
      <TaskList tasks={tasks} />
      <Footer />
    </div>
  );
}

export default App;
