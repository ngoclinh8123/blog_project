import Header from "/src/component/layout/client/header";
import Footer from "/src/component/layout/client/footer";
import styles from "./client.module.css";

function Client({ children }) {
  return (
    <div className="">
      <Header />
      <div className={styles.container}>
        <div className={styles.content_wrap}>{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default Client;
