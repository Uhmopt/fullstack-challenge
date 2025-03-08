import { TaskFilterOptionType } from '@/types/task'
import React from 'react'

interface PropsType {
  page: number
  limit: number
  total: number
  onPageChange: (v: TaskFilterOptionType) => void
}

const Pagination = ({ page, limit, total, onPageChange }: PropsType) => {
  const count = Math.ceil(total / limit)

  const handlePrevious = () => {
    if (page > 1) onPageChange({ page: page - 1 })
  }

  const handleNext = () => {
    if (page < count) onPageChange({ page: page + 1 })
  }

  return (
    <div className='w-full flex justify-between items-center'>
      <button
        onClick={handlePrevious}
        className={`${page <= 1 ? 'bg-gray-500' : 'bg-blue-500'} text-white px-4 py-2 rounded`}
      >
        Previous
      </button>
      <div className='w-fit box-border px-4 py-2 border border-solid border-gray-500 rounded-lg'>
        {page} / {count}
      </div>
      <button
        onClick={handleNext}
        className={`${count === page ? 'bg-gray-500' : 'bg-blue-500'} text-white px-4 py-2 rounded`}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
