import styles from "./error_404.module.css";
function Error404() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span>404</span>
        <span>Not Found !</span>
      </div>
    </div>
  );
}

export default Error404;
