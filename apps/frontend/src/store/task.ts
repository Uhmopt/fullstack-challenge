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
  filteredTasks: Task[];
  statusFilter: string;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description?: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setStatusFilter: (status: string) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  statusFilter: "ALL",

  fetchTasks: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    const response = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Add token
    });
    set({ tasks: response.data });
    get().setStatusFilter(get().statusFilter);
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
    get().setStatusFilter(get().statusFilter);
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
    get().setStatusFilter(get().statusFilter);
  },

  deleteTask: async (id) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Add token
    });
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
    get().setStatusFilter(get().statusFilter);
  },

  setStatusFilter: (status) => {
    const { tasks } = get();
    const filteredTasks =
      status === "ALL" ? tasks : tasks.filter((task) => task.status === status);
    set({ statusFilter: status, filteredTasks });
  },
}));
