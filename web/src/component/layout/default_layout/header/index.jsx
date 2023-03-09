import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Popconfirm } from "antd";
import { LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { AuthContext } from "/src/util/context/auth_context";
import api from "/src/service/axios/api";
import styles from "./header.module.css";

const { Header } = Layout;
const text = "Are you sure to logout?";
const description = "Logout";

function MyHeader() {
  const { loggedIn, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleClickLogin() {
    navigate("/login");
  }

  function handleClickLogout() {
    api
      .post("/auth/logout/")
      .then((response) => {
        // set status loggedIn to false
        handleLogout();

        // navigate to login page
        navigate("/login");
      })
      .catch((error) => {});
  }

  return (
    <Header className={styles.header}>
      <div className="logo"></div>
      {loggedIn ? (
        <Popconfirm
          placement="bottomRight"
          title={text}
          description={description}
          onConfirm={handleClickLogout}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" className={styles.btn_logout}>
            <span>Logout</span>
            <LogoutOutlined className={styles.icon_logout} />
          </Button>
        </Popconfirm>
      ) : (
        <Button
          type="link"
          className={styles.btn_logout}
          onClick={handleClickLogin}
        >
          <span>Login</span>
          <LoginOutlined className={styles.icon_logout} />
        </Button>
      )}
    </Header>
  );
}

export default MyHeader;
