import { useEffect } from "react";
import { useRouter } from "next/router";
import { useHydratedAuthStore } from "../store/auth";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import TaskFilter from "../components/TaskFilter";

export default function Task() {
  const { token, user, isHydrated  } = useHydratedAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !token) {
      router.push("/login"); // ✅ Redirect only after hydration
    }
  }, [token, isHydrated]);

  if (!isHydrated) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center">Task Manager</h1>
      {user && <p className="text-center text-gray-600">Welcome, {user.email}</p>}
      <TaskFilter />
      <AddTask />
      <TaskList />
    </div>
  );
}
