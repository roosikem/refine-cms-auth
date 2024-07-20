import { Permission } from "../models/Permission";



export const hasPermission = (permissions: Permission[], requiredPermission: string): boolean => {
    return permissions.some(p => p.authority === requiredPermission);
};

function hasAnyPermission(permissions: Permission[], matchPerm:[]) {
  // Create a map of authorities from the permissions array
  const permissionAuthorities = permissions.map(permission => permission.authority);
  
  // Use some to check if any matchPerm element exists in permissionAuthorities
  return matchPerm.some(permission => permissionAuthorities.includes(permission));
}
                