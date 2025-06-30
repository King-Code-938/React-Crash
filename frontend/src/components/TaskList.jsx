import { useState } from 'react';
import './TaskList.css';

function TaskList({ tasks, deleteTask, updateTask, toggleTask, clear }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  if (tasks.length === 0) {
    return <p className='empty-msg'>No tasks yet. Add something!</p>;
  }

  const handleEdit = (i, text) => {
    setEditIndex(i);
    setEditText(text);
  };

  const handleSave = () => {
    updateTask(editIndex, editText);
    setEditIndex(null);
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
      {tasks.map((task, i) => (
        <li key={i} className={task.done ? 'done' : ''}>
          <input type='checkbox' checked={task.done} onChange={() => toggleTask(i)} />
          {editIndex === i ? (
            <>
              <input
                type='text'
                id='edit'
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setEditIndex(null);
                }}
                autoFocus
              />
              <button onClick={handleSave}>💾</button>
              <button onClick={() => setEditIndex(null)}>❌</button>
            </>
          ) : (
            <>
              <span>{task.text}</span>
              <button onClick={() => handleEdit(i, task.text)}>✏️</button>
              <button onClick={() => deleteTask(i)}>❌</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
export default TaskList;
