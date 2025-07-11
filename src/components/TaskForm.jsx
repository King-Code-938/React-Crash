function TaskForm({ newTask, setNewTask, addTask, limit }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        addTask();
      }}>
      <input type='text' placeholder='What needs to be done?' value={newTask} onChange={e => setNewTask(e.target.value)} disabled={limit} />
      <button type='submit' disabled={!newTask.trim()}>
        Add
      </button>
    </form>
  );
}

export default TaskForm;
