import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const USERS_STORAGE_KEY = "adtech_users";
const CURRENT_USER_STORAGE_KEY = "adtech_current_user";

export const DEFAULT_USERS = [
  {
    id: "user-1",
    username: "user1",
    password: "user123",
    role: "user",
  },
  {
    id: "user-2",
    username: "user2",
    password: "user123",
    role: "user",
  },
];

const AuthContext = createContext();

function readStoredUsers() {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers === null ? DEFAULT_USERS : JSON.parse(storedUsers);
  } catch {
    return DEFAULT_USERS;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage(USERS_STORAGE_KEY, DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage(
    CURRENT_USER_STORAGE_KEY,
    null
  );

  function login(username, password) {
    const latestUsers = readStoredUsers();
    const user = latestUsers.find(
      (item) => item.username === username && item.password === password
    );

    if (!user) {
      return false;
    }

    setCurrentUser(user);
    return true;
  }

  function signup(username, password) {
    const normalizedUsername = username.trim();
    const latestUsers = readStoredUsers();
    const usernameExists = latestUsers.some(
      (user) => user.username.toLowerCase() === normalizedUsername.toLowerCase()
    );

    if (usernameExists) {
      return {
        ok: false,
        message: "Username already exists",
      };
    }

    const user = {
      id: `user-${Date.now()}`,
      username: normalizedUsername,
      password,
      role: "user",
    };

    setUsers([...latestUsers, user]);

    return {
      ok: true,
      user,
    };
  }

  function logout() {
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return auth;
}
