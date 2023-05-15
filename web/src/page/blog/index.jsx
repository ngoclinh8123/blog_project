import { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Form, Input, message, Table, Modal, Button, Upload } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import CustomBreadCrum from "/src/component/layout/default_layout/bread_crum";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import { AuthContext } from "/src/util/context/auth_context";
import convertDate from "/src/util/convert_date";
import { cleanEditorJS } from "/src/util/clean_editor_js";
import convertContent from "/src/util/convert_content";
import styles from "./blog.module.css";

const onChange = (pagination, filters, sorter, extra) => {
  // console.log("params", pagination, filters, sorter, extra);
};

function Blog() {
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addOrUpdate, setAddOrUpdate] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const location = useLocation();
  const { loggedIn } = useContext(AuthContext);

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
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
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
            title="xem trước bài viết"
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

  const editorRef = useRef(null);

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
        if (e.response && e.response.status === 404) {
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
    setSelectedRowKeys([]);
  }

  function handleClickEditPost(id) {
    setAddOrUpdate(id);
    showModal();
  }

  const handleUpdatePost = (values) => {
    if (loggedIn) {
      const image = values.image
        ? values.image.file.response.file.url
        : getInfoPost(addOrUpdate).image;

      editorRef.current.save().then((savedData) => {
        api
          .put(`/api/v1/post/${addOrUpdate}/`, {
            title: values.title,
            content: JSON.stringify(savedData),
            desc: values.desc,
            image: image,
          })
          .then((response) => {
            getPost();
            setIsModalOpen(false);
            setAddOrUpdate(0);
            setCurrentImageUrl(null);
            message.success("Cập nhật bài viết thành công");
          })
          .catch((e) => {
            if (e.response.status === 403) {
              message.error("Bạn không có quyền sửa bài viết này");
              setIsModalOpen(false);
              setAddOrUpdate(0);
            }
          });
      });
    } else {
      message.error("Vui lòng đăng nhập để sửa bài viết");
    }
  };

  function handleClickViewPost(id) {
    setViewItem(getInfoPost(id));
    showModalView();
  }

  function handleClickAddPost() {
    setAddOrUpdate(0);
    showModal();
  }

  const handleAddPost = (values) => {
    editorRef.current.save().then((savedData) => {
      const title = values.title;
      const desc = values.desc;

      let image = "";
      if (values.image.file && values.image.file.response) {
        image = values.image.file.response.file.url;
      }

      const content = JSON.stringify(savedData);

      // add new post to database
      api
        .post(`/api/v1/post/`, {
          title: title,
          content: content,
          desc: desc,
          image: image,
        })
        .then((response) => {
          getPost();
          setIsModalOpen(false);
          formPostRef.current.resetFields();
          setAddOrUpdate(null);
          setCurrentImageUrl(null);
          message.success("Thêm bài viết thành công");
        })
        .catch((e) => {});
    });
  };

  // modal
  // update initialValue of form when item change
  useEffect(() => {
    // remove redundant codex-editor block
    cleanEditorJS();

    const currentPost = getInfoPost(addOrUpdate);

    if (addOrUpdate > 0) {
      setCurrentImageUrl(currentPost.image);
    }

    form.setFieldsValue({
      title: currentPost.title,
      desc: currentPost.desc,
    });

    const editor = new EditorJS({
      holder: "editorjs",
      minHeight: 0,
      placeholder: "Nội dung...",
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["link"],
        },
        linkTool: {
          class: LinkTool,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `${import.meta.env.VITE_URL_API}/api/v1/image-content/`,
            },
          },
        },
      },
      data: addOrUpdate ? JSON.parse(getInfoPost(addOrUpdate).content) : null,
    });
    editorRef.current = editor;
  }, [addOrUpdate]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalView = () => {
    setIsModalViewOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAddOrUpdate(0);
    setCurrentImageUrl(null);
  };

  const handleCancelView = () => {
    setViewItem(null);
    setIsModalViewOpen(false);
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
      <CustomBreadCrum />
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
      {/* modal with form to add or update */}
      <Modal
        title={
          addOrUpdate ? `Sửa bài viết ${addOrUpdate}` : "Thêm bài viết mới"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="700px"
        ref={modalRef}
      >
        <Form
          form={form}
          onFinish={addOrUpdate ? handleUpdatePost : handleAddPost}
          {...layout}
          ref={formPostRef}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập trường này! " }]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <TextArea placeholder="Tiêu đề..." autoSize />
          </Form.Item>
          <Form.Item
            label="Ảnh mô tả"
            name="image"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Upload
              // add this key to re render template
              key={currentImageUrl}
              action={`${import.meta.env.VITE_URL_API}/api/v1/image-content/`}
              listType="picture"
              maxCount={1}
              defaultFileList={
                addOrUpdate == 0 ? [] : [{ url: currentImageUrl }]
              }
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="desc"
            rules={[{ required: true, message: "Vui lòng nhập trường này! " }]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <TextArea
              placeholder="Mô tả..."
              autoSize={{
                minRows: 2,
                maxRows: 6,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            // rules={[{ required: true, message: "Vui lòng nhập trường này! " }]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <div id="editorjs" className={styles.form_item_content}></div>
          </Form.Item>
        </Form>
      </Modal>

      {/* modal to view post */}
      {viewItem != null && (
        <Modal
          open={isModalViewOpen}
          title=""
          onCancel={handleCancelView}
          width="700px"
          footer={[
            <Button key="back" onClick={handleCancelView} type="primary">
              OK
            </Button>,
          ]}
        >
          <div className={styles.post_content}>
            <h2 className={styles.title}>{viewItem.title}</h2>
            <div className={styles.post_info}>
              <div className={styles.post_info_content}>
                <span>{convertDate(viewItem.created_at)}</span>
                {/* <span>{viewItem.customer.username}</span> */}
              </div>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: convertContent(viewItem.content).join(""),
              }}
              className={styles.content}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Blog;
