import { create } from "zustand";
import { api } from "../lib/api";
import { useAuthStore } from "./auth";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

interface TaskStore {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description?: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  fetchTasks: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    const response = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Add token
    });
    set({ tasks: response.data });
  },

  addTask: async (title, description) => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    const response = await api.post(
        "/tasks",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Add token
    );
    const newTask: Task = response.data; // Ensure response matches Task type
    set((state) => ({ tasks: [...state.tasks, newTask] })); 
  },

  updateTask: async (id, updates) => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    await api.patch(`/tasks/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Add token
    });
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    }));
  },

  deleteTask: async (id) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Add token
    });
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },
}));
