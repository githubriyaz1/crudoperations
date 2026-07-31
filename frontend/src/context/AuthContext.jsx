/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthService } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const refreshed = await AuthService.refresh();
        if (active) setCurrentUser(refreshed.user);
      } catch {
        if (active) setCurrentUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      const result = await AuthService.login({ email, password });
      setCurrentUser(result.user);
      return { ok: true, user: result.user };
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid login credentials. Please try again.";
      return { ok: false, message };
    }
  }, []);

  const signup = useCallback(async ({ name, email, phone, password }) => {
    try {
      const result = await AuthService.register({ name, email, phone, password });
      setCurrentUser(result.user);
      return { ok: true, user: result.user };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Registration failed. Please check your details.";
      return { ok: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch {
      // Ignored
    } finally {
      setCurrentUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const updatedUser = await AuthService.updateMe(updates);
      setCurrentUser(updatedUser);
      return { ok: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile.";
      return { ok: false, message };
    }
  }, []);

  const value = useMemo(
    () => ({
      users,
      setUsers,
      currentUser,
      loading,
      isAuthenticated: Boolean(currentUser),
      isAdmin: currentUser?.role === "admin",
      login,
      signup,
      logout,
      updateProfile,
    }),
    [currentUser, loading, login, logout, signup, updateProfile, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
