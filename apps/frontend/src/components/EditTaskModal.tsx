import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useTaskStore } from "../store/task";

Modal.setAppElement("#__next");

export default function EditTaskModal({ task, isOpen, onClose }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "PENDING");
  const { updateTask } = useTaskStore();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
    }
  }, [task]);

  const handleUpdate = async () => {
    await updateTask(task.id, { title, description, status });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Edit Task</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 border rounded mt-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="w-full p-2 border rounded mt-2"
        value={status}
        onChange={(e) => setStatus(e.target.value as "PENDING" | "IN_PROGRESS" | "COMPLETED")}
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <div className="flex justify-end mt-4">
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
          Cancel
        </button>
        <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Task
        </button>
      </div>
    </Modal>
  );
}