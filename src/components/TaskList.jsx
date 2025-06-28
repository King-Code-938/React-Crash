function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map((task, i) => (
        <li key={i}>{task}</li>
      ))}
    </ul>
  );
}
export default TaskList;
