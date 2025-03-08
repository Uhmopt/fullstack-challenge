import { useTaskStore } from "../store/task";

export default function TaskFilter() {
  const { statusFilter, setStatusFilter, searchQuery, setSearchQuery } = useTaskStore();

  return (
    <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center">
      <input
        type="text"
        placeholder="Search by title or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border rounded-lg w-full md:w-64"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="p-2 border rounded-lg w-full md:w-auto"
      >
        <option value="ALL">All Tasks</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>
  );
}
