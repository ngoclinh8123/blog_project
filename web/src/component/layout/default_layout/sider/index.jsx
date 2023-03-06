import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import styles from "./sider.module.css";

const SubMenu = Menu.SubMenu;
const { Sider } = Layout;
const rootSubmenuKeys = ["/", "/profile", "1"];

function MySider() {
  const [categories, setCategories] = useState([]);
  const [openKeys, setOpenKeys] = useState(["/"]);
  const [refresh, setRefresh] = useState(false);

  // Use an effect hook to fetch the user information from the API when the refresh flag changes
  useEffect(() => {
    api.get("/categories/api").then((response) => {
      setCategories(response.data.data);
    });
  }, [refresh]);

  // Use an effect hook to set the onTokenRefreshed callback to update the refresh flag
  useEffect(() => {
    setOnTokenRefreshed(() => {
      setRefresh(true);
    });
  });

  function render_category_item(categories) {
    return categories.map((category) => {
      if (category.childs && category.childs.length) {
        return (
          <SubMenu key={`/category/${category.id}`} title={category.title}>
            {render_category_item(category.childs)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={`/category/${category.id}`}>
            <Link to={`/category?pk=${category.id}`}>{category.title}</Link>
          </Menu.Item>
        );
      }
    });
  }

  function onOpenChange(keys) {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  }

  return (
    <Sider width={256} style={{ backgroundColor: "#ccc", minHeight: "100vh" }}>
      <Menu mode="inline" openKeys={openKeys} onOpenChange={onOpenChange}>
        <Menu.Item key="/profile">
          <Link to="/profile">
            <UserOutlined />
            <span className={styles.category_item_title}>Profile</span>
          </Link>
        </Menu.Item>
        <SubMenu key="category" title="Category" icon={<AppstoreOutlined />}>
          {render_category_item(categories)}
        </SubMenu>
      </Menu>
    </Sider>
  );
}

export default MySider;
