const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchData(endpoint: string) {
  const res = await fetch(`${API_URL}/${endpoint}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}
