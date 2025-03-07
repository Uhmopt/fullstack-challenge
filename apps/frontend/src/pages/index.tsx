import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/task"); // ✅ Redirects to tasks page on first load
  }, []);

  return <p className="text-center">Loading tasks...</p>;
}
