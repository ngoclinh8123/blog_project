import classNames from "classnames/bind";
import styles from "./blog.module.css";

const cx = classNames.bind(styles);

function Blog() {
  return (
    <div>
      <h1 className={cx("title")}>blog page</h1>
    </div>
  );
}

export default Blog;
