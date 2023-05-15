import { Breadcrumb } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";

function CustomBreadCrum(props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { id } = useParams();
  const defineLocations = [
    { path: "/app/profile", location: "Hồ sơ" },
    { path: "/app/category", location: "Danh mục" },
    { path: "/app/blog", location: "Bài viết" },
  ];

  function getLocation() {
    const result = [];
    defineLocations.forEach((item) => {
      if (currentPath.indexOf(item.path) >= 0) {
        result.push({ item: item.location, path: item.path });
      }
    });
    if (props.detail) {
      result.push({ item: props.detail, path: "" });
    } else if (id) {
      result.push({ item: id, path: "" });
    }
    return result;
  }

  return (
    <div
      style={{
        backgroundColor: "#eeeeee93",
        margin: " 0 0 4px 0",
        fontFamily: "sans-serif",
        fontWeight: 700,
        fontSize: "1.4rem",
        padding: "2px 0 2px 4px",
      }}
    >
      <Breadcrumb>
        {getLocation().map((item) => (
          <Breadcrumb.Item>
            {item.path != "" ? (
              <Link to={item.path}>
                <span style={{ fontFamily: "sans-serif", fontWeight: 700 }}>
                  {item.item}
                </span>
              </Link>
            ) : (
              <span style={{ fontFamily: "sans-serif", fontWeight: 700 }}>
                {item.item}
              </span>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
}

export default CustomBreadCrum;
