import axios from 'axios'
import Cookies from 'universal-cookie'
import {Link,useNavigate} from 'react-router-dom'
import { Button, Form, Input,message} from 'antd';
import styles from "./Login.module.scss"


function Login(){

    const navigate = useNavigate()

    function onFinish(values){
        axios.post(`${import.meta.env.VITE_URL_API}/auth/token/`,{username:values.username,password:values.password})
            .then(response =>{
                const cookie = new Cookies()
                cookie.set('token',response.data.data,{path:'/',maxAge:3600})
                message.success("Login success")
                navigate('/')
            })
            .catch(e =>{
                message.error("Account does not exist")
            })
    };

    function onFinishFailed(errorInfo){
        console.log('Failed:', errorInfo);
    };
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Login</h2>
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
                label="Username"
                name="username"
                rules={[
                    {
                    required: true,
                    message: 'Please input your username!',
                    },
                ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                    required: true,
                    message: 'Please input your password!',
                    },
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
                    <Link to="/forgot-password" className={styles.reset_password_title}>Forgot password ?</Link>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login