import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./category.module.scss";
import api, { setOnTokenRefreshed } from "../../service/axios/api";

function Category() {
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const location = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("pk");

  useEffect(() => {
    api
      .get(`/categories/api/${id}`)
      .then((response) => {
        if (response) {
          setPosts(response.data["data"]);
        }
      })
      .catch((e) => {});
  }, [location, refresh]);

  // Use an effect hook to set the onTokenRefreshed callback to update the refresh flag
  useEffect(() => {
    setOnTokenRefreshed(() => {
      setRefresh(true);
    });
  }, []);

  return (
    <div className={styles.container}>
      <ul>
        {posts.map((post, index) => (
          <li key={index} className={styles.item}>
            <Link to="/blog">
              <p className={styles.item_title}>{post.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Category;
