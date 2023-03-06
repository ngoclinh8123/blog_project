import { Layout } from "antd";
import myHeader from "/src/component/layout/default_layout/header";
import mySider from "/src/component/layout/default_layout/sider";
import myContent from "/src/component/layout/default_layout/content";
import styles from "./default_layout.module.css";

function defaultLayout({ children }) {
  return (
    <div className="container">
      <Layout>
        <myHeader />
        <Layout>
          <mySider />
          <Layout style={{ padding: "0 24px 24px" }}>
            <myContent>{children}</myContent>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default defaultLayout;
