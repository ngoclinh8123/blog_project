import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input, message, Avatar } from "antd";
import { EditOutlined, SendOutlined } from "@ant-design/icons";
import { AuthContext } from "/src/util/context/auth_context";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import styles from "./blog.module.css";

function Blog() {
  const [blog, setBlog] = useState();
  const [comments, setComments] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
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

  function openForm() {
    if (loggedIn) {
      api
        .put(`/posts/api/${id}`, { title: blog.title, content: blog.content })
        .then((response) => {
          setShowForm(true);
        })
        .catch((e) => {
          if (e.response.status === 403) {
            message.error("You have no permissions to update this post");
          }
        });
    } else {
      message.error("Please login to do this action");
    }
  }

  function closeForm() {
    setShowForm(false);
  }

  function getPost() {
    api
      .get(`/posts/api/${id}`)
      .then((response) => {
        setBlog(response.data.data);
      })
      .catch((e) => {});
  }

  function getComments() {
    api
      .get(`/comments/api/${id}`)
      .then((response) => {
        setComments(response.data.data);
      })
      .catch((e) => {});
  }

  function handleDeleteComment(id) {
    api
      .delete(`/comments/api/${id}`)
      .then((response) => {
        getComments();
      })
      .catch((e) => {});
  }

  function callUpdatePost(title, content) {
    api
      .put(`/posts/api/${id}`, { title: title, content: content })
      .then((response) => {
        getPost();
        setShowForm(false);
      })
      .catch((e) => {
        if (e.response.status === 403) {
          message.error("You have no permissions to update this post");
        }
      });
  }

  // if user have login, have permission and valid data, update post
  const handleUpdatePost = (values) => {
    const title = values.post.title;
    const content = values.post.content;

    callUpdatePost(title, content);
  };

  const handleAddComment = (values) => {
    const post = id;
    const parent_id = 0;
    const content = values.comment;
    formCommentRef.current.resetFields();
    if (loggedIn) {
      api
        .post(`/comments/api/`, {
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
          <Button
            className={styles.btn_open_form}
            onClick={() => openForm()}
            style={{ display: showForm ? "none" : "block" }}
          >
            <EditOutlined />
            <span>Edit</span>
          </Button>

          {/* form edit post */}
          <div
            className={styles.form}
            style={{ display: showForm ? "block" : "none" }}
          >
            <Form
              {...layout}
              name="nest-messages"
              onFinish={handleUpdatePost}
              style={{
                maxWidth: 600,
              }}
              validateMessages={validateMessages}
            >
              <Form.Item
                name={["post", "title"]}
                label="Title"
                rules={[
                  {
                    required: true,
                  },
                ]}
                initialValue={blog.title}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["post", "content"]}
                label="Content"
                initialValue={blog.content}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  ...layout.wrapperCol,
                  offset: 8,
                }}
              >
                <Button
                  onClick={() => closeForm()}
                  className={styles.btn_close_form}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* post block */}
          <div className={styles.post_content}>
            <h2 className={styles.title}>{blog.title}</h2>
            <p className={styles.content}>{blog.content}</p>
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
                <div className={styles.comment_item_wrap}>
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
                    comment.childs.map((child, index) => (
                      <div className={styles.comment_sub_item} key={index}>
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

export default Blog;

// {comment.childs &&
//   comment.childs.map((child, index) => (

//   ))}
