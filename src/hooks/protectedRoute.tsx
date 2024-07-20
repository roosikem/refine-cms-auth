import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@refinedev/core";
import { notification } from "antd";
import { ProtectedRouteProps } from "../models/ProtectedRouteProps";
import { Permission } from "../models/Permission";




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