import { useTaskStore } from "../store/task";

export default function TaskFilter() {
  const { statusFilter, setStatusFilter } = useTaskStore();

  return (
    <div className="mb-4 flex justify-center">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="p-2 border rounded-lg"
      >
        <option value="ALL">All Tasks</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>
  );
}
