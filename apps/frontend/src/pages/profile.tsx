import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';
import { useRouter } from 'next/router';

export default function Profile() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const [user, setUser] = useState({email: ''});
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.post('/auth/profile');
        setUser(res.data);
      } catch {
        logout();
        router.push('/login');
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div>
      <h1>Profile</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
