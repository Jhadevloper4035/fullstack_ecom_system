import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        await fetchProfile();
      } catch {
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const setUser = (userData) => {
    if (userData) {
      setUserState(userData);
      localStorage.setItem("ph_user", JSON.stringify(userData));
    } else {
      setUserState(null);
      localStorage.removeItem("ph_user");
    }
  };

  const logout = async () => {
    try {
      // Clear user state
      setUser(null);
      
      // Clear any client-side storage
      localStorage.removeItem('ph_user');
      sessionStorage.clear();
      
      // Clear all cookies by setting them to expire in the past
      document.cookie.split(';').forEach(c => {
        const cookie = c.trim().split('=');
        const cookieName = cookie[0];
        // Clear for all paths and domains
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      });
      
      // Force a full page reload to ensure all state is cleared
      // Using window.location.replace() ensures the login page doesn't get added to browser history
      window.location.replace('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback in case of any errors
      setUser(null);
      localStorage.removeItem('ph_user');
      window.location.replace('/login');
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!res.ok) {
        throw new Error('Not authenticated');
      }

      const data = await res.json();
      const userData = data.user || data;
      setUser(userData);
      return userData;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, fetchProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}