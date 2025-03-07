import { useTaskStore } from "../store/task";
import { useEffect, useState } from "react";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

export default function TaskList() {
  const { tasks, fetchTasks, deleteTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white shadow p-4 rounded-lg mb-2">
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <span className={`px-3 py-1 rounded-lg text-white ${task.status === "PENDING" ? "bg-yellow-500" : task.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-green-500"}`}>
            {task.status}
          </span>
          <div className="mt-2 flex">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => {
                setSelectedTask(task);
                setIsEditModalOpen(true);
              }}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => {
                setSelectedTask(task);
                setIsDeleteModalOpen(true);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {selectedTask && (
        <>
          <EditTaskModal
            task={selectedTask}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
          <DeleteTaskModal
            task={selectedTask}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
