import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Popconfirm } from "antd";
import { LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import styles from "./header.module.css";

const { Header } = Layout;
const cookie = new Cookies();
const text = "Are you sure to logout?";
const description = "Logout";

function myHeader() {
  const navigate = useNavigate();
  const token = cookie.get("token");

  function handleClickLogin() {
    navigate("/login");
  }

  function handleClickLogout() {
    cookie.remove("token");
    navigate("/login");
  }

  return (
    <Header className={styles.header}>
      <div className="logo"></div>
      {token ? (
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

export default myHeader;
