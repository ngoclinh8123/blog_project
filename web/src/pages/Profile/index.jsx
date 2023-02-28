import {useEffect,useState} from 'react'
import Cookies from 'universal-cookie'
import styles from './Profile.module.scss'
import {get_data} from '../../api'

function Profile(){
    const cookie = new Cookies()
    const token=cookie.get('token')
    const [user,setUser]=useState({})
    useEffect(()=>{
        get_data("http://127.0.0.1:8000/auth/user_info/",token)
            .then(response=>{
                if(response){
                    setUser(response.data['data'])
                }
            })
    },[])

    return (
        <div className={styles.container}>
            <div>
                <span>User name: </span><span>{user.username}</span>
            </div>
            <div>
                <span>Email: </span><span>{user.email}</span>
            </div>
            <div>
                <span>First name: </span><span>{user.first_name}</span>
            </div>
            <div>
                <span>Last name: </span><span>{user.last_name}</span>
            </div>
            <div>
                <span>Date joined: </span><span>{user.date_joined}</span>
            </div>
        </div>
    )
}

export default Profile