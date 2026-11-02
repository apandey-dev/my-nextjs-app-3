import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Task 1 — Context API Global State Management
 *
 * Provides application-wide user state (name, email) without prop drilling.
 * Manages user state updates, session hydration from server on mount,
 * and clean logout execution.
 */

// 1. Create the React Context
const UserContext = createContext(null);

export function UserProvider({ children }) {
  // Sensible default: unauthenticated state (not hardcoded)
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check existing session on mount via /api/auth/me
  useEffect(() => {
    let isMounted = true;

    async function checkAuthSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Updates the logged-in user state.
   * Can be called after login or profile edit.
   */
  const updateUser = (userData) => {
    if (!userData) {
      setUser(null);
    } else {
      setUser({
        name: userData.name || '',
        email: userData.email || '',
      });
    }
  };

  /**
   * Logs out the user by clearing the server cookie and local context state,
   * then redirects to /login.
   */
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    updateUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Reusable custom hook for consuming UserContext cleanly in any component.
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
