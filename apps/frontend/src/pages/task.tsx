import { useEffect } from "react";
import { useRouter } from "next/router";
import { useHydratedAuthStore } from "../store/auth";
import { useTaskStore } from "../store/task";
import TaskList from "../components/TaskList";
import TaskFilter from "../components/TaskFilter";
import AddTaskModal from "../components/AddTaskModal";

export default function Task() {
  const { token, isHydrated, logout } = useHydratedAuthStore();
  const { fetchTasks } = useTaskStore();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated && !token) {
      router.push("/login"); // Redirect only after hydration
    } else if (isHydrated && token) {
      fetchTasks(); // Load tasks when authenticated
    }
  }, [token, isHydrated]);

  if (!isHydrated) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="container max-w-5xl bg-white shadow-md rounded-lg p-6 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">Task Manager</h1>
          <button
            onClick={() => {
              logout();
              router.push("/login"); // ✅ Redirect to login after logout
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          {/* 🔹 Left-Aligned Add Button */}
          <AddTaskModal />

          {/* 🔹 Task Filter on Right Side */}
          <TaskFilter />
        </div>

        {/* Task List */}
        <TaskList />
      </div>
    </div>
  );
}
