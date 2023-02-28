import {useState,useEffect} from 'react'
import classNames from 'classnames/bind'
import {get_data} from '../../api'
import styles from './Blog.module.scss'

const cx= classNames.bind(styles)

function Blog(){
    return (
        <div>
            <h1 className={cx('title')}>blog page</h1>

        </div>
    )
}

export default Blog