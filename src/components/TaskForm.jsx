function TaskForm({ newTask, setNewTask, addTask, maxReached }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        addTask();
      }}>
      <input type='text' placeholder='Enter new task' value={newTask} onChange={e => setNewTask(e.target.value)} disabled={maxReached} />
      <button type='submit' disabled={!newTask.trim()}>
        Add
      </button>
    </form>
  );
}

export default TaskForm;
// This component handles the task input form.
// It takes `newTask`, `setNewTask`, `addTask`, and `maxReached` as props.
