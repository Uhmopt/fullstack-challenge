import { create } from 'zustand'
import { api } from '../lib/api'
import { useAuthStore } from './auth'
import { TaskFilterOptionType, TaskStatusType } from '@/types/task'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatusType
}

export interface TaskHistory {
  id: string
  oldStatus: TaskStatusType
  newStatus: TaskStatusType
  reason?: string
  createdAt: string
}

interface TaskStore {
  tasks: Task[]
  totalCount: number
  taskHistory: TaskHistory[]
  filteredTasks: Task[]
  statusFilter: string
  searchQuery: string
  fetchTasks: (v: TaskFilterOptionType) => Promise<void>
  addTask: (title: string, description?: string) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setStatusFilter: (status: string) => void
  applyFilters: () => void
  fetchTaskHistory: (taskId: string) => Promise<void>
  setSearchQuery: (query: string) => void
}
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  totalCount: 0,
  filteredTasks: [],
  taskHistory: [],
  statusFilter: 'ALL',
  searchQuery: '',

  fetchTasks: async ({ page = 1, limit = 10, sortBy = 'createdAt' }) => {
    try {
      const { token } = useAuthStore.getState()
      if (!token) {
        console.error('No token found')
        return
      }

      const response = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, sortBy },
      })

      if (response.status !== 200) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`)
      }

      set(response.data)
      get().setStatusFilter(get().statusFilter)
    } catch (error: any) {
      console.error('Error fetching tasks:', error?.message || '')
      // Optionally, you can also display an error message to the user
      // set({ error: error.message });
    }
  },

  fetchTaskHistory: async (taskId) => {
    try {
      const { token } = useAuthStore.getState()
      if (!token) {
        console.error('No token found')
        return
      }

      const response = await api.get(`/tasks/${taskId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status !== 200) {
        throw new Error(`Failed to fetch task history: ${response.statusText}`)
      }

      set({ taskHistory: response.data })
    } catch (error: any) {
      console.error('Error fetching task history:', error?.message || '')
      // Optionally, display an error message to the user
      // set({ error: error.message });
    }
  },

  addTask: async (title, description) => {
    try {
      const { token } = useAuthStore.getState()
      if (!token) {
        console.error('No token found')
        return
      }

      const response = await api.post(
        '/tasks',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.status !== 201) {
        throw new Error(`Failed to add task: ${response.statusText}`)
      }

      const newTask: Task = response.data
      set((state) => ({ tasks: [...state.tasks, newTask] }))
      get().setStatusFilter(get().statusFilter)
    } catch (error: any) {
      console.error('Error adding task:', error?.message || '')
      // Optionally, display an error message to the user
      // set({ error: error.message });
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { token } = useAuthStore.getState()
      if (!token) {
        console.error('No token found')
        return
      }

      const response = await api.patch(`/tasks/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status !== 200) {
        throw new Error(`Failed to update task: ${response.statusText}`)
      }

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      }))
      get().setStatusFilter(get().statusFilter)
    } catch (error: any) {
      console.error('Error updating task:', error?.message || '')
      // Optionally, display an error message to the user
      // set({ error: error.message });
    }
  },

  deleteTask: async (id) => {
    try {
      const { token } = useAuthStore.getState()
      if (!token) {
        console.error('No token found')
        return
      }

      const response = await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status !== 204) {
        throw new Error(`Failed to delete task: ${response.statusText}`)
      }

      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }))
      get().setStatusFilter(get().statusFilter)
    } catch (error: any) {
      console.error('Error deleting task:', error?.message || '')
      // Optionally, display an error message to the user
      // set({ error: error.message });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().applyFilters() // Reapply filters when search changes
  },

  applyFilters: () => {
    const { tasks, statusFilter, searchQuery } = get()

    let filtered = tasks

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    // Filter by title or description
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    set({ filteredTasks: filtered })
  },

  setStatusFilter: (status) => {
    const { tasks } = get()
    const filteredTasks =
      status === 'ALL' ? tasks : tasks.filter((task) => task.status === status)
    set({ statusFilter: status, filteredTasks })
  },
}))
