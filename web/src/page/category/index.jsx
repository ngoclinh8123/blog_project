import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Row, Col, Checkbox } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import { AuthContext } from "/src/util/context/auth_context";
import convertDate from "/src/util/convert_date";
import styles from "./category.module.css";

function Category() {
  const [posts, setPosts] = useState([]);
  const [paginations, setPaginations] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const location = useLocation();
  const formAddPostRef = useRef(null);

  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

  const navigate = useNavigate();
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

  function getCurrentPage() {
    const searchParams = new URLSearchParams(window.location.search);
    const page = searchParams.get("page");
    return page;
  }

  function getPost() {
    const page = getCurrentPage();
    let url = `/categories/api/${id}`;
    if (page) {
      url = url = `/categories/api/${id}?page=${page}`;
    }
    api
      .get(url)
      .then((response) => {
        if (response) {
          console.log(response);
          setPosts(response.data.data.items);
          setPaginations(response.data.data.pagination.link);
        }
      })
      .catch((e) => {
        if (e.response.status === 404) {
          setPosts({});
        }
      });
  }

  useEffect(() => {
    getPost();
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

  function closeFormEdit() {
    setEditPost(null);
  }

  function gatherPostId() {
    const arrPostId = [];
    posts.forEach((post) => {
      arrPostId.push(post.id);
    });
    return arrPostId;
  }

  const handleAddPost = (values) => {
    const title = values.post.title;
    const content = values.post.content;
    formAddPostRef.current.resetFields();

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
      .catch((e) => {});
  };

  function callUpdatePost(title, content, id) {
    api
      .put(`/posts/api/${id}`, { title: title, content: content })
      .then((response) => {
        getPost();
        setEditPost(null);
        message.success("Updated post successfully");
      })
      .catch((e) => {
        if (e.response.status === 403) {
          message.error("You have no permissions to edit this post");
        }
      });
  }

  // if user have login, have permission and valid data, update post
  const handleUpdatePost = (values) => {
    const title = values.post.title;
    const content = values.post.content;

    callUpdatePost(title, content, editPost);
  };

  function handleDeletePost(id) {
    if (loggedIn) {
      // call api to delete post here
      api
        .delete(`/posts/api/${id}`)
        .then((response) => {
          message.success(`Delete post ${id} successfully`);
          getPost();
        })
        .catch((e) => {
          if (e.response.status === 403) {
            message.error(`You have no permission to delete post ${id}`);
          }
        });
    } else {
      message.error("Please login to do this action");
    }
  }

  function handleDeletePosts() {
    checkedList.map((id) => {
      handleDeletePost(id);
    });
  }

  function handleClickEdit(post) {
    if (loggedIn) {
      setEditPost(post.id);
    } else {
      message.error("Please login to do this action");
    }
  }

  const handleCheckAll = (e) => {
    setIsCheckedAll(e.target.checked);
    if (e.target.checked) {
      setCheckedList(posts.map((post) => post.id));
    } else {
      setCheckedList([]);
    }
  };

  const handleCheckboxChange = (postId) => {
    if (checkedList.includes(postId)) {
      setCheckedList(checkedList.filter((id) => id !== postId));
    } else {
      setCheckedList([...checkedList, postId]);
    }
    setIsCheckedAll(checkedList.length + 1 === posts.length);
  };

  function handleNavigate(desination) {
    let page = parseInt(getCurrentPage() ? getCurrentPage() : 1);
    if (desination === "next") {
      page++;
    } else if (desination === "prev") {
      page--;
    }
    navigate(`?page=${page}`);
  }

  function renderPostItem(post) {
    return (
      <Link to={`/blog/${post.id}`} className={styles.post_item_link}>
        <Row justify="space-around" className={styles.item_sub_row}>
          <Col span={12} className={styles.item_sub_col}>
            <span className={styles.item_title}>{post.title}</span>
          </Col>
          <Col span={4} className={styles.item_sub_col}>
            <span className={styles.item_title}>{post.customer.username}</span>
          </Col>
          <Col span={4} className={styles.item_sub_col}>
            <span className={styles.item_title}>
              {convertDate(post.created_at)}
            </span>
          </Col>
          <Col span={4} className={styles.item_sub_col}>
            <span className={styles.item_title}>
              {convertDate(post.updated_at)}
            </span>
          </Col>
        </Row>
      </Link>
    );
  }

  function renderFormEdit(post) {
    return (
      <Form
        {...layout}
        name="nest-messages"
        onFinish={handleUpdatePost}
        style={
          {
            // maxWidth: 600,
          }
        }
        validateMessages={validateMessages}
      >
        <div className={styles.form_edit_row}>
          <Form.Item
            name={["post", "title"]}
            label="Title"
            rules={[
              {
                required: true,
              },
            ]}
            className={styles.form_edit_item}
            initialValue={post.title}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["post", "content"]}
            label="Content"
            className={styles.form_edit_item}
            initialValue={post.content}
          >
            <Input.TextArea />
          </Form.Item>
        </div>

        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button onClick={closeFormEdit} className={styles.btn_close_form}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }

  return (
    <div className={styles.container}>
      <Row justify="space-around" className={styles.item_row_head}>
        <Col span={1} className={styles.item_col_head}>
          {" "}
          <Checkbox checked={isCheckedAll} onChange={handleCheckAll}></Checkbox>
        </Col>
        <Col span={20} className={styles.item_col_head}>
          <Row justify="space-around" className={styles.item_sub_row_head}>
            <Col span={12} className={styles.item_sub_col_head}>
              <span>Title</span>
            </Col>
            <Col span={4} className={styles.item_sub_col_head}>
              <span>Author</span>
            </Col>
            <Col span={4} className={styles.item_sub_col_head}>
              <span>Created at</span>
            </Col>
            <Col span={4} className={styles.item_sub_col_head}>
              <span>Updated at</span>
            </Col>
          </Row>
        </Col>
        <Col span={3} className={styles.item_col_head}>
          {/* button open form add post */}
          <button
            onClick={openForm}
            className={styles.btn_open_form}
            style={{ display: showForm ? "none" : "block" }}
          >
            {" "}
            <PlusOutlined />{" "}
          </button>
        </Col>
      </Row>

      {/* form add post */}
      <div
        className={styles.form}
        style={{ display: showForm ? "block" : "none" }}
      >
        <div className={styles.form_title}>
          <span>Add new post</span>
        </div>
        <Form
          {...layout}
          ref={formAddPostRef}
          name="nest-messages"
          onFinish={handleAddPost}
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

      {/* list item */}
      <ul className={styles.post_list}>
        {posts.length > 0 &&
          posts.map((post, index) => (
            <Row justify="space-around" className={styles.item_row}>
              <Col span={1} className={styles.item_col}>
                <Checkbox
                  checked={checkedList.includes(post.id)}
                  onChange={() => handleCheckboxChange(post.id)}
                />
              </Col>
              <Col span={20} className={styles.item_col}>
                {editPost === post.id
                  ? renderFormEdit(post)
                  : renderPostItem(post)}
              </Col>
              <Col span={3} className={styles.item_col}>
                <EditOutlined
                  className={styles.post_item_action}
                  onClick={() => handleClickEdit(post)}
                />
                <DeleteOutlined
                  className={styles.post_item_action}
                  onClick={() => handleDeletePost(post.id)}
                />
              </Col>
            </Row>
          ))}
      </ul>

      <Row justify="space-around" className={styles.item_row_foot}>
        <Col span={1} className={styles.item_col_foot}>
          <Button
            className={styles.foot_item_delete}
            onClick={() => handleDeletePosts()}
            icon={<DeleteOutlined />}
            disabled={checkedList.length > 0 ? false : true}
          ></Button>
        </Col>
        <Col span={20} className={styles.item_col_foot}></Col>
        <Col span={3} className={styles.item_col_foot}>
          <Button
            disabled={!paginations.prev ? true : false}
            onClick={() => handleNavigate("prev")}
            className={styles.item_foot_paginate}
            icon={<LeftOutlined />}
          ></Button>
          <Button
            disabled={!paginations.next ? true : false}
            onClick={() => handleNavigate("next")}
            className={styles.item_foot_paginate}
            icon={<RightOutlined />}
          ></Button>
        </Col>
      </Row>
    </div>
  );
}

export default Category;
