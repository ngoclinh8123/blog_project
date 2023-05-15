import { useState, useEffect, createContext } from "react";
import { Link } from "react-router-dom";
import api from "/src/service/axios/api";
import MyPagination from "/src/page/home/pagination";
import styles from "./home.module.css";

export const PageContext = createContext(null);

function Home() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState({});

  function getPost(page = 1) {
    let url = `api/v1/post/?page=${page}`;
    api
      .get(url)
      .then((response) => {
        if (response) {
          setPosts(response.data.data);
        }
      })
      .catch((e) => {
        if (e.response && e.response.status === 404) {
          setPosts({});
        }
      });
  }

  useEffect(() => {
    getPost(page);
  }, [page]);

  const changePage = (x) => {
    setPage(x);
  };

  return (
    <div className={styles.container}>
      {posts.items &&
        posts.items.length > 0 &&
        posts.items.map((post) => (
          <Link to={`blog/${post.slug}`} className={styles.item_wrap}>
            <div className={styles.block_img}>
              <img src={post.image} alt="" />
            </div>
            <div className={styles.block_content}>
              <h1 className={styles.title}>{post.title}</h1>
              <p className={styles.time}>Aug 25, 2021</p>
              <p className={styles.des}>{post.desc}</p>
            </div>
          </Link>
        ))}

      <PageContext.Provider value={{ changePage, posts }}>
        <MyPagination />
      </PageContext.Provider>
    </div>
  );
}

export default Home;
