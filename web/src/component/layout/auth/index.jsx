import styles from "./auth.module.css";

function Auth({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default Auth;
