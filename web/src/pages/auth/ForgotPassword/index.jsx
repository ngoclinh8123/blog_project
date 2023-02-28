import {useNavigate} from 'react-router-dom'
import { Button, Form, Input,message} from 'antd';
import styles from './ForgotPassword.module.scss'
import {post_data_no_token} from "../../../api"

function ForgotPassword(){

    const navigate = useNavigate()

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      };
    const validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          number: '${label} is not a valid number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
      };
      /* eslint-enable no-template-curly-in-string */
      
      const onFinish = (values) => {
        const url="http://127.0.0.0:8000/auth/forgot_password/"
        const email=values["user"]["email"]
        if(email==="" || email === undefined) {
          message.warning("Please enter your email")
        }else{
          try{
            post_data_no_token(url,{email:email})
            navigate('/forgot-password/result')
          }catch(err){
            message.error("Send email failed")
          }
        }
      };
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Forgot password</h2>
            <p className={styles.content}>Forgot your password? Don't worry! Please provide us with the email you used to register your account. We will send you a link to reset your password via that email.</p>
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
                name={['user', 'email']}
                label="Email"
                rules={[
                    {
                    type: 'email',
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
    )
}

export default ForgotPassword