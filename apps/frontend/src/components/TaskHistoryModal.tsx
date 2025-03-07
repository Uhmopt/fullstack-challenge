import { useEffect } from "react";
import Modal from "react-modal";
import { useTaskStore } from "../store/task";

Modal.setAppElement("#__next");

export default function TaskHistoryModal({ task, isOpen, onClose }) {
  const { taskHistory, fetchTaskHistory } = useTaskStore();

  useEffect(() => {
    if (task.id && isOpen) {
      fetchTaskHistory(task.id);
    }
  }, [task.id, isOpen]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto">
      <h2 className="text-xl font-bold mb-4">Task History</h2>
      
      {taskHistory.length === 0 ? (
        <p className="text-gray-500">No history available.</p>
      ) : (
        <div className="space-y-4">
          {taskHistory.map((entry) => (
            <div key={entry.id} className="border-b p-2">
              <p><strong>Old Status:</strong> {entry.oldStatus}</p>
              <p><strong>New Status:</strong> {entry.newStatus}</p>
              {entry.reason && <p><strong>Reason:</strong> {entry.reason}</p>}
              <p className="text-gray-500 text-sm">{new Date(entry.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Close
      </button>
    </Modal>
  );
}
