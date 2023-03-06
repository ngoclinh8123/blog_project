import { Layout } from "antd";
import "./content.module.css";
const { Content } = Layout;

function myContent({ children }) {
  return <Content style={{ padding: "24px", margin: "0" }}>{children}</Content>;
}

export default myContent;
