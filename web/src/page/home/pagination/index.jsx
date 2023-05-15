import { useContext } from "react";
import { Pagination } from "antd";
import { PageContext } from "/src/page/home";
import styles from "./pagination.module.css";

function MyPagination() {
  const { changePage, posts } = useContext(PageContext);

  let pagination = {
    current_page: 1,
    extra: {},
    link: {
      next: "",
      prev: "",
    },
    page_size: 10,
    total_page: 1,
  };

  if (posts.pagination) {
    pagination = posts.pagination;
  }

  function onChange(page) {
    changePage(page);
  }

  return (
    <div className={styles.pagination_wrap}>
      <Pagination
        defaultCurrent={1}
        total={pagination.page_size * pagination.total_page}
        onChange={onChange}
        showSizeChanger={false}
        className={styles.pagination}
      />
    </div>
  );
}

export default MyPagination;
