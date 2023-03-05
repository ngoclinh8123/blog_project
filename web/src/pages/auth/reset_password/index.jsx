import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import styles from "./reset_password.module.scss";

function ResetPassword() {
  const navigate = useNavigate();

  function onFinish(values) {
    const url = `${import.meta.env.VITE_URL_API}/auth/reset_password/`;
    const new_password = values["password"];

    // get token from url 
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    axios
      .post(url,{ new_password: new_password },{
          headers: {Authorization: `JWT ${token}`
      }})
      .then(response=>{
        message.success("Reset password successfully");
        navigate("/login");
      })
      .catch(e=>{
        message.error("Reset password failed");
      })
  }
  
  function onFinishFailed(errorInfo) {
    console.log("Failed:", errorInfo);
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reset password</h2>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ResetPassword;
