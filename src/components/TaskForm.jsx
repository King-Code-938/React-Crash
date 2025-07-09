import { useEffect, useState } from 'react';

function TaskForm({ newTask, setNewTask, addTask, limit }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        addTask();
      }}>
      <input type='text' placeholder='Enter new task' value={newTask} onChange={e => setNewTask(e.target.value)} disabled={limit} />
      <button type='submit' disabled={!newTask.trim()}>
        Add
      </button>
    </form>
  );
}

export default TaskForm;
// This component handles the task input form.
// It takes `newTask`, `setNewTask`, `addTask`, and `maxReached` as props.
