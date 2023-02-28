import {Layout} from 'antd'
import './Contents.module.scss'
const {Content}=Layout


function Contents({children}){
    return (
        <Content style={{padding:'24px',margin:'0'}}>
            {children}
        </Content>
    )
}

export default Contents