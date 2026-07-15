import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { DEFAULT_USERS } from "../data/users.js";
import { AuthContext } from "./authContext.js";

const USERS_STORAGE_KEY = "adtech_users";
const CURRENT_USER_STORAGE_KEY = "adtech_current_user";
const LEGACY_DEFAULT_USER_IDENTIFIERS = [
  "admin-1",
  "user-1",
  "user1",
  "user-2",
  "user2",
  "superadmin",
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return EMAIL_PATTERN.test(email);
}

function normalizeUserRole(user) {
  if (["user", "admin", "superadmin"].includes(user.role)) {
    return user;
  }

  return {
    ...user,
    role: "user",
  };
}

function isLegacyDefaultUser(user) {
  return LEGACY_DEFAULT_USER_IDENTIFIERS.includes(user.id) ||
    LEGACY_DEFAULT_USER_IDENTIFIERS.includes(user.username.toLowerCase());
}

function reconcileDefaultUsers(users) {
  const userManagedUsers = users.filter(
    (user) => !isLegacyDefaultUser(user)
  );

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

function addUserDisplayIds(users) {
  let displayId = 0;

  return users.map((user) => {
    if (user.role === "superadmin") {
      return user;
    }

    displayId += 1;

    return {
      ...user,
      displayId: displayId.toString(),
    };
  });
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage(USERS_STORAGE_KEY, DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage(
    CURRENT_USER_STORAGE_KEY,
    null
  );
  const displayUsers = addUserDisplayIds(users);
  const displayCurrentUser = currentUser
    ? displayUsers.find((user) => user.id === currentUser.id) || currentUser
    : null;

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

  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return { ok: false, message: "Enter a valid email address" };
    }

    const latestUsers = readStoredUsers();
    const user = latestUsers.find(
      (item) =>
        item.username.toLowerCase() === normalizedEmail &&
        item.password === password
    );

    if (!user) {
      return { ok: false, message: "Invalid email or password" };
    }

    setCurrentUser(normalizeUserRole(user));
    return {
      ok: true,
      user: normalizeUserRole(user),
    };
  }

  function signup(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return {
        ok: false,
        message: "Enter a valid email address",
      };
    }

    const latestUsers = readStoredUsers();
    const emailExists = latestUsers.some(
      (user) => user.username.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      return {
        ok: false,
        message: "Email already exists",
      };
    }

    const user = {
      id: `user-${Date.now()}`,
      username: normalizedEmail,
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

  function updateUser(userId, updatedUser) {
    if (currentUser?.role !== "superadmin") {
      return { ok: false, message: "Only super admin can edit users" };
    }

    const normalizedUsername = updatedUser.username?.trim();

    if (!normalizedUsername) {
      return { ok: false, message: "Email is required" };
    }

    if (!isValidEmail(normalizedUsername)) {
      return { ok: false, message: "Enter a valid email address" };
    }

    const usernameExists = users.some(
      (user) =>
        user.id !== userId &&
        user.username.toLowerCase() === normalizedUsername.toLowerCase()
    );

    if (usernameExists) {
      return { ok: false, message: "Email already exists" };
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
        users: displayUsers,
        currentUser: displayCurrentUser,
        isAuthenticated: Boolean(displayCurrentUser),
        isAdmin: displayCurrentUser?.role === "admin",
        isSuperAdmin: displayCurrentUser?.role === "superadmin",
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
