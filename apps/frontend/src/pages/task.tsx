import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useHydratedAuthStore } from '../store/auth'
import { useTaskStore } from '../store/task'
import AddTask from '../components/AddTask'
import TaskList from '../components/TaskList'
import TaskFilter from '../components/TaskFilter'

export default function Task() {
  const { token, user, isHydrated, logout } = useHydratedAuthStore()
  const { fetchTasks } = useTaskStore()
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated && !token) {
      router.push('/login') // Redirect only after hydration
    } else if (isHydrated && token) {
      fetchTasks() // Load tasks when authenticated
    }
  }, [token, isHydrated])

  if (!isHydrated) return <p className='text-center'>Loading...</p>

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
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

      {user && (
        <p className='text-center text-gray-600'>Welcome, {user.email}</p>
      )}
      <div className='w-full flex flex-col gap-2'>
        <TaskFilter />
        <AddTask />
        <TaskList />
      </div>
    </div>
  )
}
