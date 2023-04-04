import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Form, Input, message, Table, Modal } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import { AuthContext } from "/src/util/context/auth_context";
import convertDate from "/src/util/convert_date";
import styles from "./category_detail.module.css";

const onChange = (pagination, filters, sorter, extra) => {
  // console.log("params", pagination, filters, sorter, extra);
};

function CategoryDetail() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addOrUpdate, setAddOrUpdate] = useState(0);
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedIn, handleLogout } = useContext(AuthContext);

  // table
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  // modal
  const formPostRef = useRef(null);
  const modalRef = useRef(null);
  const { TextArea } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 20,
    },
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.id - b.id,
      width: "5%",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.title.length - b.title.length,
      width: "30%",
    },
    {
      title: "Tác giả",
      dataIndex: "customer",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.customer.localeCompare(b.customer),
      filters: handleCustomerFilter(),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.title.includes(value),
      width: "15%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.title.length - b.title.length,
      // width: "30%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.title.length - b.title.length,
      // width: "30%",
    },
    {
      title: (
        <PlusOutlined
          onClick={() => handleClickAddPost()}
          className={styles.btn_add}
        />
      ),
      dataIndex: "",
      key: "x",
      render: (value) => (
        <span>
          <EyeOutlined
            onClick={() => handleClickViewPost(value.key)}
            className={styles.btn_action}
            title="xem bài viết"
          />
          <EditOutlined
            onClick={() => handleClickEditPost(value.key)}
            className={styles.btn_action}
            title="sửa bài viết"
          />
          <DeleteOutlined
            onClick={() => handleClickDeletePost(value.key)}
            className={styles.btn_action}
            title="xóa bài viết"
          />
        </span>
      ),
    },
  ];

  const data = handlePostData();

  function handlePostData() {
    const result = [];
    if (posts.length > 0) {
      posts.forEach((post) => {
        result.push({
          key: post.id,
          id: post.id,
          title: post.title,
          customer: post.customer.username,
          created_at: convertDate(post.created_at),
          updated_at: convertDate(post.updated_at),
        });
      });
    }
    return result;
  }

  function handleCustomerFilter() {
    const result = [];
    const arrCustomer = [];
    if (posts.length > 0) {
      posts.forEach((post) => {
        if (!arrCustomer.includes(post.customer.username)) {
          arrCustomer.push(post.customer.username);
        }
      });
    }
    if (arrCustomer.length > 0) {
      arrCustomer.forEach((customer) => {
        result.push({ text: customer, value: customer });
      });
    }
    return result;
  }

  function getPost() {
    api
      .get(`/categories/api/${id}`)
      .then((response) => {
        if (response) {
          setPosts(response.data.data);
        }
      })
      .catch((e) => {
        if (e.response.status === 404) {
          setPosts({});
        }
      });
  }

  function getCategory() {
    api
      .get("/categories/api")
      .then((response) => {
        if (response) {
          setCategory(response.data.data);
        }
      })
      .catch((e) => {
        if (e.response.status === 404) {
          setCategory({});
        }
      });
  }

  function getCategoryInfo(id) {
    let result = { title: "", parent_id: "", posts: [] };
    if (category.length > 0) {
      category.forEach((item) => {
        if (item.id == id) {
          result = item;
        }
        if (item.childs) {
          item.childs.forEach((child) => {
            if (child.id == id) {
              result = child;
            }
          });
        }
      });
    }
    return result;
  }

  function gatherPostId() {
    const arrPostId = [];
    posts.forEach((post) => {
      arrPostId.push(post.id);
    });
    return arrPostId;
  }

  useEffect(() => {
    getPost();
    getCategory();
  }, [location, refresh]);

  // Use an effect hook to set the onTokenRefreshed callback to update the refresh flag
  useEffect(() => {
    setOnTokenRefreshed(() => {
      setRefresh(true);
    });
  }, []);

  function getInfoPost(id) {
    let result = {};
    if (posts.length > 0) {
      posts.forEach((post) => {
        if (id == post.id) {
          result = post;
        }
        if (post.childs) {
          post.childs.forEach((child) => {
            if (id == child.id) {
              result = child;
            }
          });
        }
      });
    }
    return result;
  }

  function handleClickDeletePost(id) {
    if (loggedIn) {
      // call api to delete post here
      callDeletePost(id);
    } else {
      message.error("Please login to do this action");
    }
  }

  function callDeletePost(id) {
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
  }

  function handleDeletePosts() {
    selectedRowKeys.map((id) => {
      callDeletePost(id);
    });
  }

  function handleClickEditPost(id) {
    setAddOrUpdate(id);
    showModal();
  }

  const handleUpdatePost = (values) => {
    if (loggedIn) {
      api
        .put(`/posts/api/${addOrUpdate}`, {
          title: values.title,
          content: values.content,
        })
        .then((response) => {
          getPost();
          setIsModalOpen(false);
          setAddOrUpdate(0);
          message.success("Updated post successfully");
        })
        .catch((e) => {
          if (e.response.status === 403) {
            message.error("You have no permissions to edit this post");
            setIsModalOpen(false);
            setAddOrUpdate(0);
          }
        });
    } else {
      message.error("Please login to do this action");
    }
  };

  function handleClickViewPost(id) {
    navigate(`/app/blog/${id}`);
  }

  function handleClickAddPost() {
    showModal();
  }

  const handleAddPost = (values) => {
    const title = values.title;
    const content = values.content;
    formPostRef.current.resetFields();
    const category = getCategoryInfo(id);

    // // add new post to database
    api
      .post(`/posts/api/`, { title: title, content: content })
      .then((response) => {
        // add post success but no add in posts in category
        const arrPostId = gatherPostId();
        const newPostId = response.data.data;
        arrPostId.push(newPostId);
        // update category with new post
        api
          .put(`/categories/api/${id}/`, {
            title: category.title,
            parent_id: category.parent_id,
            posts: arrPostId,
          })
          .then((response) => {
            message.success("Add post success");
            setPosts(response.data.data);
            setIsModalOpen(false);
          })
          .catch((e) => {});
      })
      .catch((e) => {});
  };

  // modal
  // update initialValue of form when item change
  useEffect(() => {
    form.setFieldsValue({
      title: getInfoPost(addOrUpdate).title,
      content: getInfoPost(addOrUpdate).content,
    });
  }, [addOrUpdate]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAddOrUpdate(0);
    formPostRef.current.resetFields();
  };

  return (
    <div className={styles.container}>
      <div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          onChange={onChange}
          className={styles.table}
        />
        <div
          style={{
            marginBottom: 16,
          }}
          className={styles.selected_count}
        >
          <span>
            {selectedRowKeys.length > 0 ? (
              <DeleteOutlined
                className={styles.btn_delete_all}
                title="Xóa bài viết đã chọn"
                onClick={() => handleDeletePosts()}
              />
            ) : (
              <DeleteOutlined className={styles.btn_delete_all_disabled} />
            )}
          </span>
          <span
            style={{
              marginLeft: 8,
            }}
          >
            {hasSelected ? `Đã chọn ${selectedRowKeys.length} bài viết` : ""}
          </span>
        </div>
      </div>
      <Modal
        title={
          addOrUpdate == 0 ? "Thêm bài viết mới" : `Sửa bài viết ${addOrUpdate}`
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="70%"
        className={styles.modal}
        ref={modalRef}
      >
        <Form
          form={form}
          onFinish={addOrUpdate == 0 ? handleAddPost : handleUpdatePost}
          {...layout}
          ref={formPostRef}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập trường này! " }]}
          >
            <TextArea placeholder="Tiêu đề..." autoSize />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập trường này! " }]}
          >
            <TextArea
              placeholder="Nội dung..."
              autoSize={{
                minRows: 3,
                maxRows: 30,
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryDetail;