import { Task, useTaskStore } from '../store/task'
import { useState } from 'react'
import EditTaskModal from './EditTaskModal'
import DeleteTaskModal from './DeleteTaskModal'
import TaskHistoryModal from './TaskHistoryModal'
import { TaskActionType } from '@/types/task'
import TaskItem from './TaskItem'

export default function TaskList() {
  const { filteredTasks } = useTaskStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [modalStatus, setModalStatus] = useState({
    edit: false,
    delete: false,
    history: false,
  })

  const handleModalClose = (key: TaskActionType) => {
    setModalStatus((prev) => ({ ...prev, [key]: false }))
  }

  const handleActionChange = (key: TaskActionType, task: Task) => {
    setSelectedTask(task)
    setModalStatus((prev) => ({ ...prev, [key]: true }))
  }

  return (
    <div className='w-full'>
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onActionChange={handleActionChange}
        />
      ))}
      {selectedTask && (
        <>
          <EditTaskModal
            task={selectedTask}
            isOpen={modalStatus.edit}
            onClose={() => handleModalClose('edit')}
          />
          <DeleteTaskModal
            task={selectedTask}
            isOpen={modalStatus.delete}
            onClose={() => handleModalClose('delete')}
          />
          <TaskHistoryModal
            task={selectedTask}
            isOpen={modalStatus.history}
            onClose={() => handleModalClose('history')}
          />
        </>
      )}
    </div>
  )
}
