import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, message, Table, Modal } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
// react quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import { AuthContext } from "/src/util/context/auth_context";
import convertDate from "/src/util/convert_date";
import styles from "./blog.module.css";

const onChange = (pagination, filters, sorter, extra) => {
  // console.log("params", pagination, filters, sorter, extra);
};

function Blog() {
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addOrUpdate, setAddOrUpdate] = useState(0);
  const location = useLocation();
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
      onFilter: (value, record) => record.customer.includes(value),
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
    if (posts.items && posts.items.length > 0) {
      posts.items.forEach((post) => {
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
    if (posts.items && posts.items.length > 0) {
      posts.items.forEach((post) => {
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

  function getPost(path = "/api/v1/post/") {
    api
      .get(path)
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

  useEffect(() => {
    getPost();
  }, [location, refresh]);

  // Use an effect hook to set the onTokenRefreshed callback to update the refresh flag
  useEffect(() => {
    setOnTokenRefreshed(() => {
      setRefresh(true);
    });
  }, []);

  function getInfoPost(id) {
    let result = {};
    if (posts.items && posts.items.length > 0) {
      posts.items.forEach((post) => {
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
      message.error("Vui lòng đăng nhập để thực hiện hành dộng");
    }
  }

  function callDeletePost(id) {
    api
      .delete(`/api/v1/post/${id}/`)
      .then((response) => {
        message.success(`Xóa bài viết ${id} thành công`);
        getPost();
      })
      .catch((e) => {
        if (e.response.status === 403) {
          message.error(`Bạn không có quyền xóa bài viết ${id}`);
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
        .put(`/api/v1/post/${addOrUpdate}/`, {
          title: values.title,
          content: values.content,
        })
        .then((response) => {
          getPost();
          setIsModalOpen(false);
          setAddOrUpdate(0);
          message.success("Cập nhật bài viết thành công");
        })
        .catch((e) => {
          if (e.response.status === 403) {
            message.error("Bạn không có quyền sửa bài viết này");
            setIsModalOpen(false);
            setAddOrUpdate(0);
          }
        });
    } else {
      message.error("Vui lòng đăng nhập để sửa bài viết");
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

    // // add new post to database
    api
      .post(`/api/v1/post/`, { title: title, content: content })
      .then((response) => {
        getPost();
        setIsModalOpen(false);
        message.success("Thêm bài viết thành công");
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

  // pagination
  function handleClickPrevBtn() {
    getPost(posts.pagination.link.prev);
  }

  function handleClickNextBtn() {
    getPost(posts.pagination.link.next);
  }
  

  return (
    <div className={styles.container}>
      <div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          onChange={onChange}
          className={styles.table}
          pagination={false}
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
        <div className={styles.pagination}>
          {posts.pagination &&
          posts.pagination.link &&
          posts.pagination.link.prev ? (
            <span
              className={styles.pagination_item}
              onClick={() => handleClickPrevBtn()}
            >
              <LeftOutlined />
            </span>
          ) : (
            <span className={styles.pagination_item_fake}>
              <LeftOutlined />
            </span>
          )}

          <span className={styles.pagination_cr_page} title="current page">
            {posts.pagination && posts.pagination.current_page
              ? posts.pagination.current_page
              : 1}
          </span>
          {posts.pagination &&
          posts.pagination.link &&
          posts.pagination.link.next ? (
            <span
              className={styles.pagination_item}
              onClick={() => handleClickNextBtn()}
            >
              <RightOutlined />
            </span>
          ) : (
            <span className={styles.pagination_item_fake}>
              <RightOutlined />
            </span>
          )}
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
            <ReactQuill

              placeholder="Nội dung..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
                clipboard: {
                  matchVisual: false,
                },
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "bullet",
                "link",
                "image",
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Blog;
