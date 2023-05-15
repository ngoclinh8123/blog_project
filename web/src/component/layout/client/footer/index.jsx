import {
  CopyrightOutlined,
  GithubOutlined,
  FacebookOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import styles from "./footer.module.css";

function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.block_logo}>
        <span>
          <CopyrightOutlined />
        </span>
        <span>Ngoc Linh</span>
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
      </div>
    </div>
  );
}

export default Footer;
