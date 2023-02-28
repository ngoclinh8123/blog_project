import {useState} from 'react'
import './DefaultLayout.module.scss'
import {Layout} from 'antd'
import Headers from './Headers'
import Siders from './Siders'
import Contents from './Contents'

// const {Header,Content,Sider} =Layout

function DefaultLayout({children}){
    return (
        <div className='container'>
            <Layout>
                <Headers/>
                <Layout>
                    <Siders/>
                    <Layout style={{padding:'0 24px 24px',}}>
                        <Contents>{children}</Contents>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    )
}

export default DefaultLayout