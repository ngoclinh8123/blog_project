import { Result } from "antd";

function SendMailResult() {
  return (
    <Result
      status="success"
      title="Send email successfully"
      subTitle="Please check your email"
      extra={[]}
    />
  );
}

export default SendMailResult;
