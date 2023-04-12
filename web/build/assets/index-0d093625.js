import{Q as p,a as r,j as e,E as d,U as n,V as h}from"./index-5e742874.js";import{b as a,I as y}from"./index-77a729b2.js";import"./EyeOutlined-f52d48b6.js";const b="_container_oqcot_1",w="_title_oqcot_8",g="_content_oqcot_12",s={container:b,title:w,content:g};function $(){const i=p(),o={labelCol:{span:8},wrapperCol:{span:16}},l={required:"${label} is required!",types:{email:"${label} is not a valid email!",number:"${label} is not a valid number!"},number:{range:"${label} must be between ${min} and ${max}"}};function m(c){const t=c.user.email;t===""||t===void 0?n.warning("Please enter your email"):h.post("/api/v1/auth/forgot-password/",{email:t}).then(u=>{i("/forgot-password/result")}).catch(u=>{n.error("Send email failed")})}return r("div",{className:s.container,children:[e("h2",{className:s.title,children:"Forgot password"}),e("p",{className:s.content,children:"Forgot your password? Don't worry! Please provide us with the email you used to register your account. We will send you a link to reset your password via that email."}),r(a,{...o,name:"nest-messages",onFinish:m,style:{maxWidth:600},validateMessages:l,children:[e(a.Item,{name:["user","email"],label:"Email",rules:[{type:"email"}],children:e(y,{})}),e(a.Item,{wrapperCol:{...o.wrapperCol,offset:8},children:e(d,{type:"primary",htmlType:"submit",children:"Submit"})})]})]})}export{$ as default};
