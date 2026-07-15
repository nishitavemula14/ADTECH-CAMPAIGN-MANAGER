function getNameFromEmail(email) {
  const localPart = String(email || "").split("@")[0];
  const nameWithoutTrailingNumbers = localPart.replace(/\d+$/, "");

  return nameWithoutTrailingNumbers || localPart;
}

function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export function getUserLabel(user) {
  if (!user) {
    return "Unknown user";
  }

  if (user.role === "superadmin") {
    return "Super Admin";
  }

  return capitalizeName(getNameFromEmail(user.username));
}

export function getUserInitial(user) {
  if (user?.role === "superadmin") {
    return "SA";
  }

  return getUserLabel(user).charAt(0).toUpperCase() || "U";
}
