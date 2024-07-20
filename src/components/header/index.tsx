import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity, usePermissions } from "@refinedev/core";
import {
  Avatar,
  Layout as AntdLayout,
  Space,
  Switch,
  theme,
  Typography,
  Menu,
  Dropdown,
  Button,
  notification,
  Select,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import { Permission } from "../../models/Permission";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../../utils/permissions";


const { Text } = Typography;
const { useToken } = theme;
const {Option} = Select;
type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { data: permissions, isLoading } = usePermissions<Permission[]>();
  const navigate = useNavigate();
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);
  const [defaultOption, setDefaultOption] = useState<string | undefined>(undefined);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  const handleChange = (value: string) => {
    if (value === "APP_ADMIN") {
        navigate("/app-admin");
    } else if (value === "WEB_ADMIN") {
        navigate("/web-admin");
    } else if (value === "CMS_ADMIN") {
        navigate("/cms-admin");
    } else {
        notification.error({
            message: 'Unauthorized',
            description: 'You do not have permission to view this page.',
        });
        navigate("/unauthorized");
    }
};

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  useEffect(() => {
    if (!isLoading && permissions) {
        if (hasPermission(permissions, "APP_ADMIN")) {
            setDefaultOption("APP_ADMIN");
        } else if (hasPermission(permissions, "WEB_ADMIN")) {
            setDefaultOption("WEB_ADMIN");
        } else if (hasPermission(permissions, "CMS_ADMIN")) {
            setDefaultOption("CMS_ADMIN");
        }else if (hasPermission(permissions, "READ_ONLY")) {
          setDefaultOption("APP_ADMIN");
      }
    }
}, [isLoading, permissions]);

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
      <Select
                placeholder="Select Admin View"
                style={{ width: 200 }}
                onChange={handleChange}
                value={defaultOption}
            >
                {hasPermission(permissions || [], "APP_ADMIN") && (
                    <Option value="APP_ADMIN">APP_ADMIN</Option>
                )}
                {hasPermission(permissions || [], "WEB_ADMIN") && (
                    <Option value="WEB_ADMIN">WEB_ADMIN</Option>
                )}
                {hasPermission(permissions || [], "CMS_ADMIN") && (
                    <Option value="CMS_ADMIN">CMS_ADMIN</Option>
                )}

                {hasPermission(permissions || [], "READ_ONLY") && (
                   <>
                    <Option value="APP_ADMIN">APP_ADMIN</Option>
                    <Option value="WEB_ADMIN">WEB_ADMIN</Option>
                    <Option value="CMS_ADMIN">CMS_ADMIN</Option>
                   </>
                )}
            </Select>
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
         
        <Space style={{ marginLeft: "8px" }} size="middle">
        
          {user?.name && <Text strong>{user.name}</Text>}
          {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
