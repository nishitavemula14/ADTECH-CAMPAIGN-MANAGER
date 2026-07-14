import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { DEFAULT_USERS } from "../data/users.js";
import { AuthContext } from "./authContext.js";

const USERS_STORAGE_KEY = "adtech_users";
const CURRENT_USER_STORAGE_KEY = "adtech_current_user";
const LEGACY_DEFAULT_USER_IDENTIFIERS = [
  "admin-1",
  "nameadmin@gmail.com",
  "user-1",
  "user1",
  "user-2",
  "user2",
];

function isEmail(value) {
  return value.includes("@");
}

function isAdminEmail(value) {
  const normalizedValue = value.toLowerCase();
  return isEmail(normalizedValue) && normalizedValue.includes("admin");
}

function getRoleForUsername(username) {
  return isAdminEmail(username) ? "admin" : "user";
}

function normalizeUserRole(user) {
  if (["user", "admin", "superadmin"].includes(user.role)) {
    return user;
  }

  return {
    ...user,
    role: getRoleForUsername(user.username),
  };
}

function isLegacyDefaultUser(user) {
  return LEGACY_DEFAULT_USER_IDENTIFIERS.includes(user.id) ||
    LEGACY_DEFAULT_USER_IDENTIFIERS.includes(user.username.toLowerCase());
}

function reconcileDefaultUsers(users) {
  const userManagedUsers = users.filter((user) => !isLegacyDefaultUser(user));

  return DEFAULT_USERS.reduce((resolvedUsers, defaultUser) => {
    const existingUserIndex = resolvedUsers.findIndex(
      (user) =>
        user.id === defaultUser.id ||
        user.username.toLowerCase() === defaultUser.username.toLowerCase()
    );

    if (existingUserIndex === -1) {
      return [normalizeUserRole(defaultUser), ...resolvedUsers];
    }

    if (defaultUser.role !== "superadmin") {
      return resolvedUsers;
    }

    return resolvedUsers.map((user, index) =>
      index === existingUserIndex
        ? {
            ...user,
            id: defaultUser.id,
            username: defaultUser.username,
            password: defaultUser.password,
            role: defaultUser.role,
          }
        : user
    );
  }, userManagedUsers);
}

function readStoredUsers() {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const users = storedUsers === null ? DEFAULT_USERS : JSON.parse(storedUsers);
    return reconcileDefaultUsers(users.map(normalizeUserRole));
  } catch {
    return reconcileDefaultUsers(DEFAULT_USERS.map(normalizeUserRole));
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage(USERS_STORAGE_KEY, DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage(
    CURRENT_USER_STORAGE_KEY,
    null
  );

  useEffect(() => {
    setUsers((latestUsers) => {
      const normalizedUsers = latestUsers.map(normalizeUserRole);
      return reconcileDefaultUsers(normalizedUsers);
    });
  }, [setUsers]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const latestCurrentUser = users.find((user) => user.id === currentUser.id);
    const normalizedCurrentUser = normalizeUserRole(
      latestCurrentUser || currentUser
    );

    if (
      normalizedCurrentUser.role !== currentUser.role ||
      normalizedCurrentUser.username !== currentUser.username ||
      normalizedCurrentUser.password !== currentUser.password
    ) {
      setCurrentUser(normalizedCurrentUser);
    }
  }, [currentUser, setCurrentUser, users]);

  function login(username, password) {
    const normalizedUsername = username.trim().toLowerCase();

    if (isEmail(normalizedUsername) && !isAdminEmail(normalizedUsername)) {
      return false;
    }

    const latestUsers = readStoredUsers();
    const user = latestUsers.find(
      (item) =>
        item.username.toLowerCase() === normalizedUsername &&
        item.password === password
    );

    if (!user) {
      return false;
    }

    setCurrentUser(normalizeUserRole(user));
    return true;
  }

  function signup(username, password) {
    const normalizedUsername = username.trim();

    if (isEmail(normalizedUsername) && !isAdminEmail(normalizedUsername)) {
      return {
        ok: false,
        message: "Users must sign up with a username. Admin emails must include admin.",
      };
    }

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
      role: getRoleForUsername(normalizedUsername),
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

  function updateUser(userId, updatedUser) {
    if (currentUser?.role !== "superadmin") {
      return { ok: false, message: "Only super admin can edit users" };
    }

    const normalizedUsername = updatedUser.username?.trim();

    if (!normalizedUsername) {
      return { ok: false, message: "Username is required" };
    }

    const usernameExists = users.some(
      (user) =>
        user.id !== userId &&
        user.username.toLowerCase() === normalizedUsername.toLowerCase()
    );

    if (usernameExists) {
      return { ok: false, message: "Username already exists" };
    }

    setUsers((latestUsers) =>
      latestUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              username: normalizedUsername,
              password: updatedUser.password || user.password,
            }
          : user
      )
    );

    return { ok: true };
  }

  function changeUserRole(userId, role) {
    if (currentUser?.role !== "superadmin") {
      return { ok: false, message: "Only super admin can change roles" };
    }

    if (userId === currentUser.id && role !== "superadmin") {
      return {
        ok: false,
        message: "You cannot remove your own super admin access",
      };
    }

    setUsers((latestUsers) =>
      latestUsers.map((user) => (user.id === userId ? { ...user, role } : user))
    );

    return { ok: true };
  }

  function deleteUser(userId) {
    if (currentUser?.role !== "superadmin") {
      return { ok: false, message: "Only super admin can delete users" };
    }

    if (userId === currentUser.id) {
      return { ok: false, message: "You cannot delete your own account" };
    }

    setUsers((latestUsers) => latestUsers.filter((user) => user.id !== userId));
    return { ok: true };
  }

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isAdmin: currentUser?.role === "admin",
        isSuperAdmin: currentUser?.role === "superadmin",
        login,
        signup,
        updateUser,
        changeUserRole,
        deleteUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
