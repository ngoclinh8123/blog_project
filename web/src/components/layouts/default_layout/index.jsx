import "./default_layout.module.scss";
import { Layout } from "antd";
import MyHeader from "./header";
import MySider from "./sider";
import MyContent from "./content";

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
