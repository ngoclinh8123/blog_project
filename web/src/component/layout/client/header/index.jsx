import {
  CoffeeOutlined,
  GithubOutlined,
  FacebookOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styles from "./header.module.css";

function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.block_logo}>
        <a href="/">
          <span>
            <CoffeeOutlined />
          </span>
          <span>Ngoc Linh</span>
        </a>
      </div>
      <div className={styles.block_action}>
        <a href="https://github.com/ngoclinh8123">
          <GithubOutlined />
        </a>
        <a href="https://www.linkedin.com/in/ngoc-linh-dev">
          <LinkedinOutlined />
        </a>
        <a href="https://www.facebook.com/profile.php?id=100079974984638">
          <FacebookOutlined />
        </a>
        <Link to="/login" className={styles.login_btn}>
          Login
        </Link>
      </div>
    </div>
  );
}

export default Header;
