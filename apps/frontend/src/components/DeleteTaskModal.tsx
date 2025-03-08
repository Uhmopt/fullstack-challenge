import Modal from 'react-modal'
import { useTaskStore } from '../store/task'
import { ModalPropsType } from '@/types/global'

Modal.setAppElement('#__next')

export default function DeleteTaskModal({
  task,
  isOpen,
  onClose,
}: ModalPropsType) {
  const { deleteTask } = useTaskStore()

  const handleDelete = async () => {
    await deleteTask(task.id)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className='bg-white p-6 rounded-lg shadow-lg'
    >
      <h2 className='text-xl font-bold mb-4 text-red-500'>Delete Task</h2>
      <p>
        Are you sure you want to delete the task "<strong>{task.title}</strong>
        "?
      </p>

      <div className='flex justify-end mt-4'>
        <button
          onClick={onClose}
          className='bg-gray-500 text-white px-4 py-2 rounded mr-2'
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className='bg-red-500 text-white px-4 py-2 rounded'
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}
