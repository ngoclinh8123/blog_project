import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { Table, Input, Form, Modal, message, TreeSelect, Transfer } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LineOutlined,
} from "@ant-design/icons";
import CustomBreadCrum from "/src/component/layout/default_layout/bread_crum";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import { AuthContext } from "/src/util/context/auth_context";
import styles from "./category.module.css";

const onChange = (pagination, filters, sorter, extra) => {
  // console.log("params", pagination, filters, sorter, extra);
};

function Category() {
  const [category, setCategory] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addOrUpdate, setAddOrUpdate] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { loggedIn, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // table
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  // modal
  const formCategoryRef = useRef(null);
  const modalRef = useRef(null);
  const { TextArea } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  //tranfer
  const [targetKeys, setTargetKeys] = useState([]);
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  function getCategory() {
    api
      .get("/api/v1/category/")
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

  function getPost() {
    api
      .get(`/api/v1/post/`)
      .then((response) => {
        if (response) {
          setPosts(response.data.data.items);
        }
      })
      .catch((e) => {
        console.log("aaaaa");
        if (e.response.status === 404) {
          setPosts({});
        }
      });
  }

  // table
  function handleTitleFilter() {
    const result = [];
    if (category.length > 0) {
      category.forEach((item) => {
        if (item.childs) {
          const item_child = [];
          item.childs.forEach((child) => {
            item_child.push({ text: child.title, value: child.title });
          });
          result.push({
            text: item.title,
            value: item.title,
            children: item_child,
          });
        } else {
          result.push({ text: item.title, value: item.title });
        }
      });
    }
    return result;
  }

  function getParentTitle(id) {
    if (id === 0) {
      return <LineOutlined />;
      // return "";
    }
    let result = "";
    if (category.length > 0) {
      category.forEach((item) => {
        if (item.id === id) {
          result = item.title;
        }
        if (item.childs) {
          item.childs.forEach((child) => {
            if (child.id === id) {
              result = child.title;
            }
          });
        }
      });
      return result;
    }
    return result;
  }

  function handleTreeSelectItem() {
    const result = [];
    result.push({ value: 0, title: <LineOutlined /> });
    if (category.length > 0) {
      category.forEach((item) => {
        if (item.childs) {
          const item_child = [];
          item.childs.forEach((child) => {
            item_child.push({ value: child.id, title: child.title });
          });
          result.push({
            value: item.id,
            title: item.title,
            children: item_child,
          });
        } else {
          result.push({ value: item.id, title: item.title });
        }
      });
    }
    return result;
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

  function handleTitleData() {
    const result = [];
    if (category.length > 0) {
      category.forEach((item) => {
        result.push({
          key: item.id,
          id: item.id,
          title: item.title,
          parent: getParentTitle(item.parent_id), // khong co parent :))
          posts:
            item.posts.length > 0 ? item.posts.join(", ") : <LineOutlined />,
        });
        if (item.childs) {
          item.childs.forEach((child) => {
            result.push({
              key: child.id,
              id: child.id,
              title: child.title,
              parent: getParentTitle(child.parent_id),
              posts:
                child.posts.length > 0 ? (
                  child.posts.join(", ")
                ) : (
                  <LineOutlined />
                ),
            });
          });
        }
      });
    }
    return result;
  }

  function handleDataSelectPost() {
    const result = [];
    if (posts.length > 0) {
      posts.forEach((post) => {
        result.push({ key: post.id, title: post.title });
      });
    }
    return result;
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.id - b.id,
      width: "5%",
    },
    {
      title: "Danh mục",
      dataIndex: "title",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.title.localeCompare(b.title),
      filters: handleTitleFilter(),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.title.includes(value),
      width: "20%",
      className: styles.header_title,
    },
    {
      title: "Danh mục cha",
      dataIndex: "parent",
      width: "20%",
      className: styles.header_title,
    },
    {
      title: "Bài viết",
      dataIndex: "posts",
      width: "40%",
      className: styles.header_title,
    },
    {
      title: (
        <PlusOutlined
          onClick={() => handleClickAddCategory()}
          className={styles.btn_add}
        />
      ),
      dataIndex: "",
      key: "x",
      render: (value) => (
        <span>
          <EyeOutlined
            onClick={() => handleClickViewCategory(value.key)}
            className={styles.btn_action}
            title="xem bài viết thuộc danh mục"
          />
          <EditOutlined
            onClick={() => handleClickEditCategory(value.key)}
            className={styles.btn_action}
            title="sửa danh mục"
          />
          <DeleteOutlined
            onClick={() => handleClickDeleteCategory(value.key)}
            className={styles.btn_action}
            title="xóa danh mục"
          />
        </span>
      ),
    },
  ];

  const data = handleTitleData();

  useEffect(() => {
    getCategory();
    getPost();
  }, [refresh]);

  // Use an effect hook to set the onTokenRefreshed callback to update the refresh flag
  useEffect(() => {
    setOnTokenRefreshed(() => {
      setRefresh(true);
    });
  }, []);

  function handleClickAddCategory() {
    showModal();
  }

  function handleAddCategory(values) {
    if (!values.posts) {
      values.posts = [];
    }

    if (loggedIn) {
      api
        .post(`/api/v1/category/`, {
          title: values.title,
          parent_id: values.parent_id,
          posts: values.posts,
        })
        .then((response) => {
          getCategory();
          message.success("Thêm danh mục thành công");
          setIsModalOpen(false);
          formCategoryRef.current.resetFields();
        })
        .catch((e) => {
          if (e.response.status === 403) {
            setIsModalOpen(false);
            formCategoryRef.current.resetFields();
            message.error("Bạn không có quyền thêm danh mục");
          } else if (e.response.status === 400) {
            message.error("Danh mục đã tồn tại");
          }
        });
    } else {
      message.error("Vui lòng đăng nhập để thực hiện hành động này");
      setIsModalOpen(false);
    }
  }

  function callDeleteCategory(id) {
    api
      .delete(`/api/v1/category/${id}/`)
      .then((response) => {
        getCategory();
        message.success(`Xóa danh mục ${id} thành công`);
      })
      .catch((e) => {
        if (e.response.status === 403) {
          message.error(`Bạn không có quyền xóa danh mục ${id}`);
        }
      });
  }

  function handleClickDeleteCategory(id) {
    if (loggedIn) {
      callDeleteCategory(id);
    } else {
      message.error("Vui lòng đăng nhập để thực hiện hành động này");
      setIsModalOpen(false);
    }
  }

  function handleDeleteCategories() {
    if (selectedRowKeys.length > 0) {
      selectedRowKeys.forEach((id) => callDeleteCategory(id));
    }
  }

  function handleClickEditCategory(id) {
    setAddOrUpdate(id);
    showModal();
  }

  function handleUpdateCategory(values) {
    if (!values.posts) {
      values.posts = [];
    }

    if (loggedIn) {
      api
        .put(`/api/v1/category/${addOrUpdate}/`, {
          title: values.title,
          parent_id: values.parent_id,
          posts: values.posts,
        })
        .then((response) => {
          getCategory();
          message.success("Sửa  danh mục thành công");
          setIsModalOpen(false);
          formCategoryRef.current.resetFields();
        })
        .catch((e) => {
          if (e.response.status === 403) {
            setIsModalOpen(false);
            formCategoryRef.current.resetFields();
            message.error("Bạn không có quyền sửa danh mục");
          } else if (e.response.status === 400) {
            message.error("Danh mục đã tồn tại");
          }
        });
    } else {
      message.error("Vui lòng đăng nhập để thực hiện hành động này");
      setIsModalOpen(false);
    }
  }

  function handleClickViewCategory(id) {
    navigate(`/app/category/${id}`);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAddOrUpdate(0);
    formCategoryRef.current.resetFields();
  };

  const handleChangeSelectPostAdd = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  // modal
  // update initialValue of form when item change
  useEffect(() => {
    setTargetKeys(getCategoryInfo(addOrUpdate).posts);
    form.setFieldsValue({
      title: getCategoryInfo(addOrUpdate).title,
      parent_id: getCategoryInfo(addOrUpdate).parent_id,
      posts: getCategoryInfo(addOrUpdate).posts,
    });
  }, [addOrUpdate]);

  return (
    <div className={styles.container}>
      <CustomBreadCrum />
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        onChange={onChange}
        className={styles.table}
        paginations={false}
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
              title="Xóa danh mục đã chọn"
              onClick={() => handleDeleteCategories()}
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
          {hasSelected ? `Đã chọn ${selectedRowKeys.length} danh mục` : ""}
        </span>
      </div>
      <Modal
        title={
          addOrUpdate == 0 ? "Thêm danh mục mới" : `Sửa danh mục ${addOrUpdate}`
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
          onFinish={addOrUpdate == 0 ? handleAddCategory : handleUpdateCategory}
          {...layout}
          ref={formCategoryRef}
        >
          <Form.Item
            label="Tên"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập trường này! " }]}
          >
            <TextArea placeholder="Tên danh mục..." autoSize />
          </Form.Item>

          <Form.Item
            label=" Danh mục cha"
            name="parent_id"
            rules={[{ required: true, message: "Vui lòng nhập trường này! " }]}
          >
            <TreeSelect
              placeholder="Chọn danh mục cha"
              treeLine="true"
              style={{ width: 300 }}
              treeData={handleTreeSelectItem()}
            />
          </Form.Item>
          <Form.Item label="Bài viết" name="posts" style={{ width: "100%" }}>
            <Transfer
              dataSource={handleDataSelectPost()}
              showSearch
              targetKeys={targetKeys}
              onChange={handleChangeSelectPostAdd}
              render={(item) => item.title}
              className={styles.form_transfer}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Category;
