import { TaskFilterOptionType } from '@/types/task'
import { useTaskStore } from '../store/task'

interface PropsType {
  filter: TaskFilterOptionType
  onFilterChange: (v: TaskFilterOptionType) => void
}

export default function TaskFilter({ filter, onFilterChange }: PropsType) {
  const { statusFilter, setStatusFilter, searchQuery, setSearchQuery } =
    useTaskStore()

  const handleFilterOptionChange = (v: TaskFilterOptionType) =>
    onFilterChange(v)

  return (
    <div className='mb-4 flex flex-col md:flex-row gap-3 md:items-center'>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className='p-2 border rounded-lg w-full md:w-auto'
      >
        <option value='ALL'>All Tasks</option>
        <option value='PENDING'>Pending</option>
        <option value='IN_PROGRESS'>In Progress</option>
        <option value='COMPLETED'>Completed</option>
      </select>
      <select
        value={filter.limit}
        onChange={(e) =>
          handleFilterOptionChange({ limit: Number(e.target.value) })
        }
        className='p-2 border rounded-lg w-full md:w-auto'
      >
        <option value='10'>10</option>
        <option value='20'>20</option>
        <option value='50'>50</option>
        <option value='100'>100</option>
      </select>
      <select
        value={filter.sortBy}
        onChange={(e) => handleFilterOptionChange({ sortBy: e.target.value })}
        className='p-2 border rounded-lg w-full md:w-auto'
      >
        <option value='createdAt'>Created at</option>
        <option value='title'>Title</option>
      </select>
      <input
        type='text'
        placeholder='Search by title or description...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='box-border p-2 border rounded-lg outline-none'
      />
    </div>
  )
}
