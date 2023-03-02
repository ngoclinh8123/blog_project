import Cookies from "universal-cookie";
import { Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import styles from "./header.module.scss";

const { Header } = Layout;
const cookie = new Cookies();
const text = "Are you sure to logout?";
const description = "Logout";

function MyHeader() {
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

export default MyHeader;
