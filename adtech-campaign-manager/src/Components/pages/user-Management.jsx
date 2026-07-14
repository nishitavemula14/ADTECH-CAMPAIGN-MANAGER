import toast from "react-hot-toast";

import { useAuth } from "../../auth/useAuth.js";
import EmptyState from "../atoms/empty.jsx";
import UserManagementCard from "../molecules/userManagementCard.jsx";
import UserManagementTable from "../organisms/userManagementTable.jsx";

export default function UserManagement() {
  const { users, changeUserRole, deleteUser } = useAuth();
  const managedUsers = users.filter((user) => user.role !== "superadmin");

  function updateRole(user, role) {
    const result = changeUserRole(user.id, role);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(`${user.username} ${role === "admin" ? "promoted to Admin" : "demoted to User"}`);
  }

  function confirmDeleteUser(user) {
    const confirmToastId = `delete-user-${user.id}`;

    toast.custom(
      (toastItem) => (
        <div
          className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)] rounded-lg bg-white p-4 shadow-xl dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-bold text-gray-900 dark:text-slate-100">
            Delete this user?
          </p>
          <p className="mt-2 break-words text-sm text-gray-600 dark:text-slate-300">
            {user.username} will be removed permanently.
          </p>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.dismiss(toastItem.id);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const result = deleteUser(user.id);

                if (!result.ok) {
                  toast.error(result.message);
                  return;
                }

                toast.dismiss(toastItem.id);
                toast.success(`${user.username} deleted`, {
                  id: `delete-user-success-${user.id}`,
                });
              }}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        id: confirmToastId,
        position: "top-center",
      }
    );
  }

  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col p-3 sm:p-4 lg:p-6">
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Super Admin
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl">User Management</h1>
      </div>

      {managedUsers.length === 0 ? (
        <EmptyState
          title="No Users Found"
          message="Registered users will appear here."
        />
      ) : (
        <>
          <div className="campaign-list-scrollbar grid max-h-[calc(100dvh-220px)] gap-3 overflow-y-auto pr-1 lg:hidden md:grid-cols-2">
            {managedUsers.map((user) => (
              <UserManagementCard
                key={user.id}
                user={user}
                onDeleteUser={confirmDeleteUser}
                onRoleChange={updateRole}
              />
            ))}
          </div>

          <UserManagementTable
            users={managedUsers}
            onDeleteUser={confirmDeleteUser}
            onRoleChange={updateRole}
          />
        </>
      )}
    </div>
  );
}
