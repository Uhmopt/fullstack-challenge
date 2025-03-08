import { useState } from 'react'
import Modal from 'react-modal'
import { useTaskStore } from '../store/task'

Modal.setAppElement('#__next')

interface PropsType {
  onAddTask: () => void
}

export default function AddTaskModal({ onAddTask }: PropsType) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { addTask } = useTaskStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return // Prevent empty task title

    await addTask(title, description)
    setTitle('')
    setDescription('')
    onAddTask()
    setIsOpen(false)
  }

  return (
    <>
      <div className='flex justify-start mb-4'>
        <button
          onClick={() => setIsOpen(true)}
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all'
        >
          + Add
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className='bg-white p-6 rounded-lg shadow-lg'
      >
        <form
          onSubmit={handleSubmit}
          className='max-w-md mx-auto bg-white shadow p-4 rounded-lg'
        >
          <h2 className='text-xl font-bold mb-2'>Add Task</h2>
          <input
            type='text'
            placeholder='Title'
            className='w-full p-2 border rounded'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder='Description'
            className='w-full p-2 border rounded mt-2'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className='flex justify-end mt-4'>
            <button
              onClick={() => setIsOpen(false)}
              className='bg-gray-500 text-white px-4 py-2 rounded mr-2'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded'
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
