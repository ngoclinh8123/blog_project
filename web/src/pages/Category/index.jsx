import {useState,useEffect} from 'react'
import {Link,useLocation} from 'react-router-dom'
import {get_data} from '../../api'
import styles from './Category.module.scss'

function Category(){
    const [posts,setPosts] = useState([])
    const location = useLocation();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('pk');
        
        
    useEffect(() => {
        const url= `http://127.0.0.1:8000/categories/api/${id}`
        get_data(url)
            .then(response=>{
                setPosts(response.data["data"])
            })
    }, [location]);
    

    return (
        <div className={styles.container}>
            <ul>
                {posts.map((post,index)=>(
                    <li key={index} className={styles.item}>
                        <Link to="/blog">
                            <p className={styles.item_title}>{post.title}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Category;