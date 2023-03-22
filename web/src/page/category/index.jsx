import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button, Form, Input, InputNumber, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import { AuthContext } from "/src/util/context/auth_context";
import styles from "./category.module.css";

function Category() {
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();

  // get id of category
  const { id } = useParams();

  // use AuthContext to get status login
  const { loggedIn, handleLogout } = useContext(AuthContext);

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

  useEffect(() => {
    api
      .get(`/categories/api/${id}`)
      .then((response) => {
        if (response) {
          console.log(response);
          const postId = response.data.data;
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

  function openForm() {
    if (loggedIn) {
      setShowForm(true);
    } else {
      message.error("Please login to do this action");
    }
  }

  function closeForm() {
    setShowForm(false);
  }

  function gatherPostId() {
    const arrPostId = [];
    posts.forEach((post) => {
      arrPostId.push(post.id);
    });
    return arrPostId;
  }

  const onFinish = (values) => {
    const title = values.post.title;
    const content = values.post.content;

    // add new post to database
    api
      .post(`/posts/api/`, { title: title, content: content })
      .then((response) => {
        const arrPostId = gatherPostId();
        const newPostId = response.data.data;
        arrPostId.push(newPostId);

        // update category with new post
        api
          .put(`/categories/api/${id}/`, { posts: arrPostId })
          .then((response) => {
            message.success("Add post success");
            setPosts(response.data.data);
            setShowForm(false);
          })
          .catch((e) => {});
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={styles.container}>
      <button
        onClick={openForm}
        className={styles.btn_open_form}
        style={{ display: showForm ? "none" : "block" }}
      >
        {" "}
        <PlusOutlined />{" "}
        <span className={styles.btn_open_form_content}>New post</span>
      </button>
      <div
        className={styles.form}
        style={{ display: showForm ? "block" : "none" }}
      >
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
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
          >
            <Input />
          </Form.Item>
          <Form.Item name={["post", "content"]} label="Content">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              ...layout.wrapperCol,
              offset: 8,
            }}
          >
            <Button onClick={closeForm} className={styles.btn_close_form}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ul className={styles.post_list}>
        {posts.map((post, index) => (
          <li key={index} className={styles.post_item}>
            <Link to={`/blog/${post.id}`}>
              <p className={styles.item_title}>{post.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Category;
