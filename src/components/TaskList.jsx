import './TaskList.css';

function TaskList({ tasks, deleteTask }) {
  if (tasks.length === 0) {
    return <p className='empty-msg'>No tasks yet. Add something!</p>;
  }
  return (
    <ul>
      {tasks.map((task, i) => (
        <li key={i}>
          {task}
          <button onClick={() => deleteTask(i)}>❌</button>
        </li>
      ))}
    </ul>
  );
}
export default TaskList;
