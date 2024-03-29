import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import api from "/src/service/axios/api";
import styles from "./forgot_password.module.css";

function ForgotPassword() {
  const navigate = useNavigate();

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
  /* eslint-enable no-template-curly-in-string */

  function onFinish(values) {
    const email = values["user"]["email"];
    if (email === "" || email === undefined) {
      message.warning("Please enter your email");
    } else {
      api
        .post("/api/v1/auth/forgot-password/", { email: email })
        .then((response) => {
          navigate("/forgot-password/result");
        })
        .catch((e) => {
          message.error("Send email failed");
        });
    }
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Forgot password</h2>
      <p className={styles.content}>
        Forgot your password? Don't worry! Please provide us with the email you
        used to register your account. We will send you a link to reset your
        password via that email.
      </p>
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
          name={["user", "email"]}
          label="Email"
          rules={[
            {
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
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

export default ForgotPassword;
