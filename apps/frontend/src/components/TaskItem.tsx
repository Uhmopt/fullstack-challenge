import { Task } from '@/store/task'
import { TaskActionType } from '@/types/task'
import React from 'react'

interface TaskItemPropsType {
  task: Task
  onActionChange: (key: TaskActionType, task: Task) => void
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-500',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
}

const TASK_STATUSES = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
}

const TaskItem = ({ task, onActionChange }: TaskItemPropsType) => {
  const handleActionChange = (key: TaskActionType, task: Task) => {
    onActionChange(key, task)
  }

  return (
    <div key={task.id} className='w-full bg-white shadow p-4 rounded-lg mb-2'>
      <div className='w-full flex justify-between items-center'>
        <span className='text-xl font-semibold'>{task.title}</span>
        <span
          className={`px-3 py-1 rounded-lg text-white ${STATUS_COLORS[task.status]}`}
        >
          {TASK_STATUSES[task.status]}
        </span>
      </div>
      <p className='text-gray-600'>{task.description}</p>
      <div className='mt-2 flex gap-2'>
        <button
          className='bg-blue-500 text-white px-3 py-1 rounded'
          onClick={() => handleActionChange('edit', task)}
        >
          Edit
        </button>
        <button
          className='bg-red-500 text-white px-3 py-1 rounded'
          onClick={() => handleActionChange('delete', task)}
        >
          Delete
        </button>
        <button
          className='bg-gray-700 text-white px-3 py-1 rounded'
          onClick={() => handleActionChange('history', task)}
        >
          View History
        </button>
      </div>
    </div>
  )
}

export default TaskItem
