import React, { useState, useContext } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FormOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Dropdown, Space, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MyContent from "/src/component/layout/default_layout/content";
import api from "/src/service/axios/api";
import { AuthContext } from "/src/util/context/auth_context";
import styles from "./default_layout.module.css";

const { Header, Sider, Content } = Layout;

function DefaultLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const items_sider = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Hồ sơ",
      path: "/app/profile",
    },
    {
      key: "2",
      icon: <ApartmentOutlined />,
      label: "Danh mục",
      path: "/app/category",
    },
    {
      key: "3",
      icon: <FormOutlined />,
      label: "Bài viết",
      path: "/",
    },
  ];

  // use AuthContext to get status login
  const { loggedIn, handleLogout, user } = useContext(AuthContext);

  function handleClickLogout() {
    api
      .post("/auth/logout/")
      .then((response) => {
        message.success("Đăng xuất thành công");
        handleLogout();
        navigate("/login");
      })
      .catch((e) => {});
  }

  function getCurrentPageSelected() {
    let result = 1;
    items_sider.forEach((item) => {
      if (item.path === currentPath) {
        result = item.key;
      }
    });
    return result;
  }

  const items = [
    {
      label: (
        <span onClick={() => handleClickLogout()}>
          {<LogoutOutlined />} Đăng xuất{" "}
        </span>
      ),
      key: "0",
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "#fff",
          borderRight: "1px solid #ccc",
          minHeight: "100vh",
        }}
      >
        <div className={styles.logo}>
          {!collapsed ? <span>LOGO</span> : <span></span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[getCurrentPageSelected()]}
        >
          {items_sider.map((item) => (
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
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a
              onClick={(e) => e.preventDefault()}
              className={styles.header_user_action}
            >
              <Space>
                {user.username}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Header>
        <MyContent>{children}</MyContent>
      </Layout>
    </Layout>
  );
}
export default DefaultLayout;
