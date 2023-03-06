import styles from "./auth.module.css";

function auth({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default auth;
