import { Layout } from "antd";
import styles from "./content.module.css";
const { Content } = Layout;

function MyContent({ children }) {
  return (
    <Content style={{ backgroundColor: "#fff", padding: "4px" }}>
      {children}
    </Content>
  );
}

export default MyContent;
