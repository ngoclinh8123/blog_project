import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import styles from "./blog.module.css";

function Blog() {
  const [blog, setBlog] = useState();
  const [refresh, setRefresh] = useState(false);
  const { id } = useParams();

  // Use an effect hook to fetch the user information from the API when the refresh flag changes
  useEffect(() => {
    api
      .get(`/posts/api/${id}`)
      .then((response) => {
        setBlog(response.data.data);
      })
      .catch((e) => {});
  }, [refresh]);

  // Use an effect hook to set the onTokenRefreshed callback to update the refresh flag
  useEffect(() => {
    setOnTokenRefreshed(() => {
      setRefresh(true);
    });
  }, []);

  return (
    <div>
      {blog && (
        <div>
          <Button>Edit</Button>
          <h2 className={styles.title}>{blog.title}</h2>
          <p className={styles.content}>{blog.content}</p>
        </div>
      )}
    </div>
  );
}

export default Blog;
