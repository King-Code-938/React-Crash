import { useState } from 'react';
import './TaskList.css';

function TaskList({ tasks, deleteTask, updateTask, toggleTask, clear, }) {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  if (tasks.length === 0) {
    return <p className='empty-msg'>No tasks yet. Add something!</p>;
  }

  const handleEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const handleSave = () => {
    updateTask(editId, editText);
    setEditId(null);
    setEditText('');
  };

  return (
    <ul>
      <div className='h1'>
        Total Tasks{' '}
        <span className='italic brac'>
          {tasks.length} {tasks.length >= 15 ? 'Limit Reached' : ''}
        </span>
        <button className='clear' onClick={() => clear()}>
          Clear All
        </button>
      </div>
      {tasks.map(task => (
        <li key={task._id} className={task.done ? 'done' : ''}>
          <input type='checkbox' checked={task.done} onChange={() => toggleTask(task._id)} />
          {editId === task._id ? (
            <>
              <input
                type='text'
                id='edit'
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setEditId(null);
                }}
                autoFocus
              />
              <button onClick={handleSave}>💾</button>
              <button onClick={() => setEditId(null)}>❌</button>
            </>
          ) : (
            <>
              <span>{task.text}</span>
              <button onClick={() => handleEdit(task._id, task.text)}>✏️</button>
              <button onClick={() => deleteTask(task._id)}>❌</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
export default TaskList;
