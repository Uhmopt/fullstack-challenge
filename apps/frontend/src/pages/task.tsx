import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useHydratedAuthStore } from '../store/auth'
import { useTaskStore } from '../store/task'
import TaskList from '../components/TaskList'
import TaskFilter from '../components/TaskFilter'
import AddTaskModal from '../components/AddTaskModal'
import Pagination from '@/components/Pagination'
import { TaskFilterOptionType } from '@/types/task'

export default function Task() {
  const { token, isHydrated, logout } = useHydratedAuthStore()
  const { totalCount, fetchTasks } = useTaskStore()
  const router = useRouter()
  const [filter, setFilter] = useState<TaskFilterOptionType>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
  })

  const handleFilterChange = (v: TaskFilterOptionType) => {
    setFilter((prev) => ({ ...prev, ...v }))
  }

  const handleAddTask = () => {
    fetchTasks(filter)
  }

  useEffect(() => {
    if (!isHydrated && !token) {
      router.push('/login') // Redirect only after hydration
    } else if (isHydrated && token) {
      fetchTasks({}) // Load tasks when authenticated
    }
  }, [token, isHydrated])

  useEffect(() => {
    fetchTasks(filter)
  }, [filter])

  if (!isHydrated) return <p className='text-center'>Loading...</p>

  return (
    <div className='max-h-screen h-screen bg-gray-100 flex justify-center'>
      <div className='flex flex-col container max-w-5xl bg-white shadow-md rounded-lg p-6 mt-10'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-center'>Task Manager</h1>
          <button
            onClick={() => {
              logout()
              router.push('/login') // ✅ Redirect to login after logout
            }}
            className='bg-red-500 text-white px-4 py-2 rounded'
          >
            Logout
          </button>
        </div>
        <div className='flex justify-between items-center mb-4'>
          {/* 🔹 Left-Aligned Add Button */}
          <AddTaskModal onAddTask={handleAddTask} />

          {/* 🔹 Task Filter on Right Side */}
          <TaskFilter filter={filter} onFilterChange={handleFilterChange} />
        </div>

        {/* Task List */}
        <div className='flex-1 overflow-y-auto'>
          <TaskList />
        </div>
        <Pagination
          page={filter?.page ?? 0}
          limit={filter?.limit ?? 0}
          total={totalCount}
          onPageChange={handleFilterChange}
        />
      </div>
    </div>
  )
}
