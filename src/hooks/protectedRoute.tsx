import React, { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usePermissions } from "@refinedev/core";
import { notification } from "antd";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredPermissions?: string[];
}

interface Permission {
    authority: string
}

type Permissions = string[];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermissions = [] }) => {
    const { data: permissions, isLoading } = usePermissions<Permission[]>();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isLoading) {
            const hasPermission = requiredPermissions.every(permission =>
                permissions?.some(p => p.authority === permission )
            );

            if (!hasPermission) {
                notification.error({
                    message: 'Unauthorized',
                    description: 'You do not have permission to view this page. Redirecting to dashboard.',
                });
                navigate("/blog-posts");
            }
        }
    }, [isLoading, permissions, requiredPermissions, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return children;
};

export default ProtectedRoute;