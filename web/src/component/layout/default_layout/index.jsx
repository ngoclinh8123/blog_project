import React, { useState, useContext } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";
import MyContent from "/src/component/layout/default_layout/content";
import { AuthContext } from "/src/util/context/auth_context";
import styles from "./default_layout.module.css";

const { Header, Sider, Content } = Layout;

// use AuthContext to get status login
// const { loggedIn, handleLogout } = useContext(AuthContext);

const items = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: "Hồ sơ",
    path: "/app/profile",
  },
  {
    key: "2",
    icon: <VideoCameraOutlined />,
    label: "Danh mục",
    path: "/",
  },
  {
    key: "3",
    icon: <UploadOutlined />,
    label: "Bài viết",
    path: "/",
  },
];

function DefaultLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // console.log(user);
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "#fff",
          borderRight: "1px solid #ccc",
          height: "100vh",
        }}
      >
        <div className={styles.logo}>
          {!collapsed ? <span>LOGO</span> : <span></span>}
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: "0 6px",
          }}
          className={styles.header}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <MyContent
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </MyContent>
      </Layout>
    </Layout>
  );
}
export default DefaultLayout;
