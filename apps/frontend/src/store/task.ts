import { create } from "zustand";
import { api } from "../lib/api";
import { useAuthStore } from "./auth";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface TaskHistory {
    id: string;
    oldStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    reason?: string;
    createdAt: string;
  }

interface TaskStore {
  tasks: Task[];
  taskHistory: TaskHistory[];
  filteredTasks: Task[];
  statusFilter: string;
  searchQuery: string;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description?: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setStatusFilter: (status: string) => void;
  fetchTaskHistory: (taskId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  taskHistory: [],
  statusFilter: "ALL",
  searchQuery: "",

  fetchTasks: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    const response = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Add token
    });
    set({ tasks: response.data });
    get().setStatusFilter(get().statusFilter);
  },
  fetchTaskHistory: async (taskId) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    const response = await api.get(`/tasks/${taskId}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    set({ taskHistory: response.data });
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
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters(); // Reapply filters when search changes
  },
  
  applyFilters: () => {
    const { tasks, statusFilter, searchQuery } = get();

    let filtered = tasks;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Filter by title or description
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    set({ filteredTasks: filtered });
  },

  setStatusFilter: (status) => {
    const { tasks } = get();
    const filteredTasks =
      status === "ALL" ? tasks : tasks.filter((task) => task.status === status);
    set({ statusFilter: status, filteredTasks });
  },
}));
