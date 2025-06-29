import './TaskList.css';

function TaskList({ tasks, deleteTask, toggleTask, clear }) {
  if (tasks.length === 0) {
    return <p className='empty-msg'>No tasks yet. Add something!</p>;
  }
  return (
    <ul>
      <button className='clear' onClick={() => clear()}>
        Clear All
      </button>
      {tasks.map((task, i) => (
        <li key={i} className={task.done ? 'done' : ''}>
          <input type='checkbox' checked={task.done} onChange={() => toggleTask(i)} />
          <span>{task.text}</span>
          <button onClick={() => deleteTask(i)}>❌</button>
        </li>
      ))}
    </ul>
  );
}
export default TaskList;
