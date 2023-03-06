import { Layout } from "antd";
import MyHeader from "/src/component/layout/default_layout/header";
import MySider from "/src/component/layout/default_layout/sider";
import MyContent from "/src/component/layout/default_layout/content";
import styles from "./default_layout.module.css";

function DefaultLayout({ children }) {
  return (
    <div className="container">
      <Layout>
        <MyHeader />
        <Layout>
          <MySider />
          <Layout style={{ padding: "0 24px 24px" }}>
            <MyContent>{children}</MyContent>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default DefaultLayout;
