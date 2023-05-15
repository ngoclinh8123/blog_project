import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import edjsHTML from "editorjs-html";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import convertDate from "/src/util/convert_date";
import styles from "./blog_detail.module.css";

function BlogDetail() {
  const [blog, setBlog] = useState();
  const [is404, setIs404] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { id } = useParams();

  function getPost() {
    api
      .get(`/api/v1/post/${id}/`)
      .then((response) => {
        // parse editorjs clean data to html
        const edjsParser = edjsHTML();
        const html = edjsParser.parse(
          JSON.parse(response.data.data["content"])
        );
        response.data.data["content"] = html;
        setBlog(response.data.data);
      })
      .catch((e) => {
        setIs404(true);
      });
  }

  // Use an effect hook to fetch the user information from the API when the refresh flag changes
  useEffect(() => {
    getPost();
  }, [refresh]);

  // Use an effect hook to set the onTokenRefreshed callback to update the refresh flag
  useEffect(() => {
    setOnTokenRefreshed(() => {
      setRefresh(true);
    });
  }, []);

  return (
    <div className={styles.container}>
      {blog && (
        <div className={styles.blog}>
          <div className={styles.post_content}>
            <h1 className={styles.title}>{blog.title}</h1>
            <div className={styles.post_info}>
              <div className={styles.post_info_content}>
                <span>{convertDate(blog.created_at)}</span>
                {/* <span>{blog.customer.username}</span> */}
              </div>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: blog.content.join("") }}
              className={styles.content}
            />
          </div>
        </div>
      )}
      {is404 && (
        <div className={styles.error}>
          <h1>404 not found</h1>
        </div>
      )}
    </div>
  );
}

export default BlogDetail;
