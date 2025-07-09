import { useEffect } from 'react';

function TaskForm({ newTask, setNewTask, addTask, tasks }) {
  const [disabled, setDisabled] = useState(tasks >= 15);

  useEffect(() => {
    if (tasks >= 15) {
      setNewTask('');
      disabled = true;
    }
  }, [tasks, setNewTask]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        addTask();
      }}>
      <input type='text' placeholder='Enter new task' value={newTask} onChange={e => setNewTask(e.target.value)} disabled={disabled} />
      <button type='submit' disabled={!newTask.trim()}>
        Add
      </button>
    </form>
  );
}

export default TaskForm;
// This component handles the task input form.
// It takes `newTask`, `setNewTask`, `addTask`, and `maxReached` as props.
