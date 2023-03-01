import {useState,useEffect,useContext} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {Layout,Menu} from 'antd'
import { UserOutlined,AppstoreOutlined } from '@ant-design/icons';
import {get_data} from '../../../../api'
import styles from './Siders.module.scss'

const SubMenu=Menu.SubMenu
const {Sider} = Layout
const rootSubmenuKeys = ['/','/profile', '1',];

function Siders(){
  const [categories,setCategories]=useState([])
  const [openKeys, setOpenKeys] = useState(['/']);
  const navigate=useNavigate()

  useEffect(()=>{
    const url =`${import.meta.env.VITE_URL_API}/categories/api`
    get_data(url)
      .then(response=>{
        setCategories(response.data["data"])
      })
  },[])

  function render_category_item(categories) {
    return categories.map(category => {
      if (category.childs && category.childs.length) {
        return (
          <SubMenu key={`/category/${category.id}`} title={category.title}>
            {render_category_item(category.childs)}
          </SubMenu>
        )
      } else {
        return (
          <Menu.Item key={`/category/${category.id}`} >
            <Link to={`/category?pk=${category.id}`}>
              {category.title}
            </Link>
          </Menu.Item>
        )
      }
    })
  }

  function onOpenChange(keys){
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
    
    return (
        <Sider width={256} style={{backgroundColor:'#ccc',minHeight:"100vh"}}>
            <Menu mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} >
              <Menu.Item key="/profile">
                <Link to="/profile">
                  <UserOutlined />
                  <span className={styles.category_item_title}>Profile</span>
                </Link>
              </Menu.Item>
              <SubMenu key="category" title="Category" icon ={<AppstoreOutlined />}>
                {render_category_item(categories)}
              </SubMenu>
            </Menu>
        </Sider>
    )
}

export default Siders