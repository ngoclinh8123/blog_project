import "./default_layout.module.css";
import { Layout } from "antd";
import myHeader from "./header";
import mySider from "./sider";
import myContent from "./content";

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
