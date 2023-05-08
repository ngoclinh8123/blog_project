import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input, message, Avatar } from "antd";
import { SendOutlined } from "@ant-design/icons";
import edjsHTML from "editorjs-html";
import { AuthContext } from "/src/util/context/auth_context";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import convertDate from "/src/util/convert_date";
import styles from "./blog_detail.module.css";

function BlogDetail() {
  const [blog, setBlog] = useState();
  const [comments, setComments] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { id } = useParams();
  const formCommentRef = useRef(null);

  // use AuthContext to get status login
  const { loggedIn, handleLogout, user } = useContext(AuthContext);

  // antdesign define
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

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
      .catch((e) => {});
  }

  function getComments() {
    api
      .get(`/api/v1/comment/${id}/`)
      .then((response) => {
        setComments(response.data.data);
      })
      .catch((e) => {});
  }

  function handleDeleteComment(id) {
    api
      .delete(`/api/v1/comment/${id}/`)
      .then((response) => {
        getComments();
      })
      .catch((e) => {});
  }

  const handleAddComment = (values) => {
    const post = id;
    const parent_id = 0;
    const content = values.comment;
    formCommentRef.current.resetFields();
    if (loggedIn) {
      api
        .post(`/api/v1/comment/`, {
          parent_id: parent_id,
          content: content,
          post: post,
        })
        .then((response) => {
          getComments();
          message.success("Add comment successfully");
        })
        .catch((e) => {
          message.error("Error while adding comment");
        });
    } else {
      message.error("Please login to do this action");
    }
  };

  // Use an effect hook to fetch the user information from the API when the refresh flag changes
  useEffect(() => {
    getPost();
    getComments();
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
          {/* post block */}
          <div className={styles.post_content}>
            <h2 className={styles.title}>{blog.title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className={styles.content}
            />
            <div className={styles.post_info}>
              <div className={styles.post_info_content}>
                <span>{convertDate(blog.created_at)}</span>
                <span>{blog.customer.username}</span>
              </div>
            </div>
          </div>

          {/* comment block */}
          <div className={styles.comment_block}>
            <div className={styles.total_comment}>
              <span>Comment</span>
              <span>( {comments.length} )</span>
            </div>
            <div className={styles.comment_form_block}>
              <Form
                ref={formCommentRef}
                className={styles.comment_form}
                {...layout}
                name="nest-messages"
                onFinish={handleAddComment}
                style={{
                  maxWidth: 600,
                }}
                validateMessages={validateMessages}
              >
                <Form.Item
                  className={styles.item_add_comment}
                  name={["comment"]}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Your comment..."
                    className={styles.input_add_comment}
                    style={{ flexGrow: 1 }}
                  />
                </Form.Item>
                <Button
                  className={styles.btn_add_comment}
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                ></Button>
              </Form>
            </div>

            {comments.length > 0 &&
              comments.map((comment, index) => (
                <div className={styles.comment_item_wrap} key={index}>
                  <div className={styles.comment_item}>
                    <div className={styles.comment_item_avatar}>
                      <Avatar
                        style={{
                          backgroundColor: "#f56a00",
                          verticalAlign: "middle",
                        }}
                        size="medium"
                      >
                        {comment.customer.username[0]}
                      </Avatar>
                    </div>
                    <div className={styles.comment_item_content_action}>
                      <div className={styles.comment_item_content}>
                        <div className={styles.comment_item_user}>
                          {comment.customer.username}
                        </div>
                        <div className={styles.comment_item_title}>
                          {comment.content}
                        </div>
                      </div>
                      <div className={styles.comment_item_action}>
                        {user.username === comment.customer.username && (
                          <span onClick={() => handleDeleteComment(comment.id)}>
                            Delete
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {comment.childs &&
                    comment.childs.map((child, ind) => (
                      <div className={styles.comment_sub_item} key={ind}>
                        <div className={styles.comment_item_avatar}>
                          <Avatar
                            style={{
                              backgroundColor: "#f56a00",
                              verticalAlign: "middle",
                            }}
                            size="medium"
                          >
                            {child.customer.username[0]}
                          </Avatar>
                        </div>
                        <div className={styles.comment_item_content_action}>
                          <div className={styles.comment_item_content}>
                            <div className={styles.comment_item_user}>
                              {child.customer.username}
                            </div>
                            <div className={styles.comment_item_title}>
                              {child.content}
                            </div>
                          </div>
                          <div className={styles.comment_item_action}>
                            {user.username === child.customer.username && (
                              <span
                                onClick={() => handleDeleteComment(child.id)}
                              >
                                Delete
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogDetail;
