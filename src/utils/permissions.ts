import { Permission } from "../models/Permission";



export const hasPermission = (permissions: Permission[], requiredPermission: string): boolean => {
    return permissions.some(p => p.authority === requiredPermission);
};
                